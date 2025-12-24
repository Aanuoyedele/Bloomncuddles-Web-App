import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { sendInviteEmail } from '../services/email.service';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Create invite and send email
export const createInvite = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { email, role = 'TEACHER' } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        if (!email) {
            res.status(400).json({ message: 'Email is required' });
            return;
        }

        // Validate role
        if (!['TEACHER', 'ADMIN'].includes(role)) {
            res.status(400).json({ message: 'Invalid role. Must be TEACHER or ADMIN' });
            return;
        }

        // Get the user's school
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { school: true }
        });

        if (!user?.schoolId || !user.school) {
            res.status(400).json({ message: 'You must belong to a school to invite users' });
            return;
        }

        // Check if user is admin
        if (user.role !== 'ADMIN') {
            res.status(403).json({ message: 'Only school admins can invite users' });
            return;
        }

        // Check if email already invited (and not used)
        const existingInvite = await prisma.invite.findFirst({
            where: { email, schoolId: user.schoolId, used: false }
        });

        if (existingInvite) {
            res.status(400).json({ message: 'An invite has already been sent to this email' });
            return;
        }

        // Check if email already registered in this school
        const existingUser = await prisma.user.findFirst({
            where: { email, schoolId: user.schoolId }
        });

        if (existingUser) {
            res.status(400).json({ message: 'This email is already registered in your school' });
            return;
        }

        // Generate unique token
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

        // Create invite
        const invite = await prisma.invite.create({
            data: {
                email,
                token,
                role,
                expiresAt,
                schoolId: user.schoolId,
                createdById: userId
            }
        });

        // Send email
        const emailSent = await sendInviteEmail({
            to: email,
            inviteToken: token,
            schoolName: user.school.name,
            inviterName: user.name,
            role
        });

        if (!emailSent) {
            // Still create the invite, but warn about email
            res.status(201).json({
                invite,
                warning: 'Invite created but email could not be sent. Share the link manually.',
                inviteUrl: `${process.env.APP_URL || 'http://localhost:3000'}/register/invite?token=${token}`
            });
            return;
        }

        res.status(201).json({ invite, message: 'Invite sent successfully' });

    } catch (error) {
        console.error('Create invite error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Validate invite token (for registration page)
export const validateInvite = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { token } = req.params;

        const invite = await prisma.invite.findUnique({
            where: { token },
            include: { school: true }
        });

        if (!invite) {
            res.status(404).json({ message: 'Invalid invite token' });
            return;
        }

        if (invite.used) {
            res.status(400).json({ message: 'This invite has already been used' });
            return;
        }

        if (new Date() > invite.expiresAt) {
            res.status(400).json({ message: 'This invite has expired' });
            return;
        }

        res.json({
            valid: true,
            email: invite.email,
            role: invite.role,
            schoolName: invite.school.name,
            schoolId: invite.schoolId
        });

    } catch (error) {
        console.error('Validate invite error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get pending invites for admin
export const getInvites = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user?.schoolId) {
            res.json([]);
            return;
        }

        if (user.role !== 'ADMIN') {
            res.status(403).json({ message: 'Only admins can view invites' });
            return;
        }

        const invites = await prisma.invite.findMany({
            where: { schoolId: user.schoolId },
            orderBy: { createdAt: 'desc' }
        });

        res.json(invites);

    } catch (error) {
        console.error('Get invites error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Revoke (delete) an invite
export const revokeInvite = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (user?.role !== 'ADMIN') {
            res.status(403).json({ message: 'Only admins can revoke invites' });
            return;
        }

        const invite = await prisma.invite.findUnique({ where: { id } });

        if (!invite || invite.schoolId !== user.schoolId) {
            res.status(404).json({ message: 'Invite not found' });
            return;
        }

        await prisma.invite.delete({ where: { id } });

        res.json({ message: 'Invite revoked successfully' });

    } catch (error) {
        console.error('Revoke invite error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
