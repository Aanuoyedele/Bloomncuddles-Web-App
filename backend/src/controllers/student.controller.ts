import { Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import crypto from 'crypto';

const prisma = new PrismaClient();

// ==================== TOKEN-BASED ACCESS ====================

// Validate student access token and return student data
export const validateAccessToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token } = req.params;

        if (!token) {
            res.status(400).json({ message: 'Access token is required' });
            return;
        }

        const student = await prisma.student.findUnique({
            where: { accessToken: token },
            include: {
                class: {
                    include: {
                        teacher: { select: { name: true } },
                        school: { select: { name: true } }
                    }
                }
            }
        });

        if (!student) {
            res.status(404).json({ message: 'Invalid access link' });
            return;
        }

        res.json({
            id: student.id,
            name: student.name,
            grade: student.grade,
            className: student.class.name,
            teacherName: student.class.teacher.name,
            schoolName: student.class.school.name,
            classId: student.classId
        });
    } catch (error) {
        console.error('Validate Access Token error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get student dashboard stats by token
export const getStudentDashboardByToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token } = req.params;

        const student = await prisma.student.findUnique({
            where: { accessToken: token },
            include: {
                class: {
                    include: {
                        teacher: { select: { name: true } }
                    }
                }
            }
        });

        if (!student) {
            res.status(404).json({ message: 'Invalid access link' });
            return;
        }

        // Get assignments count
        const assignments = await prisma.assignment.findMany({
            where: { classId: student.classId },
            include: {
                submissions: {
                    where: { studentId: student.id },
                    select: { status: true, score: true }
                }
            }
        });

        const pendingAssignments = assignments.filter(a =>
            !a.submissions[0] || a.submissions[0].status === 'PENDING'
        ).length;

        const gradedSubmissions = assignments
            .filter(a => a.submissions[0]?.status === 'GRADED')
            .map(a => a.submissions[0]);

        const averageScore = gradedSubmissions.length > 0
            ? Math.round(gradedSubmissions.reduce((acc, s) => acc + (s.score || 0), 0) / gradedSubmissions.length)
            : null;

        // Get assigned games count
        const gamesCount = await prisma.gameAssignment.count({
            where: {
                OR: [
                    { classId: student.classId },
                    { targetGrade: student.grade },
                    { studentId: student.id }
                ]
            }
        });

        res.json({
            student: {
                name: student.name,
                grade: student.grade,
                className: student.class.name,
                teacherName: student.class.teacher.name
            },
            stats: {
                pendingAssignments,
                totalAssignments: assignments.length,
                averageScore,
                gamesAvailable: gamesCount
            }
        });
    } catch (error) {
        console.error('Get Student Dashboard error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get assignments for student by token
export const getStudentAssignmentsByToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token } = req.params;
        const { status } = req.query;

        const student = await prisma.student.findUnique({
            where: { accessToken: token },
            select: { id: true, classId: true, grade: true }
        });

        if (!student) {
            res.status(404).json({ message: 'Invalid access link' });
            return;
        }

        const assignments = await prisma.assignment.findMany({
            where: { classId: student.classId },
            include: {
                submissions: {
                    where: { studentId: student.id },
                    select: {
                        id: true,
                        status: true,
                        score: true,
                        grade: true,
                        feedback: true,
                        submissionFileUrl: true,
                        submittedAt: true,
                        gradedAt: true
                    }
                },
                class: { select: { name: true } }
            },
            orderBy: { dueDate: 'desc' }
        });

        const formattedAssignments = assignments.map(a => ({
            ...a,
            mySubmission: a.submissions[0] || null,
            submissions: undefined
        }));

        let filtered = formattedAssignments;
        if (status === 'pending') {
            filtered = formattedAssignments.filter(a => !a.mySubmission || a.mySubmission.status === 'PENDING');
        } else if (status === 'submitted') {
            filtered = formattedAssignments.filter(a => a.mySubmission?.status === 'SUBMITTED');
        } else if (status === 'graded') {
            filtered = formattedAssignments.filter(a => a.mySubmission?.status === 'GRADED');
        }

        res.json(filtered);
    } catch (error) {
        console.error('Get Student Assignments error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Submit assignment by token
export const submitAssignmentByToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token, assignmentId } = req.params;
        const { fileUrl } = req.body;

        const student = await prisma.student.findUnique({
            where: { accessToken: token },
            select: { id: true }
        });

        if (!student) {
            res.status(404).json({ message: 'Invalid access link' });
            return;
        }

        let submission = await prisma.submission.findFirst({
            where: { assignmentId, studentId: student.id }
        });

        if (submission) {
            submission = await prisma.submission.update({
                where: { id: submission.id },
                data: {
                    submissionFileUrl: fileUrl,
                    status: 'SUBMITTED',
                    submittedAt: new Date()
                }
            });
        } else {
            submission = await prisma.submission.create({
                data: {
                    assignmentId,
                    studentId: student.id,
                    submissionFileUrl: fileUrl,
                    status: 'SUBMITTED',
                    submittedAt: new Date()
                }
            });
        }

        res.json({ success: true, submission });
    } catch (error) {
        console.error('Submit Assignment error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get games for student by token
export const getStudentGamesByToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token } = req.params;
        const { subject } = req.query;

        const student = await prisma.student.findUnique({
            where: { accessToken: token },
            select: { id: true, classId: true, grade: true }
        });

        if (!student) {
            res.status(404).json({ message: 'Invalid access link' });
            return;
        }

        // Get games assigned to student
        const assignments = await prisma.gameAssignment.findMany({
            where: {
                OR: [
                    { targetType: 'class', classId: student.classId },
                    { targetType: 'grade', targetGrade: student.grade },
                    { targetType: 'student', studentId: student.id }
                ]
            },
            include: { game: true }
        });

        const gameMap = new Map();
        assignments.forEach(a => {
            if (a.game && a.game.isActive) {
                gameMap.set(a.game.id, { ...a.game, assignedAt: a.createdAt, dueDate: a.dueDate });
            }
        });

        let games = Array.from(gameMap.values());

        // Also get general games for student's grade
        const allGames = await prisma.game.findMany({
            where: {
                isActive: true,
                grade: student.grade
            }
        });

        allGames.forEach(g => {
            if (!gameMap.has(g.id)) {
                games.push({ ...g, assignedAt: null, dueDate: null });
            }
        });

        if (subject && subject !== 'all') {
            games = games.filter(g => g.subject === subject);
        }

        res.json(games);
    } catch (error) {
        console.error('Get Student Games error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get library for student by token
export const getStudentLibraryByToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token } = req.params;
        const { subject, level, search } = req.query;

        const student = await prisma.student.findUnique({
            where: { accessToken: token },
            include: { class: { select: { schoolId: true, grade: true } } }
        });

        if (!student) {
            res.status(404).json({ message: 'Invalid access link' });
            return;
        }

        const where: any = { schoolId: student.class.schoolId };

        if (subject && subject !== 'all') where.subject = subject;
        if (level && level !== 'all') where.level = level;
        if (search) {
            where.OR = [
                { title: { contains: search as string } },
                { author: { contains: search as string } }
            ];
        }

        const books = await prisma.book.findMany({
            where,
            include: {
                requests: {
                    where: { studentId: student.id },
                    select: { id: true, status: true, createdAt: true }
                },
                assignments: {
                    where: {
                        OR: [
                            { studentId: student.id },
                            { classId: student.classId },
                            { targetGrade: student.grade }
                        ]
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const formattedBooks = books.map(b => ({
            ...b,
            isAssigned: b.assignments.length > 0,
            myRequest: b.requests[0] || null,
            assignments: undefined,
            requests: undefined
        }));

        res.json(formattedBooks);
    } catch (error) {
        console.error('Get Student Library error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Request book by token
export const requestBookByToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token, bookId } = req.params;
        const { note } = req.body;

        const student = await prisma.student.findUnique({
            where: { accessToken: token },
            select: { id: true }
        });

        if (!student) {
            res.status(404).json({ message: 'Invalid access link' });
            return;
        }

        const existingRequest = await prisma.bookRequest.findFirst({
            where: { bookId, studentId: student.id }
        });

        if (existingRequest) {
            res.status(400).json({ message: 'You have already requested this book', request: existingRequest });
            return;
        }

        const request = await prisma.bookRequest.create({
            data: { bookId, studentId: student.id, note }
        });

        res.json({ success: true, request });
    } catch (error) {
        console.error('Request Book error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get grades by token
export const getStudentGradesByToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token } = req.params;

        const student = await prisma.student.findUnique({
            where: { accessToken: token },
            select: { id: true }
        });

        if (!student) {
            res.status(404).json({ message: 'Invalid access link' });
            return;
        }

        const submissions = await prisma.submission.findMany({
            where: { studentId: student.id },
            include: {
                assignment: {
                    select: {
                        title: true,
                        description: true,
                        dueDate: true,
                        class: { select: { name: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const gradedSubmissions = submissions.filter(s => s.status === 'GRADED' && s.score !== null);
        const averageScore = gradedSubmissions.length > 0
            ? Math.round(gradedSubmissions.reduce((acc, s) => acc + (s.score || 0), 0) / gradedSubmissions.length)
            : null;

        res.json({
            submissions,
            stats: {
                total: submissions.length,
                graded: gradedSubmissions.length,
                pending: submissions.filter(s => s.status === 'PENDING').length,
                submitted: submissions.filter(s => s.status === 'SUBMITTED').length,
                averageScore
            }
        });
    } catch (error) {
        console.error('Get Student Grades error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// ==================== TEACHER FUNCTIONS ====================

// Regenerate student access token
export const regenerateAccessToken = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { studentId } = req.params;

        const newToken = crypto.randomUUID();

        const student = await prisma.student.update({
            where: { id: studentId },
            data: { accessToken: newToken }
        });

        res.json({
            success: true,
            accessToken: student.accessToken,
            accessUrl: `/student/access/${student.accessToken}`
        });
    } catch (error) {
        console.error('Regenerate Access Token error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get student access link (for teacher to copy/share)
export const getStudentAccessLink = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { studentId } = req.params;

        const student = await prisma.student.findUnique({
            where: { id: studentId },
            select: { accessToken: true, name: true, parentEmail: true }
        });

        if (!student) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }

        res.json({
            name: student.name,
            parentEmail: student.parentEmail,
            accessToken: student.accessToken,
            accessUrl: `/student/access/${student.accessToken}`
        });
    } catch (error) {
        console.error('Get Student Access Link error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Send access link email to parent
export const sendAccessLinkEmail = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { studentId } = req.params;

        const student = await prisma.student.findUnique({
            where: { id: studentId },
            include: {
                class: {
                    include: {
                        school: { select: { name: true } }
                    }
                }
            }
        });

        if (!student) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }

        if (!student.parentEmail) {
            res.status(400).json({ message: 'No parent email set for this student' });
            return;
        }

        const { sendStudentAccessLinkEmail } = await import('../services/email.service');

        const sent = await sendStudentAccessLinkEmail({
            to: student.parentEmail,
            studentName: student.name,
            schoolName: student.class.school.name,
            className: student.class.name,
            accessToken: student.accessToken
        });

        if (sent) {
            res.json({ success: true, message: `Access link sent to ${student.parentEmail}` });
        } else {
            res.status(500).json({ message: 'Failed to send email' });
        }
    } catch (error) {
        console.error('Send Access Link Email error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
