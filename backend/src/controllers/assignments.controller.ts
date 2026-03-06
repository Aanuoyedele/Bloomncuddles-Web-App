import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import logger from '../config/logger';

export const createAssignment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, description, dueDate, classId, fileUrl } = req.body;
        const schoolId = req.user?.schoolId;

        // IDOR: Verify classId belongs to user's school
        if (schoolId && classId) {
            const targetClass = await prisma.class.findFirst({
                where: { id: classId, schoolId }
            });
            if (!targetClass) {
                res.status(403).json({ message: 'You can only create assignments for your own school\'s classes' });
                return;
            }
        }

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
        logger.error('Create Assignment error', { error });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAssignments = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { classId, search } = req.query;
        const schoolId = req.user?.schoolId;

        // Scope assignments to user's school
        const where: Record<string, any> = {};
        if (classId) {
            where.classId = classId;
        } else if (schoolId) {
            where.class = { schoolId };
        }
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
        logger.error('Get Assignments error', { error });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateAssignment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const { title, description, dueDate, classId, fileUrl } = req.body;
        const schoolId = req.user?.schoolId;

        // IDOR: Verify assignment belongs to user's school
        if (schoolId) {
            const assignment = await prisma.assignment.findFirst({
                where: { id },
                include: { class: true }
            });
            if (!assignment || assignment.class?.schoolId !== schoolId) {
                res.status(404).json({ message: 'Assignment not found' });
                return;
            }
        }

        // Explicit field whitelisting
        const updateData: Record<string, any> = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (dueDate !== undefined) updateData.dueDate = new Date(dueDate);
        if (classId !== undefined) updateData.classId = classId;
        if (fileUrl !== undefined) updateData.fileUrl = fileUrl;

        const updated = await prisma.assignment.update({
            where: { id },
            data: updateData,
            include: { class: { select: { name: true } } }
        });

        res.json(updated);
    } catch (error) {
        logger.error('Update Assignment error', { error });
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteAssignment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const schoolId = req.user?.schoolId;

        // IDOR: Verify assignment belongs to user's school
        if (schoolId) {
            const assignment = await prisma.assignment.findFirst({
                where: { id },
                include: { class: true }
            });
            if (!assignment || assignment.class?.schoolId !== schoolId) {
                res.status(404).json({ message: 'Assignment not found' });
                return;
            }
        }

        // Delete submissions first
        await prisma.submission.deleteMany({ where: { assignmentId: id } });
        await prisma.assignment.delete({ where: { id } });

        res.json({ message: 'Assignment deleted successfully' });
    } catch (error) {
        logger.error('Delete Assignment error', { error });
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get submissions for an assignment
export const getSubmissions = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const schoolId = req.user?.schoolId;

        // IDOR: Verify assignment belongs to user's school
        if (schoolId) {
            const assignment = await prisma.assignment.findFirst({
                where: { id },
                include: { class: true }
            });
            if (!assignment || assignment.class?.schoolId !== schoolId) {
                res.status(404).json({ message: 'Assignment not found' });
                return;
            }
        }

        const submissions = await prisma.submission.findMany({
            where: { assignmentId: id },
            include: {
                student: { select: { id: true, name: true, grade: true } }
            },
            orderBy: { student: { name: 'asc' } }
        });

        res.json(submissions);
    } catch (error) {
        logger.error('Get Submissions error', { error });
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Grade a submission
export const gradeSubmission = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const { score, feedback } = req.body;

        if (score === undefined || score < 0 || score > 100) {
            res.status(400).json({ message: 'Score must be between 0 and 100' });
            return;
        }

        // Explicit field whitelisting — only accept score and feedback
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

        res.json(updated);
    } catch (error) {
        logger.error('Grade Submission error', { error });
        res.status(500).json({ message: 'Internal server error' });
    }
};
