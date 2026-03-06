import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import logger from '../config/logger';

export const createStudent = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, grade, classId, dateOfBirth, parentEmail } = req.body;
        const schoolId = req.user?.schoolId;

        // IDOR: Verify the class belongs to the user's school
        if (schoolId && classId) {
            const targetClass = await prisma.class.findFirst({
                where: { id: classId, schoolId }
            });
            if (!targetClass) {
                res.status(403).json({ message: 'You can only add students to your own school\'s classes' });
                return;
            }
        }

        // Create the student
        const newStudent = await prisma.student.create({
            data: {
                name,
                grade,
                dob: dateOfBirth ? new Date(dateOfBirth) : undefined,
                classId,
                parentEmail: parentEmail || null
            }
        });

        // Auto-link to parent if email matches a registered parent
        if (parentEmail) {
            const parentUser = await prisma.user.findUnique({
                where: { email: parentEmail }
            });

            if (parentUser && parentUser.role === 'PARENT') {
                const existingLink = await prisma.parentStudent.findUnique({
                    where: {
                        parentId_studentId: {
                            parentId: parentUser.id,
                            studentId: newStudent.id
                        }
                    }
                });

                if (!existingLink) {
                    await prisma.parentStudent.create({
                        data: {
                            parentId: parentUser.id,
                            studentId: newStudent.id
                        }
                    });
                    logger.info(`Auto-linked student ${newStudent.name} to parent ${parentUser.name}`);
                }
            }
        }

        res.status(201).json(newStudent);
    } catch (error) {
        logger.error('Create Student error', { error });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getStudents = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const role = req.user?.role;

        let whereClause = {};

        if (role === 'TEACHER') {
            const classes = await prisma.class.findMany({ where: { teacherId: userId }, select: { id: true } });
            const classIds = classes.map(c => c.id);
            whereClause = { classId: { in: classIds } };
        } else if (role === 'PARENT') {
            whereClause = {
                parents: {
                    some: {
                        parentId: userId
                    }
                }
            };
        } else if (role === 'ADMIN') {
            if (req.user?.schoolId) {
                whereClause = {
                    class: {
                        schoolId: req.user.schoolId
                    }
                };
            }
        }

        const students = await prisma.student.findMany({
            where: whereClause,
            include: {
                class: {
                    select: { name: true, grade: true }
                }
            }
        });

        res.json(students);
    } catch (error) {
        logger.error('Get Students error', { error });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateStudent = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const { name, grade, classId, dateOfBirth, parentEmail } = req.body;
        const schoolId = req.user?.schoolId;

        // IDOR: Verify student belongs to user's school
        if (schoolId) {
            const student = await prisma.student.findFirst({
                where: { id },
                include: { class: true }
            });

            if (!student || student.class?.schoolId !== schoolId) {
                res.status(404).json({ message: 'Student not found' });
                return;
            }
        }

        // Explicit field whitelisting (mass assignment protection)
        const updateData: Record<string, any> = {};
        if (name !== undefined) updateData.name = name;
        if (grade !== undefined) updateData.grade = grade;
        if (classId !== undefined) updateData.classId = classId;
        if (dateOfBirth !== undefined) updateData.dob = new Date(dateOfBirth);
        if (parentEmail !== undefined) updateData.parentEmail = parentEmail || null;

        const updatedStudent = await prisma.student.update({
            where: { id },
            data: updateData,
            include: {
                class: { select: { name: true, grade: true } }
            }
        });

        // Auto-link to parent if email matches a registered parent
        if (parentEmail) {
            const parentUser = await prisma.user.findUnique({
                where: { email: parentEmail }
            });

            if (parentUser && parentUser.role === 'PARENT') {
                const existingLink = await prisma.parentStudent.findUnique({
                    where: {
                        parentId_studentId: {
                            parentId: parentUser.id,
                            studentId: updatedStudent.id
                        }
                    }
                });

                if (!existingLink) {
                    await prisma.parentStudent.create({
                        data: {
                            parentId: parentUser.id,
                            studentId: updatedStudent.id
                        }
                    });
                    logger.info(`Auto-linked student ${updatedStudent.name} to parent ${parentUser.name}`);
                }
            }
        }

        res.json(updatedStudent);
    } catch (error) {
        logger.error('Update Student error', { error });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteStudent = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const schoolId = req.user?.schoolId;

        // IDOR: Verify student belongs to user's school
        if (schoolId) {
            const student = await prisma.student.findFirst({
                where: { id },
                include: { class: true }
            });

            if (!student || student.class?.schoolId !== schoolId) {
                res.status(404).json({ message: 'Student not found' });
                return;
            }
        }

        await prisma.student.delete({ where: { id } });

        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        logger.error('Delete Student error', { error });
        res.status(500).json({ message: 'Internal server error' });
    }
};
