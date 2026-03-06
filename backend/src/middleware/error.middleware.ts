import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

/**
 * Global error-handling middleware.
 * Catches all unhandled errors and returns a consistent JSON response.
 * Must be registered AFTER all routes in index.ts.
 */
export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.error(`${req.method} ${req.path}`, { error: err.message, stack: err.stack });

    // Don't leak stack traces in production
    const isDev = process.env.NODE_ENV !== 'production';

    res.status(500).json({
        success: false,
        message: 'Internal server error',
        ...(isDev && { error: err.message })
    });
};

/**
 * Catch-all for 404 routes.
 * Register AFTER all routes but BEFORE the error handler.
 */
export const notFoundHandler = (req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.path}`
    });
};
