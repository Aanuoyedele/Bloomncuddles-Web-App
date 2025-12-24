import { Router } from 'express';
import { createAssignment, getAssignments, updateAssignment, deleteAssignment } from '../controllers/assignments.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getAssignments);
router.post('/', authorize(['ADMIN', 'TEACHER']), createAssignment);
router.patch('/:id', authorize(['ADMIN', 'TEACHER']), updateAssignment);
router.delete('/:id', authorize(['ADMIN', 'TEACHER']), deleteAssignment);

export default router;
