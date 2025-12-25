import { Router } from 'express';
import { getSchoolSettings, updateSchoolSettings } from '../controllers/school.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/settings', getSchoolSettings);
router.patch('/settings', updateSchoolSettings);

export default router;
