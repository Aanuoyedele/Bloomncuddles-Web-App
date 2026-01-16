import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
    updatePresence,
    toggleAvailability,
    getMyStatus,
    heartbeat
} from '../controllers/presence.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get current user's status
router.get('/me', getMyStatus);

// Update online/offline status
router.post('/update', updatePresence);

// Toggle availability to chat (for teachers)
router.post('/availability', toggleAvailability);

// Heartbeat to keep online status alive
router.post('/heartbeat', heartbeat);

export default router;
