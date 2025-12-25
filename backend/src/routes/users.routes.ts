import { Router } from 'express';
import { getUsers, deleteUser, updateUser, toggleUserStatus } from '../controllers/users.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.get('/', authenticate, getUsers);
router.patch('/:id', authenticate, updateUser);
router.patch('/:id/toggle-status', authenticate, toggleUserStatus);
router.delete('/:id', authenticate, deleteUser);

export default router;

