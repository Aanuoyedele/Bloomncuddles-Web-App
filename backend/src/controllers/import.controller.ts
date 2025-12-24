import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { sendPasswordSetupEmail } from '../services/email.service';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

interface TeacherRow {
    firstName: string;
    lastName: string;
    subjects?: string;
    email: string;
    address?: string;
    phone?: string;
}

interface StudentRow {
    firstName: string;
    lastName: string;
    className: string;
    email?: string;
    phone?: string;
    grade?: string;
}

interface ParentRow {
    firstName: string;
    lastName: string;
    childNames: string; // Comma-separated child names
    email: string;
    phone?: string;
}

// Parse CSV string into array of objects
const parseCSV = (csvText: string): Record<string, string>[] => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, ''));
    const rows: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const row: Record<string, string> = {};
        headers.forEach((header, index) => {
            row[header] = values[index] || '';
        });
        rows.push(row);
    }

    return rows;
};

// Generate a random token
const generateToken = (): string => {
    return crypto.randomBytes(32).toString('hex');
};

// Create a temporary password (will be changed by user)
const generateTempPassword = (): string => {
    return crypto.randomBytes(16).toString('hex');
};

export const bulkImportTeachers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { csvData } = req.body;

        if (!csvData) {
            res.status(400).json({ message: 'CSV data is required' });
            return;
        }

        // Get current user and school
        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
            include: { school: true }
        });

        if (!currentUser?.schoolId || !currentUser.school) {
            res.status(400).json({ message: 'User must belong to a school' });
            return;
        }

        const rows = parseCSV(csvData);
        const results = { success: 0, failed: 0, errors: [] as string[] };

        for (const row of rows) {
            try {
                const email = row.email;
                const firstName = row.firstname || row['first name'] || '';
                const lastName = row.lastname || row['last name'] || '';
                const name = `${firstName} ${lastName}`.trim();
                const subjects = row.subjects || row.subject || '';
                const address = row.address || '';
                const phone = row.phone || row.phonenumber || row['phone number'] || '';

                if (!email || !name) {
                    results.errors.push(`Missing email or name for row`);
                    results.failed++;
                    continue;
                }

                // Check if user already exists
                const existing = await prisma.user.findUnique({ where: { email } });
                if (existing) {
                    results.errors.push(`User ${email} already exists`);
                    results.failed++;
                    continue;
                }

                // Create user with temp password
                const tempPassword = generateTempPassword();
                const hashedPassword = await bcrypt.hash(tempPassword, 10);

                const newUser = await prisma.user.create({
                    data: {
                        email,
                        name,
                        password: hashedPassword,
                        role: 'TEACHER',
                        address: address || null,
                        phone: phone || null,
                        schoolId: currentUser.schoolId
                    }
                });

                // Create password reset token
                const token = generateToken();
                const expiresAt = new Date();
                expiresAt.setHours(expiresAt.getHours() + 48);

                await prisma.passwordResetToken.create({
                    data: {
                        token,
                        userId: newUser.id,
                        expiresAt
                    }
                });

                // Send password setup email
                await sendPasswordSetupEmail({
                    to: email,
                    name,
                    schoolName: currentUser.school.name,
                    token,
                    role: 'Teacher'
                });

                results.success++;
            } catch (err: any) {
                results.errors.push(`Error processing row: ${err.message}`);
                results.failed++;
            }
        }

        res.json({
            message: `Import complete. ${results.success} teachers added.`,
            ...results
        });
    } catch (error) {
        console.error('Bulk Import Teachers error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const bulkImportStudents = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { csvData } = req.body;

        if (!csvData) {
            res.status(400).json({ message: 'CSV data is required' });
            return;
        }

        // Get current user and school
        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
            include: { school: true }
        });

        if (!currentUser?.schoolId) {
            res.status(400).json({ message: 'User must belong to a school' });
            return;
        }

        // Get classes for this school
        const classes = await prisma.class.findMany({
            where: { schoolId: currentUser.schoolId }
        });

        const rows = parseCSV(csvData);
        const results = { success: 0, failed: 0, errors: [] as string[] };

        for (const row of rows) {
            try {
                const firstName = row.firstname || row['first name'] || '';
                const lastName = row.lastname || row['last name'] || '';
                const name = `${firstName} ${lastName}`.trim();
                const className = row.class || row.classname || row['class name'] || '';
                const grade = row.grade || '';

                if (!name || !className) {
                    results.errors.push(`Missing name or class for row`);
                    results.failed++;
                    continue;
                }

                // Find matching class
                const matchedClass = classes.find(c =>
                    c.name.toLowerCase() === className.toLowerCase()
                );

                if (!matchedClass) {
                    results.errors.push(`Class "${className}" not found for student ${name}`);
                    results.failed++;
                    continue;
                }

                // Create student
                await prisma.student.create({
                    data: {
                        name,
                        grade: grade || matchedClass.grade,
                        classId: matchedClass.id
                    }
                });

                results.success++;
            } catch (err: any) {
                results.errors.push(`Error processing row: ${err.message}`);
                results.failed++;
            }
        }

        res.json({
            message: `Import complete. ${results.success} students added.`,
            ...results
        });
    } catch (error) {
        console.error('Bulk Import Students error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const bulkImportParents = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { csvData } = req.body;

        if (!csvData) {
            res.status(400).json({ message: 'CSV data is required' });
            return;
        }

        // Get current user and school
        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
            include: { school: true }
        });

        if (!currentUser?.schoolId || !currentUser.school) {
            res.status(400).json({ message: 'User must belong to a school' });
            return;
        }

        // Get students for matching
        const classes = await prisma.class.findMany({
            where: { schoolId: currentUser.schoolId },
            include: { students: true }
        });
        const allStudents = classes.flatMap(c => c.students);

        const rows = parseCSV(csvData);
        const results = { success: 0, failed: 0, errors: [] as string[] };

        for (const row of rows) {
            try {
                const email = row.email;
                const firstName = row.firstname || row['first name'] || '';
                const lastName = row.lastname || row['last name'] || '';
                const name = `${firstName} ${lastName}`.trim();
                const childNames = row.childnames || row['child names'] || row.children || row['name of children'] || '';
                const phone = row.phone || row.phonenumber || row['phone number'] || '';

                if (!email || !name) {
                    results.errors.push(`Missing email or name for row`);
                    results.failed++;
                    continue;
                }

                // Check if user already exists
                const existing = await prisma.user.findUnique({ where: { email } });
                if (existing) {
                    results.errors.push(`User ${email} already exists`);
                    results.failed++;
                    continue;
                }

                // Create user with temp password
                const tempPassword = generateTempPassword();
                const hashedPassword = await bcrypt.hash(tempPassword, 10);

                const newUser = await prisma.user.create({
                    data: {
                        email,
                        name,
                        password: hashedPassword,
                        role: 'PARENT',
                        phone: phone || null,
                        schoolId: currentUser.schoolId
                    }
                });

                // Link to children if provided
                if (childNames) {
                    const childList = childNames.split(',').map((c: string) => c.trim().toLowerCase());
                    for (const childName of childList) {
                        const matchedStudent = allStudents.find(s =>
                            s.name.toLowerCase() === childName
                        );
                        if (matchedStudent) {
                            await prisma.parentStudent.create({
                                data: {
                                    parentId: newUser.id,
                                    studentId: matchedStudent.id
                                }
                            });
                        }
                    }
                }

                // Create password reset token
                const token = generateToken();
                const expiresAt = new Date();
                expiresAt.setHours(expiresAt.getHours() + 48);

                await prisma.passwordResetToken.create({
                    data: {
                        token,
                        userId: newUser.id,
                        expiresAt
                    }
                });

                // Send password setup email
                await sendPasswordSetupEmail({
                    to: email,
                    name,
                    schoolName: currentUser.school.name,
                    token,
                    role: 'Parent'
                });

                results.success++;
            } catch (err: any) {
                results.errors.push(`Error processing row: ${err.message}`);
                results.failed++;
            }
        }

        res.json({
            message: `Import complete. ${results.success} parents added.`,
            ...results
        });
    } catch (error) {
        console.error('Bulk Import Parents error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
