import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const getStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        // Get user's school
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user?.schoolId) {
            res.json({ classes: 0, students: 0, assignments: 0, teachers: 0 });
            return;
        }

        // Count classes for this school
        const classCount = await prisma.class.count({
            where: { schoolId: user.schoolId }
        });

        // Count students in those classes
        const classes = await prisma.class.findMany({
            where: { schoolId: user.schoolId },
            select: { id: true }
        });
        const classIds = classes.map(c => c.id);

        const studentCount = await prisma.student.count({
            where: { classId: { in: classIds } }
        });

        // Count assignments for those classes
        const assignmentCount = await prisma.assignment.count({
            where: { classId: { in: classIds } }
        });

        // Count teachers in this school
        const teacherCount = await prisma.user.count({
            where: {
                schoolId: user.schoolId,
                role: 'TEACHER'
            }
        });

        // Count pending invites
        const pendingInvites = await prisma.invite.count({
            where: {
                schoolId: user.schoolId,
                used: false
            }
        });

        res.json({
            classes: classCount,
            students: studentCount,
            assignments: assignmentCount,
            teachers: teacherCount,
            pendingInvites
        });
    } catch (error) {
        console.error('Get Stats error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
