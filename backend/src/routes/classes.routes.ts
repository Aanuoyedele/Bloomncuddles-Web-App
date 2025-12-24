import { Router } from 'express';
import { createClass, getClasses, updateClass, deleteClass } from '../controllers/classes.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// All routes require login
router.use(authenticate);

router.get('/', getClasses);
router.post('/', authorize(['ADMIN', 'TEACHER']), createClass);
router.patch('/:id', authorize(['ADMIN', 'TEACHER']), updateClass);
router.delete('/:id', authorize(['ADMIN', 'TEACHER']), deleteClass);

export default router;
