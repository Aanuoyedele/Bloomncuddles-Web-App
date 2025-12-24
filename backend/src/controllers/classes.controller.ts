import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const createClass = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, grade, schedule } = req.body;
        const teacherId = req.user?.userId;

        if (!teacherId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        // For now, assuming the user creating it is the teacher
        // In a real app, Admins might assign teachers.

        // We need to fetch the user to get their schoolId
        const user = await prisma.user.findUnique({ where: { id: teacherId } });
        if (!user || !user.schoolId) {
            // If no school linked, maybe create a default one or error?
            // For simplicity in this demo, we'll error if no school.
            if (!user?.schoolId) {
                res.status(400).json({ message: "User must belong to a school to create classes." });
                return;
            }
        }

        const newClass = await prisma.class.create({
            data: {
                name,
                grade,
                schedule,
                schoolId: user.schoolId!,
                teacherId: user.id
            }
        });

        res.status(201).json(newClass);
    } catch (error) {
        console.error('Create Class error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getClasses = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        // Basic filter: Return classes for this teacher, OR all for Admin
        // For now, let's just return all classes for the user's school

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user?.schoolId) {
            res.json([]);
            return;
        }

        const classes = await prisma.class.findMany({
            where: {
                schoolId: user.schoolId
            },
            include: {
                teacher: {
                    select: { name: true, email: true }
                },
                _count: {
                    select: { students: true }
                }
            }
        });

        res.json(classes);
    } catch (error) {
        console.error('Get Classes error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateClass = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, grade, schedule, teacherId } = req.body;

        const updateData: any = {};
        if (name) updateData.name = name;
        if (grade) updateData.grade = grade;
        if (schedule !== undefined) updateData.schedule = schedule;
        if (teacherId) updateData.teacherId = teacherId; // Reassign teacher

        const updated = await prisma.class.update({
            where: { id },
            data: updateData,
            include: {
                teacher: { select: { name: true, email: true } },
                _count: { select: { students: true } }
            }
        });

        res.json(updated);
    } catch (error) {
        console.error('Update Class error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteClass = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        await prisma.class.delete({ where: { id } });

        res.json({ message: 'Class deleted successfully' });
    } catch (error) {
        console.error('Delete Class error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
