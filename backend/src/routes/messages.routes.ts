import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getContacts, getMessages, sendMessage } from '../controllers/message.controller';

const router = Router();

// Validate user session for all message routes
router.use(authenticate);

// Get list of contacts (teachers/admins) for the current user
router.get('/contacts', getContacts);

// Get conversation with a specific contact
router.get('/:contactId', getMessages);

// Send a new message
router.post('/', sendMessage);

export default router;
