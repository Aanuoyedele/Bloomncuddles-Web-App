import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

// Get current user's school settings
export const getSchoolSettings = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                school: true
            }
        });

        if (!user?.school) {
            res.status(404).json({ message: 'No school found for this user' });
            return;
        }

        res.json(user.school);
    } catch (error) {
        console.error('Get School Settings error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update school settings (admin only)
export const updateSchoolSettings = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { name, email, address, logoUrl, primaryColor, theme, academicYear, currentTerm } = req.body;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        // Check if user is admin
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (user?.role !== 'ADMIN') {
            res.status(403).json({ message: 'Only admins can update school settings' });
            return;
        }

        if (!user.schoolId) {
            res.status(404).json({ message: 'No school found for this user' });
            return;
        }

        // Build update data
        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (address !== undefined) updateData.address = address;
        if (logoUrl !== undefined) updateData.logoUrl = logoUrl;
        if (primaryColor !== undefined) updateData.primaryColor = primaryColor;
        if (theme !== undefined) updateData.theme = theme;
        if (academicYear !== undefined) updateData.academicYear = academicYear;
        if (currentTerm !== undefined) updateData.currentTerm = currentTerm;

        const updatedSchool = await prisma.school.update({
            where: { id: user.schoolId },
            data: updateData
        });

        res.json(updatedSchool);
    } catch (error) {
        console.error('Update School Settings error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
