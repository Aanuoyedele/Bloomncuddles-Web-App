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

// Get student engagement data by day of week
export const getEngagement = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user?.schoolId) {
            res.json({ days: [] });
            return;
        }

        // Get classes for this school
        const classes = await prisma.class.findMany({
            where: { schoolId: user.schoolId },
            select: { id: true }
        });
        const classIds = classes.map(c => c.id);

        // Get submissions from last 7 days as a proxy for engagement
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const submissions = await prisma.submission.findMany({
            where: {
                student: { classId: { in: classIds } },
                submittedAt: { gte: sevenDaysAgo }
            },
            select: { submittedAt: true }
        });

        // Count by day of week
        const dayCounts: Record<string, number> = {
            'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0
        };
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        submissions.forEach(sub => {
            if (sub.submittedAt) {
                const dayName = dayNames[sub.submittedAt.getDay()];
                dayCounts[dayName]++;
            }
        });

        // Calculate max for percentage
        const maxCount = Math.max(...Object.values(dayCounts), 1);

        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => ({
            day,
            count: dayCounts[day],
            percentage: Math.round((dayCounts[day] / maxCount) * 100)
        }));

        res.json({ days, total: submissions.length });
    } catch (error) {
        console.error('Get Engagement error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get average scores by class/subject
export const getAverageScores = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user?.schoolId) {
            res.json({ scores: [] });
            return;
        }

        // Get classes with their submissions
        const classes = await prisma.class.findMany({
            where: { schoolId: user.schoolId },
            include: {
                assignments: {
                    include: {
                        submissions: {
                            where: { status: 'GRADED' },
                            select: { grade: true }
                        }
                    }
                }
            }
        });

        const scores = classes.map(cls => {
            // Collect all grades for this class
            const allGrades: number[] = [];
            cls.assignments.forEach(assignment => {
                assignment.submissions.forEach(sub => {
                    if (sub.grade) {
                        // Convert letter grades to numbers
                        const gradeMap: Record<string, number> = {
                            'A+': 97, 'A': 94, 'A-': 90,
                            'B+': 87, 'B': 84, 'B-': 80,
                            'C+': 77, 'C': 74, 'C-': 70,
                            'D+': 67, 'D': 64, 'D-': 60,
                            'F': 50
                        };
                        const numGrade = gradeMap[sub.grade] || parseInt(sub.grade) || 0;
                        if (numGrade > 0) allGrades.push(numGrade);
                    }
                });
            });

            const avgScore = allGrades.length > 0
                ? Math.round(allGrades.reduce((a, b) => a + b, 0) / allGrades.length)
                : 0;

            return {
                className: cls.name,
                avgScore,
                totalSubmissions: allGrades.length
            };
        }).filter(s => s.totalSubmissions > 0)
            .sort((a, b) => b.avgScore - a.avgScore)
            .slice(0, 5);

        res.json({ scores });
    } catch (error) {
        console.error('Get Average Scores error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get recent assignments with teacher info
export const getRecentAssignments = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user?.schoolId) {
            res.json({ assignments: [] });
            return;
        }

        const assignments = await prisma.assignment.findMany({
            where: {
                class: { schoolId: user.schoolId }
            },
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: {
                class: {
                    include: {
                        teacher: {
                            select: { name: true }
                        }
                    }
                },
                submissions: {
                    select: { status: true }
                }
            }
        });

        const result = assignments.map(a => {
            const submitted = a.submissions.filter(s => s.status !== 'PENDING').length;
            const total = a.submissions.length;

            let status = 'Active';
            if (new Date() > a.dueDate) {
                status = submitted === total && total > 0 ? 'Completed' : 'Overdue';
            } else if (submitted > 0) {
                status = 'In Progress';
            }

            return {
                id: a.id,
                title: a.title,
                className: a.class.name,
                teacherName: a.class.teacher.name,
                dueDate: a.dueDate.toISOString(),
                status,
                submitted,
                total
            };
        });

        res.json({ assignments: result });
    } catch (error) {
        console.error('Get Recent Assignments error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get students and teachers needing attention
export const getNeedsAttention = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user?.schoolId) {
            res.json({ students: [], teachers: [] });
            return;
        }

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        // Get classes for this school
        const classes = await prisma.class.findMany({
            where: { schoolId: user.schoolId },
            select: { id: true, name: true }
        });
        const classIds = classes.map(c => c.id);

        // Get students with missing/late submissions
        const studentsWithIssues = await prisma.student.findMany({
            where: {
                classId: { in: classIds }
            },
            include: {
                class: { select: { name: true } },
                submissions: {
                    include: {
                        assignment: { select: { title: true, dueDate: true } }
                    }
                }
            }
        });

        const attentionStudents = studentsWithIssues
            .map(student => {
                // Check for missing assignments (past due with no submission)
                const missingCount = student.submissions.filter(s =>
                    s.status === 'PENDING' && new Date(s.assignment.dueDate) < new Date()
                ).length;

                // For now, we consider students needing attention if they have missing work
                if (missingCount > 0) {
                    return {
                        id: student.id,
                        name: student.name,
                        className: student.class.name,
                        issue: `${missingCount} missing assignment${missingCount > 1 ? 's' : ''}`,
                        type: 'missing_work'
                    };
                }
                return null;
            })
            .filter(Boolean)
            .slice(0, 5);

        // Get teachers who haven't logged in recently (we don't track login yet, so placeholder)
        // TODO: Add lastLoginAt field to User model to track this properly
        const teachers = await prisma.user.findMany({
            where: {
                schoolId: user.schoolId,
                role: 'TEACHER'
            },
            select: { id: true, name: true, updatedAt: true }
        });

        const attentionTeachers = teachers
            .filter(t => t.updatedAt < oneWeekAgo)
            .map(t => ({
                id: t.id,
                name: t.name,
                issue: 'Inactive for over a week',
                type: 'inactive'
            }))
            .slice(0, 3);

        res.json({
            students: attentionStudents,
            teachers: attentionTeachers
        });
    } catch (error) {
        console.error('Get Needs Attention error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get student stats for Students page (total, active today, needs attention)
export const getStudentStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user?.schoolId) {
            res.json({ total: 0, activeToday: 0, needsAttention: 0 });
            return;
        }

        // Get classes for this school
        const classes = await prisma.class.findMany({
            where: { schoolId: user.schoolId },
            select: { id: true }
        });
        const classIds = classes.map(c => c.id);

        // Total students
        const total = await prisma.student.count({
            where: { classId: { in: classIds } }
        });

        // Active today (students who submitted something today)
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const activeSubmissions = await prisma.submission.findMany({
            where: {
                student: { classId: { in: classIds } },
                submittedAt: { gte: todayStart }
            },
            select: { studentId: true },
            distinct: ['studentId']
        });
        const activeToday = activeSubmissions.length;

        // Needs attention (students with missing/late assignments)
        const now = new Date();
        const studentsWithAssignments = await prisma.student.findMany({
            where: { classId: { in: classIds } },
            include: {
                submissions: {
                    where: { status: 'PENDING' },
                    include: { assignment: { select: { dueDate: true } } }
                }
            }
        });

        const needsAttention = studentsWithAssignments.filter(student => {
            return student.submissions.some(sub =>
                new Date(sub.assignment.dueDate) < now
            );
        }).length;

        res.json({ total, activeToday, needsAttention });
    } catch (error) {
        console.error('Get Student Stats error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

