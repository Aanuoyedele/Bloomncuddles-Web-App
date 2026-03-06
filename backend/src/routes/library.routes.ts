import { Router } from 'express';
import { getBooks, createBook, getBook, assignBook, deleteBook } from '../controllers/library.controller';
import { authenticate, requirePlan } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.use(requirePlan(['premium', 'enterprise']));

router.get('/', getBooks);
router.post('/', createBook);
router.get('/:id', getBook);
router.post('/assign', assignBook);
router.delete('/:id', deleteBook);

export default router;
