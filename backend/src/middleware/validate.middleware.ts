import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

/**
 * Generic validation middleware.
 * Validates req.body against a Zod schema.
 * Returns 400 with field-level errors if validation fails.
 * 
 * Usage in routes:
 *   router.post('/register', validate(registerSchema), register);
 */
export const validate = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const fieldErrors = result.error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message
            }));

            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: fieldErrors
            });
            return;
        }

        next();
    };
};
