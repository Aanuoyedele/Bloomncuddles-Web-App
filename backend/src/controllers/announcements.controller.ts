import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

// Get announcements for a school
export const getAnnouncements = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const schoolId = req.user?.schoolId;

        if (!schoolId) {
            res.status(403).json({ message: 'User not associated with a school' });
            return;
        }

        const announcements = await prisma.announcement.findMany({
            where: { schoolId },
            include: {
                author: {
                    select: { name: true, role: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 50 // Limit to recent 50
        });

        res.json({ announcements });
    } catch (error) {
        console.error('Fetch announcements error:', error);
        res.status(500).json({ message: 'Failed to fetch announcements' });
    }
};

// Create a new announcement
export const createAnnouncement = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, content, targetType } = req.body;
        const schoolId = req.user?.schoolId;
        const authorId = req.user?.userId;

        if (!schoolId || !authorId) {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }

        if (!title || !content || !targetType) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        const newAnnouncement = await prisma.announcement.create({
            data: {
                title,
                content,
                targetType,
                schoolId,
                authorId
            },
            include: {
                author: {
                    select: { name: true, role: true }
                }
            }
        });

        res.status(201).json({ message: 'Announcement sent successfully', announcement: newAnnouncement });
    } catch (error) {
        console.error('Create announcement error:', error);
        res.status(500).json({ message: 'Failed to send announcement' });
    }
};
