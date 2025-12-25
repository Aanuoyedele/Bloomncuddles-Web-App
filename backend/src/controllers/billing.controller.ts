import { Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Define plans with pricing in Naira (kobo)
const PLANS = {
    basic: {
        name: 'Basic',
        monthlyAmount: 1999900, // ₦19,999
        yearlyAmount: 19999000, // ₦199,990 (save 2 months)
        features: ['Up to 100 Students', 'Basic Analytics', 'Email Support']
    },
    premium: {
        name: 'Premium Schools',
        monthlyAmount: 4999900, // ₦49,999
        yearlyAmount: 49999000, // ₦499,990
        features: ['Unlimited Students & Teachers', 'Advanced Analytics & Reports', 'Priority Support 24/7']
    },
    enterprise: {
        name: 'Enterprise',
        monthlyAmount: 9999900, // ₦99,999
        yearlyAmount: 99999000, // ₦999,990
        features: ['Everything in Premium', 'Custom Integrations', 'Dedicated Account Manager', 'SLA Guarantee']
    }
};

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// Helper to make Paystack API calls
async function paystackRequest(endpoint: string, method: string = 'GET', data?: any) {
    const response = await fetch(`${PAYSTACK_BASE_URL}${endpoint}`, {
        method,
        headers: {
            'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
        },
        body: data ? JSON.stringify(data) : undefined
    });
    return response.json();
}

// Get current subscription and payment history
export const getBillingInfo = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user?.schoolId) {
            res.status(404).json({ message: 'No school found' });
            return;
        }

        // Get active subscription
        const subscription = await prisma.subscription.findFirst({
            where: { schoolId: user.schoolId },
            orderBy: { createdAt: 'desc' }
        });

        // Get payment history
        const payments = await prisma.payment.findMany({
            where: { schoolId: user.schoolId },
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        res.json({
            subscription: subscription ? {
                ...subscription,
                planDetails: PLANS[subscription.plan as keyof typeof PLANS] || null
            } : null,
            payments,
            plans: PLANS
        });

    } catch (error) {
        console.error('Get Billing Info error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Initialize a subscription payment with Paystack
export const initializePayment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { plan, interval } = req.body;

        if (!plan || !interval || !['monthly', 'yearly'].includes(interval)) {
            res.status(400).json({ message: 'Invalid plan or interval' });
            return;
        }

        const planDetails = PLANS[plan as keyof typeof PLANS];
        if (!planDetails) {
            res.status(400).json({ message: 'Invalid plan' });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { school: true }
        });

        if (!user?.school) {
            res.status(404).json({ message: 'No school found' });
            return;
        }

        const amount = interval === 'yearly' ? planDetails.yearlyAmount : planDetails.monthlyAmount;
        const reference = `BNC_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

        // Initialize transaction with Paystack
        const paystackResponse = await paystackRequest('/transaction/initialize', 'POST', {
            email: user.email,
            amount: amount, // Paystack expects amount in kobo
            reference: reference,
            callback_url: `${process.env.APP_URL || 'http://localhost:3000'}/dashboard/billing/callback`,
            metadata: {
                schoolId: user.schoolId,
                plan: plan,
                interval: interval,
                schoolName: user.school.name
            }
        });

        if (!paystackResponse.status) {
            res.status(400).json({ message: paystackResponse.message || 'Failed to initialize payment' });
            return;
        }

        // Create pending payment record
        await prisma.payment.create({
            data: {
                schoolId: user.schoolId!,
                amount: amount,
                paystackReference: reference,
                description: `${planDetails.name} - ${interval === 'yearly' ? 'Annual' : 'Monthly'} Subscription`,
                status: 'pending'
            }
        });

        res.json({
            authorizationUrl: paystackResponse.data.authorization_url,
            reference: reference
        });

    } catch (error) {
        console.error('Initialize Payment error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Verify payment after callback
export const verifyPayment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { reference } = req.query;

        if (!reference) {
            res.status(400).json({ message: 'Reference is required' });
            return;
        }

        // Get payment record
        const payment = await prisma.payment.findUnique({
            where: { paystackReference: reference as string }
        });

        if (!payment) {
            res.status(404).json({ message: 'Payment not found' });
            return;
        }

        // Verify with Paystack
        const paystackResponse = await paystackRequest(`/transaction/verify/${reference}`);

        if (!paystackResponse.status || paystackResponse.data.status !== 'success') {
            await prisma.payment.update({
                where: { id: payment.id },
                data: { status: 'failed' }
            });
            res.status(400).json({ message: 'Payment verification failed' });
            return;
        }

        const txData = paystackResponse.data;
        const metadata = txData.metadata || {};

        // Update payment record
        await prisma.payment.update({
            where: { id: payment.id },
            data: {
                status: 'success',
                paystackChannel: txData.channel,
                paidAt: new Date(txData.paid_at)
            }
        });

        // Calculate subscription period
        const now = new Date();
        const periodEnd = new Date(now);
        if (metadata.interval === 'yearly') {
            periodEnd.setFullYear(periodEnd.getFullYear() + 1);
        } else {
            periodEnd.setMonth(periodEnd.getMonth() + 1);
        }

        // Create or update subscription
        const existingSub = await prisma.subscription.findFirst({
            where: { schoolId: payment.schoolId }
        });

        if (existingSub) {
            await prisma.subscription.update({
                where: { id: existingSub.id },
                data: {
                    plan: metadata.plan || 'premium',
                    status: 'active',
                    interval: metadata.interval || 'monthly',
                    amount: payment.amount,
                    currentPeriodStart: now,
                    currentPeriodEnd: periodEnd,
                    nextPaymentDate: periodEnd,
                    paystackCustomerCode: txData.customer?.customer_code,
                    paystackAuthorizationCode: txData.authorization?.authorization_code
                }
            });
        } else {
            await prisma.subscription.create({
                data: {
                    schoolId: payment.schoolId,
                    plan: metadata.plan || 'premium',
                    status: 'active',
                    interval: metadata.interval || 'monthly',
                    amount: payment.amount,
                    currentPeriodStart: now,
                    currentPeriodEnd: periodEnd,
                    nextPaymentDate: periodEnd,
                    paystackCustomerCode: txData.customer?.customer_code,
                    paystackAuthorizationCode: txData.authorization?.authorization_code
                }
            });
        }

        res.json({ success: true, message: 'Payment verified and subscription activated' });

    } catch (error) {
        console.error('Verify Payment error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Webhook handler for Paystack events (charge.success, subscription.disable, etc.)
export const webhook = async (req: Request, res: Response): Promise<void> => {
    try {
        // Verify webhook signature
        const hash = crypto
            .createHmac('sha512', PAYSTACK_SECRET_KEY)
            .update(JSON.stringify(req.body))
            .digest('hex');

        if (hash !== req.headers['x-paystack-signature']) {
            res.status(401).json({ message: 'Invalid signature' });
            return;
        }

        const event = req.body;

        switch (event.event) {
            case 'charge.success':
                // Handle successful charge
                const reference = event.data.reference;
                const payment = await prisma.payment.findUnique({
                    where: { paystackReference: reference }
                });

                if (payment && payment.status === 'pending') {
                    await prisma.payment.update({
                        where: { id: payment.id },
                        data: {
                            status: 'success',
                            paystackChannel: event.data.channel,
                            paidAt: new Date(event.data.paid_at)
                        }
                    });
                }
                break;

            case 'subscription.disable':
                // Handle subscription cancellation
                const customerCode = event.data.customer?.customer_code;
                if (customerCode) {
                    await prisma.subscription.updateMany({
                        where: { paystackCustomerCode: customerCode },
                        data: { status: 'cancelled' }
                    });
                }
                break;

            default:
                console.log('Unhandled Paystack event:', event.event);
        }

        res.status(200).json({ received: true });

    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Cancel subscription
export const cancelSubscription = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user?.schoolId) {
            res.status(404).json({ message: 'No school found' });
            return;
        }

        const subscription = await prisma.subscription.findFirst({
            where: { schoolId: user.schoolId, status: 'active' }
        });

        if (!subscription) {
            res.status(404).json({ message: 'No active subscription found' });
            return;
        }

        // Update subscription status
        await prisma.subscription.update({
            where: { id: subscription.id },
            data: { status: 'cancelled' }
        });

        res.json({ success: true, message: 'Subscription cancelled' });

    } catch (error) {
        console.error('Cancel Subscription error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
