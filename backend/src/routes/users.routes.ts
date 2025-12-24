import { Router } from 'express';
import { getUsers, deleteUser, updateUser } from '../controllers/users.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.get('/', authenticate, getUsers);
router.patch('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, deleteUser);

export default router;
