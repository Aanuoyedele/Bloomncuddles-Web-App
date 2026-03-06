import { Router } from 'express';
import { getSchoolSettings, updateSchoolSettings } from '../controllers/school.controller';
import { authenticate, requirePlan } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/settings', getSchoolSettings);
router.patch('/settings', requirePlan(['enterprise']), updateSchoolSettings);

export default router;
