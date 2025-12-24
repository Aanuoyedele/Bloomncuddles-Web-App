import { Router } from 'express';
import { createInvite, validateInvite, getInvites, revokeInvite } from '../controllers/invites.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Protected routes (require authentication)
router.post('/', authenticate, createInvite);
router.get('/', authenticate, getInvites);
router.delete('/:id', authenticate, revokeInvite);

// Public route (for registration page)
router.get('/validate/:token', validateInvite);

export default router;
