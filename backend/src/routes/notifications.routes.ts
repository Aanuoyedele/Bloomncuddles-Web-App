import { Router } from 'express';
import { getNotifications, globalSearch } from '../controllers/notifications.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getNotifications);
router.get('/search', globalSearch);

export default router;
