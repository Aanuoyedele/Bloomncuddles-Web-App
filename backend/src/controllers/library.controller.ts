import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

// Get all books with filters and pagination
export const getBooks = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { subject, level, search, page = '1', limit = '8' } = req.query;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user?.schoolId) {
            res.json({ books: [], total: 0 });
            return;
        }

        const where: any = { schoolId: user.schoolId };

        if (subject && subject !== 'all') {
            where.subject = subject;
        }
        if (level && level !== 'all') {
            where.level = level;
        }
        if (search) {
            where.OR = [
                { title: { contains: search as string } },
                { author: { contains: search as string } }
            ];
        }

        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

        const [books, total] = await Promise.all([
            prisma.book.findMany({
                where,
                skip,
                take: parseInt(limit as string),
                orderBy: { createdAt: 'desc' }
            }),
            prisma.book.count({ where })
        ]);

        res.json({ books, total, page: parseInt(page as string), limit: parseInt(limit as string) });

    } catch (error) {
        console.error('Get Books error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Create/upload a book
export const createBook = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { title, author, description, subject, level, fileUrl, coverUrl } = req.body;

        if (!title || !fileUrl) {
            res.status(400).json({ message: 'Title and file are required' });
            return;
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user?.schoolId) {
            res.status(400).json({ message: 'No school found' });
            return;
        }

        const book = await prisma.book.create({
            data: {
                title,
                author,
                description,
                subject,
                level,
                fileUrl,
                coverUrl,
                schoolId: user.schoolId,
                uploadedBy: userId!
            }
        });

        res.json(book);

    } catch (error) {
        console.error('Create Book error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get single book
export const getBook = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const book = await prisma.book.findUnique({
            where: { id }
        });

        if (!book) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }

        res.json(book);

    } catch (error) {
        console.error('Get Book error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Assign book to grade/class/students
export const assignBook = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { bookId, targetType, targetGrade, classId, studentIds } = req.body;

        if (!bookId || !targetType) {
            res.status(400).json({ message: 'Book ID and target type are required' });
            return;
        }

        const book = await prisma.book.findUnique({ where: { id: bookId } });
        if (!book) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }

        if (targetType === 'grade') {
            await prisma.bookAssignment.create({
                data: {
                    bookId,
                    targetType: 'grade',
                    targetGrade,
                    assignedBy: userId!
                }
            });
        } else if (targetType === 'class') {
            await prisma.bookAssignment.create({
                data: {
                    bookId,
                    targetType: 'class',
                    classId,
                    assignedBy: userId!
                }
            });
        } else if (targetType === 'students' && studentIds?.length > 0) {
            await prisma.bookAssignment.createMany({
                data: studentIds.map((studentId: string) => ({
                    bookId,
                    targetType: 'student',
                    studentId,
                    assignedBy: userId!
                }))
            });
        }

        res.json({ success: true, message: 'Book assigned successfully' });

    } catch (error) {
        console.error('Assign Book error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete book
export const deleteBook = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        await prisma.bookAssignment.deleteMany({ where: { bookId: id } });
        await prisma.book.delete({ where: { id } });

        res.json({ success: true });

    } catch (error) {
        console.error('Delete Book error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
