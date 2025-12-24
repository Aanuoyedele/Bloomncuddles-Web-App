import { Router } from 'express';
import { register, login, validateSetupToken, setupPassword } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/validate-setup-token', validateSetupToken);
router.post('/setup-password', setupPassword);

export default router;
