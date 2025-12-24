import { Router } from 'express';
import { bulkImportTeachers, bulkImportStudents, bulkImportParents } from '../controllers/import.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.use(authorize(['ADMIN'])); // Only admins can bulk import

router.post('/teachers', bulkImportTeachers);
router.post('/students', bulkImportStudents);
router.post('/parents', bulkImportParents);

export default router;
