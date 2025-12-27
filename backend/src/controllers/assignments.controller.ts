import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const createAssignment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, description, dueDate, classId, fileUrl } = req.body;

        const newAssignment = await prisma.assignment.create({
            data: {
                title,
                description,
                dueDate: new Date(dueDate),
                classId,
                fileUrl
            }
        });

        // Create submissions for all students in the class
        const students = await prisma.student.findMany({
            where: { classId },
            select: { id: true }
        });

        if (students.length > 0) {
            await prisma.submission.createMany({
                data: students.map(s => ({
                    assignmentId: newAssignment.id,
                    studentId: s.id,
                    status: 'PENDING'
                }))
            });
        }

        res.status(201).json(newAssignment);
    } catch (error) {
        console.error('Create Assignment error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAssignments = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { classId, search } = req.query;

        const where: any = {};
        if (classId) where.classId = classId;
        if (search) {
            where.title = { contains: search as string };
        }

        const assignments = await prisma.assignment.findMany({
            where,
            include: {
                class: { select: { name: true } },
                _count: { select: { submissions: true } }
            },
            orderBy: { dueDate: 'asc' }
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
        const { title, description, dueDate, classId, fileUrl } = req.body;

        const updateData: any = {};
        if (title) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (dueDate) updateData.dueDate = new Date(dueDate);
        if (classId) updateData.classId = classId;
        if (fileUrl !== undefined) updateData.fileUrl = fileUrl;

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

        // Delete submissions first
        await prisma.submission.deleteMany({ where: { assignmentId: id } });
        await prisma.assignment.delete({ where: { id } });

        res.json({ message: 'Assignment deleted successfully' });
    } catch (error) {
        console.error('Delete Assignment error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get submissions for an assignment
export const getSubmissions = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const submissions = await prisma.submission.findMany({
            where: { assignmentId: id },
            include: {
                student: { select: { id: true, name: true, grade: true } }
            },
            orderBy: { student: { name: 'asc' } }
        });

        res.json(submissions);
    } catch (error) {
        console.error('Get Submissions error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Grade a submission
export const gradeSubmission = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { score, feedback } = req.body;

        if (score === undefined || score < 0 || score > 100) {
            res.status(400).json({ message: 'Score must be between 0 and 100' });
            return;
        }

        const updated = await prisma.submission.update({
            where: { id },
            data: {
                score,
                feedback,
                status: 'GRADED',
                gradedAt: new Date()
            },
            include: {
                student: { select: { name: true, parentEmail: true } },
                assignment: { select: { title: true } }
            }
        });

        // TODO: Send notification to student about their grade

        res.json(updated);
    } catch (error) {
        console.error('Grade Submission error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

