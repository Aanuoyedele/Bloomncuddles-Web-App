import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

// Get users in the same school (optionally filtered by role)
export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { role } = req.query;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        // Get current user's school
        const currentUser = await prisma.user.findUnique({ where: { id: userId } });

        if (!currentUser?.schoolId) {
            res.json([]);
            return;
        }

        // Build filter
        const filter: any = {
            schoolId: currentUser.schoolId,
            id: { not: userId } // Exclude self
        };

        if (role && typeof role === 'string') {
            filter.role = role;
        }

        const users = await prisma.user.findMany({
            where: filter,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                lastLoginAt: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(users);

    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete a user (admin only)
export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        // Check if current user is admin
        const currentUser = await prisma.user.findUnique({ where: { id: userId } });

        if (currentUser?.role !== 'ADMIN') {
            res.status(403).json({ message: 'Only admins can delete users' });
            return;
        }

        // Check if target user exists and is in same school
        const targetUser = await prisma.user.findUnique({ where: { id } });

        if (!targetUser || targetUser.schoolId !== currentUser.schoolId) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Prevent self-deletion
        if (id === userId) {
            res.status(400).json({ message: 'Cannot delete yourself' });
            return;
        }

        await prisma.user.delete({ where: { id } });

        res.json({ message: 'User deleted successfully' });

    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update a user (admin only)
export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        // Check if current user is admin
        const currentUser = await prisma.user.findUnique({ where: { id: userId } });

        if (currentUser?.role !== 'ADMIN') {
            res.status(403).json({ message: 'Only admins can edit users' });
            return;
        }

        // Check if target user exists and is in same school
        const targetUser = await prisma.user.findUnique({ where: { id } });

        if (!targetUser || targetUser.schoolId !== currentUser.schoolId) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Build update data
        const updateData: any = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (role && ['TEACHER', 'ADMIN'].includes(role)) updateData.role = role;

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });

        res.json(updatedUser);

    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Toggle user active status (admin only)
export const toggleUserStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        // Check if current user is admin
        const currentUser = await prisma.user.findUnique({ where: { id: userId } });

        if (currentUser?.role !== 'ADMIN') {
            res.status(403).json({ message: 'Only admins can toggle user status' });
            return;
        }

        // Check if target user exists and is in same school
        const targetUser = await prisma.user.findUnique({ where: { id } });

        if (!targetUser || targetUser.schoolId !== currentUser.schoolId) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Prevent toggling own status
        if (id === userId) {
            res.status(400).json({ message: 'Cannot toggle your own status' });
            return;
        }

        // Toggle the status
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { isActive: !targetUser.isActive },
            select: {
                id: true,
                name: true,
                isActive: true
            }
        });

        res.json(updatedUser);

    } catch (error) {
        console.error('Toggle user status error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
