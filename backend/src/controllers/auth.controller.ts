import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_change_me';

/**
 * Register endpoint supporting three registration flows:
 * 1. school_admin - Creates a new school and admin user
 * 2. teacher - Creates independent teacher with personal school
 * 3. invite - Joins existing school via invite token
 */
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            email,
            password,
            name,
            address,
            phone,
            registrationType = 'teacher', // 'school_admin' | 'teacher' | 'invite'
            schoolName,  // Required for school_admin
            inviteToken  // Required for invite
        } = req.body;

        // Basic Validation
        if (!email || !password || !name) {
            res.status(400).json({ message: 'Email, password, and name are required' });
            return;
        }

        // Check existing user
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        let user;

        // ===============================
        // FLOW 1: School Admin Registration
        // ===============================
        if (registrationType === 'school_admin') {
            if (!schoolName) {
                res.status(400).json({ message: 'School name is required for school admin registration' });
                return;
            }

            user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    role: 'ADMIN',
                    address,
                    phone,
                    school: {
                        create: { name: schoolName }
                    }
                }
            });
        }
        // ===============================
        // FLOW 2: Invite Registration
        // ===============================
        else if (registrationType === 'invite') {
            if (!inviteToken) {
                res.status(400).json({ message: 'Invite token is required' });
                return;
            }

            // Validate invite
            const invite = await prisma.invite.findUnique({
                where: { token: inviteToken },
                include: { school: true }
            });

            if (!invite) {
                res.status(400).json({ message: 'Invalid invite token' });
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

            // Email must match invite
            if (invite.email.toLowerCase() !== email.toLowerCase()) {
                res.status(400).json({ message: 'Email does not match the invite' });
                return;
            }

            // Create user and link to school
            user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    role: invite.role,
                    address,
                    phone,
                    schoolId: invite.schoolId
                }
            });

            // Mark invite as used
            await prisma.invite.update({
                where: { id: invite.id },
                data: { used: true }
            });
        }
        // ===============================
        // FLOW 3: Independent Teacher Registration
        // ===============================
        else {
            // Create personal school for independent teacher
            user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    role: 'TEACHER',
                    address,
                    phone,
                    school: {
                        create: { name: `${name}'s Classroom` }
                    }
                }
            });
        }

        // Generate Token
        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                schoolId: user.schoolId
            }
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Email and password required" });
            return;
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                schoolId: user.schoolId
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Validate password setup token (for bulk imported users)
export const validateSetupToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token } = req.body;

        if (!token) {
            res.status(400).json({ message: 'Token is required' });
            return;
        }

        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token }
        });

        if (!resetToken) {
            res.status(400).json({ message: 'Invalid token' });
            return;
        }

        if (resetToken.usedAt) {
            res.status(400).json({ message: 'This link has already been used' });
            return;
        }

        if (new Date() > resetToken.expiresAt) {
            res.status(400).json({ message: 'This link has expired' });
            return;
        }

        // Get user info
        const user = await prisma.user.findUnique({
            where: { id: resetToken.userId },
            select: { name: true, email: true }
        });

        if (!user) {
            res.status(400).json({ message: 'User not found' });
            return;
        }

        res.json({ name: user.name, email: user.email });
    } catch (error) {
        console.error('Validate setup token error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Set password for bulk imported users
export const setupPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            res.status(400).json({ message: 'Token and password are required' });
            return;
        }

        if (password.length < 8) {
            res.status(400).json({ message: 'Password must be at least 8 characters' });
            return;
        }

        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token }
        });

        if (!resetToken || resetToken.usedAt || new Date() > resetToken.expiresAt) {
            res.status(400).json({ message: 'Invalid or expired token' });
            return;
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user password
        await prisma.user.update({
            where: { id: resetToken.userId },
            data: { password: hashedPassword }
        });

        // Mark token as used
        await prisma.passwordResetToken.update({
            where: { id: resetToken.id },
            data: { usedAt: new Date() }
        });

        res.json({ message: 'Password set successfully' });
    } catch (error) {
        console.error('Setup password error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
