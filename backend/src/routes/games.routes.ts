import { Router } from 'express';
import { getGames, getGame, assignGame, getAssignedGamesCount, seedGames } from '../controllers/games.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getGames);
router.get('/assigned-count', getAssignedGamesCount);
router.get('/:id', getGame);
router.post('/assign', assignGame);
router.post('/seed', seedGames);

export default router;
