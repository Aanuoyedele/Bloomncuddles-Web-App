import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

// Get contacts for the current user (Parent perspective)
export const getContacts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        let schoolId = req.user?.schoolId;

        if (!userId) {
            res.status(400).json({ message: 'User context missing' });
            return;
        }

        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                children: {
                    include: {
                        student: {
                            include: {
                                class: {
                                    include: {
                                        teacher: true,
                                        school: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!currentUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const contactsMap = new Map<string, any>();
        const schoolIds = new Set<string>();

        // For parents, derive schoolId from their children
        if (currentUser.role === 'PARENT' && currentUser.children.length > 0) {
            currentUser.children.forEach(relation => {
                if (relation.student.class?.school?.id) {
                    schoolIds.add(relation.student.class.school.id);
                }

                // Add Teachers (linked to children)
                const teacher = relation.student.class?.teacher;
                if (teacher && teacher.isActive) {
                    contactsMap.set(teacher.id, {
                        id: teacher.id,
                        name: teacher.name,
                        role: `Teacher (${relation.student.class.name})`,
                        avatar: teacher.name.charAt(0),
                        childName: relation.student.name
                    });
                }
            });
        }

        // Use schoolId from token or from children
        const schoolIdsToQuery = schoolId ? [schoolId] : Array.from(schoolIds);

        // Add Admins from all relevant schools
        if (schoolIdsToQuery.length > 0) {
            const admins = await prisma.user.findMany({
                where: {
                    schoolId: { in: schoolIdsToQuery },
                    role: 'ADMIN',
                    isActive: true
                }
            });

            admins.forEach(admin => {
                if (admin.id !== userId) {
                    contactsMap.set(admin.id, {
                        id: admin.id,
                        name: admin.name,
                        role: 'School Admin',
                        avatar: admin.name.charAt(0)
                    });
                }
            });
        }

        // For Teachers - get parents of students in their classes
        if (currentUser.role === 'TEACHER' && schoolId) {
            const classes = await prisma.class.findMany({
                where: { teacherId: userId },
                include: {
                    students: {
                        include: {
                            parents: {
                                include: { parent: true }
                            }
                        }
                    }
                }
            });

            classes.forEach(cls => {
                cls.students.forEach((student: any) => {
                    student.parents.forEach((rel: any) => {
                        const parent = rel.parent;
                        if (parent.isActive) {
                            contactsMap.set(parent.id, {
                                id: parent.id,
                                name: parent.name,
                                role: `Parent (${student.name})`,
                                avatar: parent.name.charAt(0),
                                childName: student.name
                            });
                        }
                    });
                });
            });

            // Also add other teachers and admins from same school
            const colleagues = await prisma.user.findMany({
                where: {
                    schoolId,
                    role: { in: ['TEACHER', 'ADMIN'] },
                    isActive: true,
                    id: { not: userId }
                }
            });
            colleagues.forEach(c => {
                contactsMap.set(c.id, {
                    id: c.id,
                    name: c.name,
                    role: c.role === 'ADMIN' ? 'School Admin' : 'Teacher',
                    avatar: c.name.charAt(0)
                });
            });
        }

        // For Admins - get all parents and teachers in school
        if (currentUser.role === 'ADMIN' && schoolId) {
            // Get all parents with children in this school
            const parentsInSchool = await prisma.user.findMany({
                where: {
                    role: 'PARENT',
                    isActive: true,
                    children: {
                        some: {
                            student: {
                                class: { schoolId }
                            }
                        }
                    }
                },
                include: {
                    children: {
                        include: { student: true }
                    }
                }
            });

            parentsInSchool.forEach(parent => {
                const childNames = parent.children.map(c => c.student.name).join(', ');
                contactsMap.set(parent.id, {
                    id: parent.id,
                    name: parent.name,
                    role: `Parent (${childNames})`,
                    avatar: parent.name.charAt(0)
                });
            });

            // Get all teachers in school
            const teachers = await prisma.user.findMany({
                where: {
                    schoolId,
                    role: 'TEACHER',
                    isActive: true,
                    id: { not: userId }
                }
            });
            teachers.forEach(t => {
                contactsMap.set(t.id, {
                    id: t.id,
                    name: t.name,
                    role: 'Teacher',
                    avatar: t.name.charAt(0)
                });
            });

            // Other admins
            const otherAdmins = await prisma.user.findMany({
                where: {
                    schoolId,
                    role: 'ADMIN',
                    isActive: true,
                    id: { not: userId }
                }
            });
            otherAdmins.forEach(a => {
                contactsMap.set(a.id, {
                    id: a.id,
                    name: a.name,
                    role: 'School Admin',
                    avatar: a.name.charAt(0)
                });
            });
        }

        // Get unread counts
        const contacts = Array.from(contactsMap.values());

        for (const contact of contacts) {
            const unreadCount = await prisma.message.count({
                where: {
                    senderId: contact.id,
                    receiverId: userId,
                    isRead: false
                }
            });
            contact.unreadCount = unreadCount;

            // Get last message
            const lastMessage = await prisma.message.findFirst({
                where: {
                    OR: [
                        { senderId: userId, receiverId: contact.id },
                        { senderId: contact.id, receiverId: userId }
                    ]
                },
                orderBy: { createdAt: 'desc' }
            });

            contact.lastMessage = lastMessage ? {
                content: lastMessage.content,
                createdAt: lastMessage.createdAt
            } : null;

            // Get status info (online, last seen, availability)
            const contactUser = await prisma.user.findUnique({
                where: { id: contact.id },
                select: {
                    isOnline: true,
                    lastSeenAt: true,
                    isAvailableToChat: true
                }
            });

            if (contactUser) {
                contact.isOnline = contactUser.isOnline;
                contact.lastSeenAt = contactUser.lastSeenAt;
                contact.isAvailableToChat = contactUser.isAvailableToChat;
            }
        }

        // Sort by last message date
        contacts.sort((a, b) => {
            const dateA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
            const dateB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
            return dateB - dateA;
        });

        res.json(contacts);
    } catch (error) {
        console.error('Get Contacts error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get messages with a specific user
export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { contactId } = req.params;

        if (!userId) {
            res.status(400).json({ message: 'User context missing' });
            return;
        }

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId, receiverId: contactId },
                    { senderId: contactId, receiverId: userId }
                ]
            },
            orderBy: { createdAt: 'asc' }
        });

        // Mark as read
        await prisma.message.updateMany({
            where: {
                senderId: contactId,
                receiverId: userId,
                isRead: false
            },
            data: { isRead: true }
        });

        res.json(messages);
    } catch (error) {
        console.error('Get Messages error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Send a message
export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        let schoolId = req.user?.schoolId;
        const { receiverId, content, type, contextId } = req.body;

        if (!userId) {
            res.status(400).json({ message: 'User context missing' });
            return;
        }

        if (!receiverId || !content) {
            res.status(400).json({ message: 'Receiver and content are required' });
            return;
        }

        // If sender doesn't have schoolId (e.g., parent), get it from the receiver
        if (!schoolId) {
            const receiver = await prisma.user.findUnique({
                where: { id: receiverId },
                select: { schoolId: true }
            });
            schoolId = receiver?.schoolId || undefined;
        }

        // If still no schoolId, try to get from sender's children
        if (!schoolId) {
            const sender = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    children: {
                        include: {
                            student: {
                                include: { class: { select: { schoolId: true } } }
                            }
                        }
                    }
                }
            });
            const firstChildSchoolId = sender?.children[0]?.student?.class?.schoolId;
            schoolId = firstChildSchoolId || undefined;
        }

        const message = await prisma.message.create({
            data: {
                senderId: userId,
                receiverId,
                schoolId: schoolId ?? undefined,
                content,
                type: type || 'general',
                contextId: contextId || null,
                isRead: false
            }
        });

        res.json(message);
    } catch (error) {
        console.error('Send Message error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
