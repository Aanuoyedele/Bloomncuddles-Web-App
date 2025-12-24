import { Router } from 'express';
import { createStudent, getStudents, updateStudent, deleteStudent } from '../controllers/students.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getStudents);
router.post('/', authorize(['ADMIN', 'TEACHER']), createStudent);
router.patch('/:id', authorize(['ADMIN', 'TEACHER']), updateStudent);
router.delete('/:id', authorize(['ADMIN', 'TEACHER']), deleteStudent);

export default router;
