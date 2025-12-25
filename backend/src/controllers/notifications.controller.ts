import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

// Get notifications for the current user
export const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { school: true }
        });

        if (!user?.schoolId) {
            res.json({ notifications: [], unreadCount: 0 });
            return;
        }

        // Generate dynamic notifications based on school data
        const notifications: any[] = [];
        const now = new Date();

        // Check for pending assignments (for teachers/admins)
        if (user.role === 'ADMIN' || user.role === 'TEACHER') {
            const pendingSubmissions = await prisma.submission.count({
                where: {
                    student: { class: { schoolId: user.schoolId } },
                    status: 'SUBMITTED'
                }
            });

            if (pendingSubmissions > 0) {
                notifications.push({
                    id: 'pending-submissions',
                    type: 'assignment',
                    title: 'Submissions Pending Review',
                    message: `${pendingSubmissions} assignment${pendingSubmissions > 1 ? 's' : ''} waiting to be graded`,
                    icon: 'assignment',
                    color: 'text-blue-600',
                    bg: 'bg-blue-100',
                    time: 'Now',
                    read: false,
                    link: '/dashboard/assignments'
                });
            }

            // Check for overdue assignments
            const overdueSubmissions = await prisma.submission.count({
                where: {
                    student: { class: { schoolId: user.schoolId } },
                    status: 'PENDING',
                    assignment: { dueDate: { lt: now } }
                }
            });

            if (overdueSubmissions > 0) {
                notifications.push({
                    id: 'overdue-assignments',
                    type: 'warning',
                    title: 'Overdue Assignments',
                    message: `${overdueSubmissions} student${overdueSubmissions > 1 ? 's' : ''} have missed deadlines`,
                    icon: 'warning',
                    color: 'text-orange-600',
                    bg: 'bg-orange-100',
                    time: 'Today',
                    read: false,
                    link: '/dashboard/reports'
                });
            }
        }

        // Check for new students (for admins)
        if (user.role === 'ADMIN') {
            const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            const newStudents = await prisma.student.count({
                where: {
                    class: { schoolId: user.schoolId },
                    createdAt: { gte: oneDayAgo }
                }
            });

            if (newStudents > 0) {
                notifications.push({
                    id: 'new-students',
                    type: 'info',
                    title: 'New Students',
                    message: `${newStudents} new student${newStudents > 1 ? 's' : ''} added in the last 24 hours`,
                    icon: 'person_add',
                    color: 'text-green-600',
                    bg: 'bg-green-100',
                    time: 'Today',
                    read: true,
                    link: '/dashboard/students'
                });
            }

            // Check subscription status
            const subscription = await prisma.subscription.findFirst({
                where: { schoolId: user.schoolId },
                orderBy: { createdAt: 'desc' }
            });

            if (subscription) {
                if (subscription.status === 'active' && subscription.nextPaymentDate) {
                    const daysUntilRenewal = Math.ceil(
                        (new Date(subscription.nextPaymentDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
                    );
                    if (daysUntilRenewal <= 7 && daysUntilRenewal > 0) {
                        notifications.push({
                            id: 'subscription-renewal',
                            type: 'billing',
                            title: 'Subscription Renewal',
                            message: `Your subscription renews in ${daysUntilRenewal} day${daysUntilRenewal > 1 ? 's' : ''}`,
                            icon: 'receipt_long',
                            color: 'text-purple-600',
                            bg: 'bg-purple-100',
                            time: `${daysUntilRenewal}d`,
                            read: true,
                            link: '/dashboard/billing'
                        });
                    }
                }
            }
        }

        // Add welcome notification if no others exist
        if (notifications.length === 0) {
            notifications.push({
                id: 'welcome',
                type: 'info',
                title: 'Welcome to Bloom n Cuddles!',
                message: 'Start by adding classes and students to your school',
                icon: 'waving_hand',
                color: 'text-primary',
                bg: 'bg-primary/10',
                time: 'Just now',
                read: true,
                link: '/dashboard'
            });
        }

        const unreadCount = notifications.filter(n => !n.read).length;

        res.json({ notifications, unreadCount });

    } catch (error) {
        console.error('Get Notifications error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Global search across students, classes, users
export const globalSearch = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { q } = req.query;

        if (!q || typeof q !== 'string' || q.length < 2) {
            res.json({ results: [] });
            return;
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user?.schoolId) {
            res.json({ results: [] });
            return;
        }

        const searchTerm = q.toLowerCase();
        const results: any[] = [];

        // Search students
        const students = await prisma.student.findMany({
            where: {
                class: { schoolId: user.schoolId },
                name: { contains: searchTerm }
            },
            include: { class: { select: { name: true } } },
            take: 5
        });

        students.forEach(student => {
            results.push({
                id: student.id,
                type: 'student',
                title: student.name,
                subtitle: student.class?.name || 'Unassigned',
                icon: 'person',
                link: `/dashboard/students`
            });
        });

        // Search classes
        const classes = await prisma.class.findMany({
            where: {
                schoolId: user.schoolId,
                name: { contains: searchTerm }
            },
            take: 5
        });

        classes.forEach(cls => {
            results.push({
                id: cls.id,
                type: 'class',
                title: cls.name,
                subtitle: 'Class',
                icon: 'class',
                link: `/dashboard/classes`
            });
        });

        // Search users (for admins)
        if (user.role === 'ADMIN') {
            const users = await prisma.user.findMany({
                where: {
                    schoolId: user.schoolId,
                    OR: [
                        { name: { contains: searchTerm } },
                        { email: { contains: searchTerm } }
                    ]
                },
                take: 5
            });

            users.forEach(u => {
                results.push({
                    id: u.id,
                    type: 'user',
                    title: u.name || u.email,
                    subtitle: u.role,
                    icon: 'manage_accounts',
                    link: `/dashboard/users`
                });
            });
        }

        res.json({ results: results.slice(0, 10) });

    } catch (error) {
        console.error('Global Search error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
