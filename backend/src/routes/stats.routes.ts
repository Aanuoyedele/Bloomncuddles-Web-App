import { Router } from 'express';
import { getStats, getEngagement, getAverageScores, getRecentAssignments, getNeedsAttention, getStudentStats } from '../controllers/stats.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getStats);
router.get('/engagement', getEngagement);
router.get('/scores', getAverageScores);
router.get('/assignments', getRecentAssignments);
router.get('/attention', getNeedsAttention);
router.get('/student-stats', getStudentStats);

export default router;


