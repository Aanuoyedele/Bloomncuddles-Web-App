import { Router } from 'express';
import { getReportData } from '../controllers/reports.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getReportData);

export default router;
