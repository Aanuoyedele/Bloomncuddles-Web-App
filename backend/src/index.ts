import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { requestLogger } from './middleware/requestLogger.middleware';
import logger from './config/logger';

// Route imports
import authRoutes from './routes/auth.routes';
import classRoutes from './routes/classes.routes';
import studentRoutes from './routes/students.routes';
import assignmentRoutes from './routes/assignments.routes';
import inviteRoutes from './routes/invites.routes';
import userRoutes from './routes/users.routes';
import statsRoutes from './routes/stats.routes';
import importRoutes from './routes/import.routes';
import schoolRoutes from './routes/school.routes';
import reportsRoutes from './routes/reports.routes';
import billingRoutes from './routes/billing.routes';
import notificationsRoutes from './routes/notifications.routes';
import gamesRoutes from './routes/games.routes';
import libraryRoutes from './routes/library.routes';
import studentPortalRoutes from './routes/student.routes';
import messageRoutes from './routes/messages.routes';
import presenceRoutes from './routes/presence.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// Request logging (structured, via Winston)
app.use(requestLogger);

// HTTP Security Headers (Helmet)
app.use(helmet());

// CORS — restrict to known origins
const allowedOrigins = [
    'http://localhost:3000',
    process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, Postman)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS: Origin ${origin} not allowed`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Global Rate Limiter — 100 requests per minute per IP
const globalLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use(globalLimiter);

// Response compression (gzip/brotli)
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' })); // Support CSV uploads

// ============================================
// ROUTES
// ============================================

app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/invites', inviteRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/import', importRoutes);
app.use('/api/school', schoolRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/student', studentPortalRoutes);  // Student Portal routes
app.use('/api/messages', messageRoutes);
app.use('/api/presence', presenceRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
    res.send('Bloomncuddles API is running');
});

// ============================================
// ERROR HANDLING (must be AFTER all routes)
// ============================================

app.use(notFoundHandler);
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================

app.listen(port, () => {
    logger.info(`Server is running at http://localhost:${port}`);
});
