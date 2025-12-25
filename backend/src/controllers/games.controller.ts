import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

// Get all games with filters
export const getGames = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { subject, grade, search } = req.query;

        const where: any = { isActive: true };

        if (subject && subject !== 'all') {
            where.subject = subject;
        }
        if (grade && grade !== 'all') {
            where.grade = grade;
        }
        if (search) {
            where.OR = [
                { title: { contains: search as string } },
                { description: { contains: search as string } }
            ];
        }

        const games = await prisma.game.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        res.json(games);

    } catch (error) {
        console.error('Get Games error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get single game
export const getGame = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const game = await prisma.game.findUnique({
            where: { id }
        });

        if (!game) {
            res.status(404).json({ message: 'Game not found' });
            return;
        }

        res.json(game);

    } catch (error) {
        console.error('Get Game error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Assign game to grade/class/students
export const assignGame = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { gameId, targetType, targetGrade, classId, studentIds, dueDate } = req.body;

        if (!gameId || !targetType) {
            res.status(400).json({ message: 'Game ID and target type are required' });
            return;
        }

        const game = await prisma.game.findUnique({ where: { id: gameId } });
        if (!game) {
            res.status(404).json({ message: 'Game not found' });
            return;
        }

        // Create assignments based on target type
        if (targetType === 'grade') {
            await prisma.gameAssignment.create({
                data: {
                    gameId,
                    targetType: 'grade',
                    targetGrade,
                    assignedBy: userId!,
                    dueDate: dueDate ? new Date(dueDate) : null
                }
            });
        } else if (targetType === 'class') {
            await prisma.gameAssignment.create({
                data: {
                    gameId,
                    targetType: 'class',
                    classId,
                    assignedBy: userId!,
                    dueDate: dueDate ? new Date(dueDate) : null
                }
            });
        } else if (targetType === 'students' && studentIds?.length > 0) {
            await prisma.gameAssignment.createMany({
                data: studentIds.map((studentId: string) => ({
                    gameId,
                    targetType: 'student',
                    studentId,
                    assignedBy: userId!,
                    dueDate: dueDate ? new Date(dueDate) : null
                }))
            });
        }

        res.json({ success: true, message: 'Game assigned successfully' });

    } catch (error) {
        console.error('Assign Game error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get assigned games count for current user
export const getAssignedGamesCount = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        const count = await prisma.gameAssignment.count({
            where: { assignedBy: userId }
        });

        res.json({ count });

    } catch (error) {
        console.error('Get Assigned Games Count error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Seed games (run once to populate database)
export const seedGames = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Check if games already exist
        const existingCount = await prisma.game.count();
        if (existingCount > 0) {
            res.json({ message: 'Games already seeded', count: existingCount });
            return;
        }

        const games = [
            {
                title: 'Phonics Match',
                description: 'Match letters with their sounds in this fun drag and drop game!',
                subject: 'Phonics',
                grade: 'Primary 1',
                gameType: 'drag_drop',
                imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400'
            },
            {
                title: 'Number Bonds',
                description: 'Learn addition by finding number pairs that make 10!',
                subject: 'Math',
                grade: 'Primary 1',
                gameType: 'match',
                imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400'
            },
            {
                title: 'Letter Sounds Safari',
                description: 'Go on an adventure matching letters to animal sounds!',
                subject: 'Phonics',
                grade: 'Primary 1',
                gameType: 'audio_match',
                imageUrl: 'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=400'
            },
            {
                title: 'Shape Sorter',
                description: 'Identify and sort 2D and 3D shapes into the correct categories.',
                subject: 'Math',
                grade: 'Primary 2',
                gameType: 'drag_drop',
                imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
            },
            {
                title: 'Word Builder',
                description: 'Build words by dragging letters into the correct order.',
                subject: 'Phonics',
                grade: 'Primary 2',
                gameType: 'spelling',
                imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400'
            },
            {
                title: 'Counting Fun 1-20',
                description: 'Count objects and match them with the correct number.',
                subject: 'Math',
                grade: 'Primary 1',
                gameType: 'counting',
                imageUrl: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400'
            },
            {
                title: 'Sight Words Race',
                description: 'Race to read sight words before time runs out!',
                subject: 'Phonics',
                grade: 'Primary 2',
                gameType: 'quiz',
                imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400'
            },
            {
                title: 'Simple Subtraction',
                description: 'Practice taking away with fun visual problems.',
                subject: 'Math',
                grade: 'Primary 2',
                gameType: 'quiz',
                imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400'
            },
            {
                title: 'Rhyme Time',
                description: 'Find words that rhyme in this musical matching game!',
                subject: 'Phonics',
                grade: 'Primary 1',
                gameType: 'match',
                imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400'
            },
            {
                title: 'Pattern Match',
                description: 'Complete the pattern by finding the missing shape or number.',
                subject: 'Math',
                grade: 'Primary 3',
                gameType: 'logic',
                imageUrl: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=400'
            }
        ];

        await prisma.game.createMany({ data: games });

        res.json({ success: true, message: '10 games seeded successfully' });

    } catch (error) {
        console.error('Seed Games error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
