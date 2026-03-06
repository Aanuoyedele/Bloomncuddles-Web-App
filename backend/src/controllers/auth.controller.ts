import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../config/database';
import { sendPasswordResetEmail } from '../services/email.service';
import { PLANS } from './billing.controller';

const JWT_SECRET = process.env.JWT_SECRET!;
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

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
        const hashedPassword = await bcrypt.hash(password, 12);

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
        // FLOW 3: Parent Registration
        // ===============================
        else if (registrationType === 'parent') {
            // Create parent user (no school required)
            user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    role: 'PARENT',
                    address,
                    phone
                }
            });

            // Auto-link to students with matching parentEmail
            const matchingStudents = await prisma.student.findMany({
                where: { parentEmail: email.toLowerCase() }
            });

            for (const student of matchingStudents) {
                try {
                    await prisma.parentStudent.create({
                        data: {
                            parentId: user!.id,
                            studentId: student.id
                        }
                    });
                } catch (e) {
                    // Skip if already exists
                }
            }

            if (matchingStudents.length > 0) {
                console.log(`Auto-linked parent ${name} to ${matchingStudents.length} student(s)`);
            }
        }
        // ===============================
        // FLOW 4: Independent Teacher Registration
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

        // FETCH PLAN
        let plan = 'basic';
        if (user.schoolId) {
             const sub = await prisma.subscription.findFirst({
                 where: { schoolId: user.schoolId, status: 'active' }
             });
             if (sub) plan = sub.plan;
        }

        // Generate Token (include name and plan for frontend greeting)
        const token = jwt.sign({ 
            userId: user.id, 
            role: user.role, 
            name: user.name, 
            schoolId: user.schoolId,
            plan 
        }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                schoolId: user.schoolId,
                plan
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

        // Find user (admin/teacher/parent)
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

        // Update last login timestamp
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() }
        });

        // FETCH PLAN
        let plan = 'basic';
        if (user.schoolId) {
             const sub = await prisma.subscription.findFirst({
                 where: { schoolId: user.schoolId, status: 'active' }
             });
             if (sub) plan = sub.plan;
        }

        const token = jwt.sign({ 
            userId: user.id, 
            role: user.role, 
            name: user.name, 
            schoolId: user.schoolId,
            plan
        }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                schoolId: user.schoolId,
                plan
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
        const hashedPassword = await bcrypt.hash(password, 12);

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

// Request password reset (forgot password)
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        if (!email) {
            res.status(400).json({ message: 'Email is required' });
            return;
        }

        // Look up user
        const user = await prisma.user.findUnique({ where: { email } });

        // Always return success to prevent email enumeration
        // (don't reveal if email exists or not)
        if (!user) {
            res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
            return;
        }

        // Generate a secure token
        const token = crypto.randomBytes(32).toString('hex');

        // Token expires in 1 hour
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);

        // Delete any existing reset tokens for this user
        await prisma.passwordResetToken.deleteMany({
            where: { userId: user.id }
        });

        // Create new reset token
        await prisma.passwordResetToken.create({
            data: {
                token,
                userId: user.id,
                expiresAt
            }
        });

        // Send email
        await sendPasswordResetEmail({
            to: user.email,
            name: user.name,
            token
        });

        res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// ===============================================
// SCHOOL REGISTRATION WITH PAYMENT (No Auth)
// ===============================================

async function paystackRequest(endpoint: string, method: string = 'GET', data?: any) {
    const response = await fetch(`${PAYSTACK_BASE_URL}${endpoint}`, {
        method,
        headers: {
            'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
        },
        body: data ? JSON.stringify(data) : undefined
    });
    return response.json();
}

/**
 * Register a new school with admin account and initialize payment.
 * Creates school + user in "pending" state, then redirects to Paystack.
 */
export const registerSchool = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            // School info
            schoolName,
            schoolAddress,
            numberOfPupils,
            termRevenueRange,
            certificateUrl,   // Base64 data URL from frontend
            // Admin info
            adminName,
            adminIdUrl,        // Base64 data URL
            email,
            password,
            // Subscription
            plan,
            interval           // 'monthly' | 'yearly'
        } = req.body;

        // ---- Validation ----
        const errors: Record<string, string> = {};
        if (!schoolName) errors.schoolName = 'School name is required';
        if (!schoolAddress) errors.schoolAddress = 'School address is required';
        if (!numberOfPupils) errors.numberOfPupils = 'Number of pupils is required';
        if (!termRevenueRange) errors.termRevenueRange = 'Term revenue range is required';
        if (!certificateUrl) errors.certificateUrl = 'Certificate of registration is required';
        if (!adminName) errors.adminName = 'Admin name is required';
        if (!adminIdUrl) errors.adminIdUrl = 'Government-issued ID is required';
        if (!email) errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Email is invalid';
        if (!password) errors.password = 'Password is required';
        else if (password.length < 8) errors.password = 'Password must be at least 8 characters';
        if (!plan || !['basic', 'premium', 'enterprise'].includes(plan)) errors.plan = 'Valid plan is required';
        if (!interval || !['monthly', 'yearly'].includes(interval)) errors.interval = 'Valid interval is required';

        if (Object.keys(errors).length > 0) {
            res.status(400).json({ message: 'Validation failed', errors });
            return;
        }

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'An account with this email already exists' });
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create school + admin user in a transaction (inactive until payment)
        const result = await prisma.$transaction(async (tx) => {
            const school = await tx.school.create({
                data: {
                    name: schoolName,
                    address: schoolAddress,
                    email: email,
                    numberOfPupils,
                    termRevenueRange,
                    certificateUrl,
                    adminIdUrl,
                    isActive: false  // Pending payment
                }
            });

            const user = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name: adminName,
                    role: 'ADMIN',
                    isActive: false,  // Pending payment
                    schoolId: school.id
                }
            });

            return { school, user };
        });

        // Initialize Paystack payment
        const planDetails = PLANS[plan as keyof typeof PLANS];
        const amount = interval === 'yearly' ? planDetails.yearlyAmount : planDetails.monthlyAmount;
        const reference = `BNC_REG_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

        const paystackResponse = await paystackRequest('/transaction/initialize', 'POST', {
            email: email,
            amount: amount,
            reference: reference,
            callback_url: `${process.env.APP_URL || 'http://localhost:3000'}/register/callback`,
            metadata: {
                schoolId: result.school.id,
                userId: result.user.id,
                plan: plan,
                interval: interval,
                schoolName: schoolName,
                registrationFlow: true
            }
        });

        if (!paystackResponse.status) {
            // Rollback: delete the user and school
            await prisma.user.delete({ where: { id: result.user.id } });
            await prisma.school.delete({ where: { id: result.school.id } });
            res.status(400).json({ message: paystackResponse.message || 'Failed to initialize payment' });
            return;
        }

        // Create pending payment record
        await prisma.payment.create({
            data: {
                schoolId: result.school.id,
                amount: amount,
                paystackReference: reference,
                description: `${planDetails.name} - ${interval === 'yearly' ? 'Annual' : 'Monthly'} Subscription (Registration)`,
                status: 'pending'
            }
        });

        res.status(201).json({
            authorizationUrl: paystackResponse.data.authorization_url,
            reference: reference,
            schoolId: result.school.id
        });

    } catch (error) {
        console.error('Register School error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Verify registration payment from Paystack callback.
 * Activates school + user, creates subscription, and returns JWT.
 */
export const verifyRegistrationPayment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { reference } = req.query;

        if (!reference) {
            res.status(400).json({ message: 'Payment reference is required' });
            return;
        }

        // Find payment record
        const payment = await prisma.payment.findUnique({
            where: { paystackReference: reference as string }
        });

        if (!payment) {
            res.status(404).json({ message: 'Payment not found' });
            return;
        }

        // Verify with Paystack
        const paystackResponse = await paystackRequest(`/transaction/verify/${reference}`);

        if (!paystackResponse.status || paystackResponse.data.status !== 'success') {
            await prisma.payment.update({
                where: { id: payment.id },
                data: { status: 'failed' }
            });
            res.status(400).json({ message: 'Payment verification failed', success: false });
            return;
        }

        const txData = paystackResponse.data;
        const metadata = txData.metadata || {};

        // Update payment
        await prisma.payment.update({
            where: { id: payment.id },
            data: {
                status: 'success',
                paystackChannel: txData.channel,
                paidAt: new Date(txData.paid_at)
            }
        });

        // Activate school and user
        await prisma.school.update({
            where: { id: payment.schoolId },
            data: { isActive: true }
        });

        const user = await prisma.user.findFirst({
            where: { schoolId: payment.schoolId, role: 'ADMIN' }
        });

        if (user) {
            await prisma.user.update({
                where: { id: user.id },
                data: { isActive: true }
            });
        }

        // Calculate subscription period
        const now = new Date();
        const periodEnd = new Date(now);
        if (metadata.interval === 'yearly') {
            periodEnd.setFullYear(periodEnd.getFullYear() + 1);
        } else {
            periodEnd.setMonth(periodEnd.getMonth() + 1);
        }

        // Create subscription
        await prisma.subscription.create({
            data: {
                schoolId: payment.schoolId,
                plan: metadata.plan || 'basic',
                status: 'active',
                interval: metadata.interval || 'monthly',
                amount: payment.amount,
                currentPeriodStart: now,
                currentPeriodEnd: periodEnd,
                nextPaymentDate: periodEnd,
                paystackCustomerCode: txData.customer?.customer_code,
                paystackAuthorizationCode: txData.authorization?.authorization_code
            }
        });

        // Generate JWT for auto-login
        if (user) {
            const plan = metadata.plan || 'basic';
            const token = jwt.sign(
                { userId: user.id, role: user.role, name: user.name, schoolId: user.schoolId, plan },
                JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.json({
                success: true,
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    schoolId: user.schoolId,
                    plan
                }
            });
        } else {
            res.json({ success: true, message: 'Payment verified. Please log in.' });
        }

    } catch (error) {
        console.error('Verify Registration Payment error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
