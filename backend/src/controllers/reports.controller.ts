import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

// Get comprehensive report data for the Reports page
export const getReportData = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { period = '30', classId } = req.query;

        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user?.schoolId) {
            res.json({
                stats: { classAverage: 0, completionRate: 0, needsAttention: 0 },
                weeklyPerformance: [],
                classBreakdown: [],
                studentProgress: []
            });
            return;
        }

        // Calculate date range based on period
        const daysAgo = parseInt(period as string) || 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysAgo);

        // Get classes for this school (optionally filtered)
        const classWhere: any = { schoolId: user.schoolId };
        if (classId && classId !== 'all') {
            classWhere.id = classId;
        }

        const classes = await prisma.class.findMany({
            where: classWhere,
            select: { id: true, name: true }
        });
        const classIds = classes.map(c => c.id);

        // Get all graded submissions in the period
        const submissions = await prisma.submission.findMany({
            where: {
                student: { classId: { in: classIds } },
                status: 'GRADED',
                submittedAt: { gte: startDate }
            },
            include: {
                student: {
                    include: { class: { select: { name: true } } }
                },
                assignment: { select: { title: true, dueDate: true } }
            }
        });

        // Calculate class average
        const grades: number[] = [];
        const gradeMap: Record<string, number> = {
            'A+': 97, 'A': 94, 'A-': 90,
            'B+': 87, 'B': 84, 'B-': 80,
            'C+': 77, 'C': 74, 'C-': 70,
            'D+': 67, 'D': 64, 'D-': 60,
            'F': 50
        };

        submissions.forEach(sub => {
            if (sub.grade) {
                const numGrade = gradeMap[sub.grade] || parseInt(sub.grade) || 0;
                if (numGrade > 0) grades.push(numGrade);
            }
        });

        const classAverage = grades.length > 0
            ? Math.round(grades.reduce((a, b) => a + b, 0) / grades.length)
            : 0;

        // Get total assignments in period
        const totalAssignments = await prisma.assignment.count({
            where: {
                classId: { in: classIds },
                createdAt: { gte: startDate }
            }
        });

        // Get total submissions (completed)
        const completedSubmissions = await prisma.submission.count({
            where: {
                student: { classId: { in: classIds } },
                status: { in: ['SUBMITTED', 'GRADED'] },
                submittedAt: { gte: startDate }
            }
        });

        // Get students count
        const studentCount = await prisma.student.count({
            where: { classId: { in: classIds } }
        });

        // Estimate expected submissions
        const expectedSubmissions = totalAssignments * studentCount;
        const completionRate = expectedSubmissions > 0
            ? Math.round((completedSubmissions / expectedSubmissions) * 100)
            : 0;

        // Get students needing attention (missing assignments)
        const now = new Date();
        const studentsWithSubmissions = await prisma.student.findMany({
            where: { classId: { in: classIds } },
            include: {
                submissions: {
                    where: { status: 'PENDING' },
                    include: { assignment: { select: { dueDate: true } } }
                }
            }
        });

        const needsAttention = studentsWithSubmissions.filter(student =>
            student.submissions.some(sub => new Date(sub.assignment.dueDate) < now)
        ).length;

        // Weekly performance data (last 7 weeks)
        const weeklyPerformance: { week: string; avg: number }[] = [];
        for (let i = 6; i >= 0; i--) {
            const weekStart = new Date();
            weekStart.setDate(weekStart.getDate() - (i * 7) - 7);
            const weekEnd = new Date();
            weekEnd.setDate(weekEnd.getDate() - (i * 7));

            const weekSubmissions = submissions.filter(sub =>
                sub.submittedAt && sub.submittedAt >= weekStart && sub.submittedAt < weekEnd
            );

            const weekGrades: number[] = [];
            weekSubmissions.forEach(sub => {
                if (sub.grade) {
                    const numGrade = gradeMap[sub.grade] || parseInt(sub.grade) || 0;
                    if (numGrade > 0) weekGrades.push(numGrade);
                }
            });

            const avg = weekGrades.length > 0
                ? Math.round(weekGrades.reduce((a, b) => a + b, 0) / weekGrades.length)
                : 0;

            weeklyPerformance.push({ week: `W${7 - i}`, avg });
        }

        // Class breakdown (average score per class)
        const classBreakdown = await Promise.all(classes.map(async (cls) => {
            const classSubmissions = submissions.filter(sub =>
                sub.student.class?.name === cls.name
            );

            const classGrades: number[] = [];
            classSubmissions.forEach(sub => {
                if (sub.grade) {
                    const numGrade = gradeMap[sub.grade] || parseInt(sub.grade) || 0;
                    if (numGrade > 0) classGrades.push(numGrade);
                }
            });

            return {
                name: cls.name,
                avg: classGrades.length > 0
                    ? Math.round(classGrades.reduce((a, b) => a + b, 0) / classGrades.length)
                    : 0
            };
        }));

        // Student progress data
        const students = await prisma.student.findMany({
            where: { classId: { in: classIds } },
            include: {
                class: { select: { name: true } },
                submissions: {
                    where: { submittedAt: { gte: startDate } },
                    include: { assignment: { select: { dueDate: true } } }
                }
            },
            take: 10,
            orderBy: { name: 'asc' }
        });

        const studentProgress = students.map(student => {
            const studentGrades: number[] = [];
            let completed = 0;
            let total = student.submissions.length;
            let missing = 0;

            student.submissions.forEach(sub => {
                if (sub.status === 'GRADED' || sub.status === 'SUBMITTED') {
                    completed++;
                    if (sub.grade) {
                        const numGrade = gradeMap[sub.grade] || parseInt(sub.grade) || 0;
                        if (numGrade > 0) studentGrades.push(numGrade);
                    }
                } else if (sub.status === 'PENDING' && new Date(sub.assignment.dueDate) < now) {
                    missing++;
                }
            });

            const avgScore = studentGrades.length > 0
                ? Math.round(studentGrades.reduce((a, b) => a + b, 0) / studentGrades.length)
                : 0;

            let status = 'On Track';
            let statusColor = 'bg-green-100 text-green-700';
            if (missing > 0 || avgScore < 60) {
                status = 'Needs Support';
                statusColor = 'bg-red-50 text-secondary';
            } else if (avgScore < 75) {
                status = 'Improving';
                statusColor = 'bg-yellow-100 text-yellow-700';
            }

            return {
                id: student.id,
                name: student.name,
                className: student.class?.name || 'Unassigned',
                avgScore,
                completed,
                total,
                missing,
                status,
                statusColor
            };
        });

        res.json({
            stats: {
                classAverage,
                completionRate,
                needsAttention
            },
            weeklyPerformance,
            classBreakdown: classBreakdown.filter(c => c.avg > 0),
            studentProgress,
            classes: classes.map(c => ({ id: c.id, name: c.name }))
        });

    } catch (error) {
        console.error('Get Report Data error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
