import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, validateSetupToken, setupPassword, forgotPassword, registerSchool, verifyRegistrationPayment } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    setupPasswordSchema,
    validateSetupTokenSchema,
    registerSchoolSchema,
} from '../validators/schemas';

const router = Router();

// Strict rate limiter for auth endpoints — 5 requests per minute per IP
const authLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many attempts, please try again later.' },
});

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/register-school', authLimiter, validate(registerSchoolSchema), registerSchool);
router.get('/verify-registration-payment', verifyRegistrationPayment);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/validate-setup-token', validate(validateSetupTokenSchema), validateSetupToken);
router.post('/setup-password', authLimiter, validate(setupPasswordSchema), setupPassword);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);

export default router;
