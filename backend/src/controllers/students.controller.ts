import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const createStudent = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, grade, classId, dateOfBirth, parentEmail } = req.body;

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
                // Check if link already exists
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
                    console.log(`Auto-linked student ${newStudent.name} to parent ${parentUser.name}`);
                }
            }
        }

        res.status(201).json(newStudent);
    } catch (error) {
        console.error('Create Student error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getStudents = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const role = req.user?.role;

        let whereClause = {};

        if (role === 'TEACHER') {
            // Find classes taught by this teacher
            const classes = await prisma.class.findMany({ where: { teacherId: userId }, select: { id: true } });
            const classIds = classes.map(c => c.id);
            whereClause = { classId: { in: classIds } };
        } else if (role === 'PARENT') {
            // Find students linked to this parent
            // We query the mock relation for now, or the real one via ParentStudent table
            whereClause = {
                parents: {
                    some: {
                        parentId: userId
                    }
                }
            };
        } else if (role === 'ADMIN') {
            // Admin sees all (or filtered by school)
            // For simplicity: all
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
        console.error('Get Students error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateStudent = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, grade, classId, dateOfBirth, parentEmail } = req.body;

        const updateData: any = {};
        if (name) updateData.name = name;
        if (grade) updateData.grade = grade;
        if (classId) updateData.classId = classId;
        if (dateOfBirth) updateData.dob = new Date(dateOfBirth);
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
                // Check if link already exists
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
                    console.log(`Auto-linked student ${updatedStudent.name} to parent ${parentUser.name}`);
                }
            }
        }

        res.json(updatedStudent);
    } catch (error) {
        console.error('Update Student error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteStudent = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        await prisma.student.delete({ where: { id } });

        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Delete Student error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
