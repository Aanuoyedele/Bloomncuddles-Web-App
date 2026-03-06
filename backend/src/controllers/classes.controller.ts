import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import logger from '../config/logger';

export const createClass = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, grade, schedule } = req.body;
        const teacherId = req.user?.userId;

        if (!teacherId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const user = await prisma.user.findUnique({ where: { id: teacherId } });
        if (!user?.schoolId) {
            res.status(400).json({ message: "User must belong to a school to create classes." });
            return;
        }

        const newClass = await prisma.class.create({
            data: {
                name,
                grade,
                schedule,
                schoolId: user.schoolId,
                teacherId: user.id
            }
        });

        res.status(201).json(newClass);
    } catch (error) {
        logger.error('Create Class error', { error });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getClasses = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

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
        logger.error('Get Classes error', { error });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateClass = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const { name, grade, schedule, teacherId } = req.body;
        const schoolId = req.user?.schoolId;

        // IDOR: Verify this class belongs to the user's school
        if (schoolId) {
            const existingClass = await prisma.class.findFirst({
                where: { id, schoolId }
            });
            if (!existingClass) {
                res.status(404).json({ message: 'Class not found' });
                return;
            }
        }

        // Explicit field whitelisting
        const updateData: Record<string, any> = {};
        if (name !== undefined) updateData.name = name;
        if (grade !== undefined) updateData.grade = grade;
        if (schedule !== undefined) updateData.schedule = schedule;
        if (teacherId !== undefined) updateData.teacherId = teacherId;

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
        logger.error('Update Class error', { error });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteClass = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const schoolId = req.user?.schoolId;

        // IDOR: Verify this class belongs to the user's school
        if (schoolId) {
            const existingClass = await prisma.class.findFirst({
                where: { id, schoolId }
            });
            if (!existingClass) {
                res.status(404).json({ message: 'Class not found' });
                return;
            }
        }

        await prisma.class.delete({ where: { id } });

        res.json({ message: 'Class deleted successfully' });
    } catch (error) {
        logger.error('Delete Class error', { error });
        res.status(500).json({ message: 'Internal server error' });
    }
};
