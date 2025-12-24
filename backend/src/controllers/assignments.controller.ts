import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const createAssignment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, description, dueDate, classId } = req.body;

        // Validate class ownership or existence
        // For now, trust the input for simplicity/demo

        const newAssignment = await prisma.assignment.create({
            data: {
                title,
                description,
                dueDate: new Date(dueDate),
                classId
            }
        });

        res.status(201).json(newAssignment);
    } catch (error) {
        console.error('Create Assignment error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAssignments = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const classId = req.query.classId as string;

        // If classId provided, filter by it. Otherwise, return all (or handle per role)
        const whereClause = classId ? { classId } : {};

        const assignments = await prisma.assignment.findMany({
            where: whereClause,
            include: {
                class: {
                    select: { name: true }
                }
            },
            orderBy: {
                dueDate: 'asc'
            }
        });

        res.json(assignments);
    } catch (error) {
        console.error('Get Assignments error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateAssignment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, description, dueDate, classId } = req.body;

        const updateData: any = {};
        if (title) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (dueDate) updateData.dueDate = new Date(dueDate);
        if (classId) updateData.classId = classId;

        const updated = await prisma.assignment.update({
            where: { id },
            data: updateData,
            include: { class: { select: { name: true } } }
        });

        res.json(updated);
    } catch (error) {
        console.error('Update Assignment error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteAssignment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        await prisma.assignment.delete({ where: { id } });

        res.json({ message: 'Assignment deleted successfully' });
    } catch (error) {
        console.error('Delete Assignment error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
