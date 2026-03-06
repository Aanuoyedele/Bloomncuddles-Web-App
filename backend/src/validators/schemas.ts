import { z } from 'zod';

// ==================== AUTH ====================

export const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters').max(128, 'Password must be at most 128 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be at most 100 characters'),
    address: z.string().optional(),
    phone: z.string().optional(),
    registrationType: z.enum(['school_admin', 'teacher', 'invite', 'parent']).optional(),
    schoolName: z.string().min(2).optional(),
    inviteToken: z.string().optional(),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

export const setupPasswordSchema = z.object({
    token: z.string().min(1, 'Token is required'),
    password: z.string().min(8, 'Password must be at least 8 characters').max(128),
});

export const validateSetupTokenSchema = z.object({
    token: z.string().min(1, 'Token is required'),
});

export const registerSchoolSchema = z.object({
    schoolName: z.string().min(2, 'School name is required'),
    schoolAddress: z.string().min(2, 'School address is required'),
    numberOfPupils: z.union([z.string(), z.number()]),
    termRevenueRange: z.string().min(1, 'Term revenue range is required'),
    certificateUrl: z.string().min(1, 'Certificate of registration is required'),
    adminName: z.string().min(2, 'Admin name is required'),
    adminIdUrl: z.string().min(1, 'Government-issued ID is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    plan: z.enum(['basic', 'premium', 'enterprise'], { message: 'Valid plan is required' }),
    interval: z.enum(['monthly', 'yearly'], { message: 'Valid interval is required' }),
});

// ==================== STUDENTS ====================

export const createStudentSchema = z.object({
    name: z.string().min(1, 'Student name is required').max(100),
    grade: z.string().min(1, 'Grade is required'),
    classId: z.string().uuid('Invalid class ID'),
    dateOfBirth: z.string().optional(),
    parentEmail: z.string().email().optional().or(z.literal('')),
});

export const updateStudentSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    grade: z.string().optional(),
    classId: z.string().uuid().optional(),
    dateOfBirth: z.string().optional(),
    parentEmail: z.string().email().optional().or(z.literal('')).or(z.null()),
});

// ==================== CLASSES ====================

export const createClassSchema = z.object({
    name: z.string().min(1, 'Class name is required').max(100),
    grade: z.string().min(1, 'Grade is required'),
    schedule: z.string().optional(),
});

export const updateClassSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    grade: z.string().optional(),
    schedule: z.string().optional(),
});

// ==================== ASSIGNMENTS ====================

export const createAssignmentSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200),
    description: z.string().optional(),
    dueDate: z.string().min(1, 'Due date is required'),
    classId: z.string().uuid('Invalid class ID'),
    fileUrl: z.string().optional(),
});

// ==================== INVITES ====================

export const createInviteSchema = z.object({
    email: z.string().email('Invalid email address'),
    role: z.enum(['TEACHER', 'ADMIN']).optional(),
});

// ==================== MESSAGES ====================

export const sendMessageSchema = z.object({
    content: z.string().min(1, 'Message content is required').max(5000),
    receiverId: z.string().uuid().optional(),
    type: z.enum(['general', 'assignment', 'game', 'class']).optional(),
    contextId: z.string().optional(),
});
