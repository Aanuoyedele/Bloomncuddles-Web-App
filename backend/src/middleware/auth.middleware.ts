import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET environment variable is not set. Server cannot start.');
}

export interface AuthRequest extends Request {
    user?: {
        userId?: string;    // For admin/teacher/parent
        studentId?: string; // For students
        role: string;
        name?: string;
        schoolId?: string;  // User's school
        classId?: string;   // Student's class
        grade?: string;     // Student's grade
    };
}


export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        res.status(401).json({ message: 'Access denied. No token provided.' });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

export const authorize = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
            return;
        }
        next();
    };
};


import prisma from '../config/database';

export const requirePlan = (allowedPlans: string[]) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.user || !req.user.schoolId) {
                res.status(401).json({ message: 'User not associated with a school.' });
                return;
            }

            // Fetch the active subscription for the school
            const subscription = await prisma.subscription.findFirst({
                where: { 
                    schoolId: req.user.schoolId,
                    status: 'active' 
                }
            });

            // If no active subscription, default to basic or deny access
            const currentPlan = subscription?.plan || 'basic'; // Default to basic if expired/none

            if (!allowedPlans.includes(currentPlan)) {
                res.status(403).json({ 
                    message: `This feature requires one of the following plans: ${allowedPlans.join(', ')}` 
                });
                return;
            }

            next();
        } catch (error) {
            res.status(500).json({ message: 'Error verifying school plan.' });
        }
    };
};
