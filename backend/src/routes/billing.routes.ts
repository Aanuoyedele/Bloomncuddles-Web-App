import { Router } from 'express';
import { getBillingInfo, initializePayment, verifyPayment, webhook, cancelSubscription } from '../controllers/billing.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Webhook doesn't need authentication (called by Paystack)
router.post('/webhook', webhook);

// Protected routes
router.get('/', authenticate, getBillingInfo);
router.post('/initialize', authenticate, initializePayment);
router.get('/verify', authenticate, verifyPayment);
router.post('/cancel', authenticate, cancelSubscription);

export default router;
