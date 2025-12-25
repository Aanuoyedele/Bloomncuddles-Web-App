import { Router } from 'express';
import { register, login, validateSetupToken, setupPassword, forgotPassword, studentLogin } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/student-login', studentLogin);
router.post('/validate-setup-token', validateSetupToken);
router.post('/setup-password', setupPassword);
router.post('/forgot-password', forgotPassword);

export default router;


