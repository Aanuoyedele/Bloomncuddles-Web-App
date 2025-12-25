import { Router } from 'express';
import { createAssignment, getAssignments, updateAssignment, deleteAssignment, getSubmissions, gradeSubmission } from '../controllers/assignments.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getAssignments);
router.post('/', authorize(['ADMIN', 'TEACHER']), createAssignment);
router.patch('/:id', authorize(['ADMIN', 'TEACHER']), updateAssignment);
router.delete('/:id', authorize(['ADMIN', 'TEACHER']), deleteAssignment);

// Submissions
router.get('/:id/submissions', authorize(['ADMIN', 'TEACHER']), getSubmissions);
router.patch('/submissions/:id/grade', authorize(['ADMIN', 'TEACHER']), gradeSubmission);

export default router;

