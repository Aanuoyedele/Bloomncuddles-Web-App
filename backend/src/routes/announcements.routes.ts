import { Router } from 'express';
import { getAnnouncements, createAnnouncement } from '../controllers/announcements.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Protect all announcement routes
router.use(authenticate);

// Get announcements
router.get('/', getAnnouncements);

// Create a new announcement
router.post('/', createAnnouncement);

export default router;
