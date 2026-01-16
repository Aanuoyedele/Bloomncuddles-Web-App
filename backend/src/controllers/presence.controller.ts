import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

// Update user's online status (called on login/logout or periodically)
export const updatePresence = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { isOnline } = req.body;

        if (!userId) {
            res.status(400).json({ message: 'User context missing' });
            return;
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                isOnline: isOnline ?? true,
                lastSeenAt: new Date()
            },
            select: {
                id: true,
                isOnline: true,
                lastSeenAt: true,
                isAvailableToChat: true
            }
        });

        res.json(user);
    } catch (error) {
        console.error('Update presence error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Toggle availability to chat (for teachers)
export const toggleAvailability = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { isAvailableToChat } = req.body;

        if (!userId) {
            res.status(400).json({ message: 'User context missing' });
            return;
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                isAvailableToChat: isAvailableToChat ?? true
            },
            select: {
                id: true,
                isOnline: true,
                lastSeenAt: true,
                isAvailableToChat: true
            }
        });

        res.json(user);
    } catch (error) {
        console.error('Toggle availability error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get current user's status
export const getMyStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(400).json({ message: 'User context missing' });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                isOnline: true,
                lastSeenAt: true,
                isAvailableToChat: true,
                role: true
            }
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json(user);
    } catch (error) {
        console.error('Get my status error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Heartbeat - update last seen (called periodically from frontend)
export const heartbeat = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(400).json({ message: 'User context missing' });
            return;
        }

        await prisma.user.update({
            where: { id: userId },
            data: {
                isOnline: true,
                lastSeenAt: new Date()
            }
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Heartbeat error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
