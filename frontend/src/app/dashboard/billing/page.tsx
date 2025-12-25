"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useSearchParams } from "next/navigation";

interface Subscription {
    id: string;
    plan: string;
    status: string;
    interval: string;
    amount: number;
    currency: string;
    currentPeriodEnd: string | null;
    nextPaymentDate: string | null;
    planDetails: {
        name: string;
        features: string[];
    } | null;
}

interface Payment {
    id: string;
    amount: number;
    currency: string;
    status: string;
    description: string | null;
    paidAt: string | null;
    createdAt: string;
    paystackReference: string;
}

interface Plans {
    basic: { name: string; monthlyAmount: number; yearlyAmount: number; features: string[] };
    premium: { name: string; monthlyAmount: number; yearlyAmount: number; features: string[] };
    enterprise: { name: string; monthlyAmount: number; yearlyAmount: number; features: string[] };
}

export default function BillingPage() {
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [plans, setPlans] = useState<Plans | null>(null);
    const [loading, setLoading] = useState(true);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const searchParams = useSearchParams();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0
        }).format(amount / 100); // Convert kobo to Naira
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const fetchBillingInfo = async () => {
        try {
            setLoading(true);
            const data = await api.get('/billing');
            setSubscription(data.subscription);
            setPayments(data.payments || []);
            setPlans(data.plans);
        } catch (err: any) {
            console.error('Failed to load billing info:', err);
        } finally {
            setLoading(false);
        }
    };

    // Check for payment verification on callback
    useEffect(() => {
        const reference = searchParams.get('reference');
        if (reference) {
            verifyPayment(reference);
        }
    }, [searchParams]);

    useEffect(() => {
        fetchBillingInfo();
    }, []);

    const verifyPayment = async (reference: string) => {
        try {
            setProcessingPayment(true);
            const result = await api.get(`/billing/verify?reference=${reference}`);
            setMessage({ type: 'success', text: 'Payment successful! Your subscription is now active.' });
            fetchBillingInfo();
            // Remove reference from URL
            window.history.replaceState({}, '', '/dashboard/billing');
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Payment verification failed' });
        } finally {
            setProcessingPayment(false);
        }
    };

    const handleSubscribe = async (plan: string) => {
        try {
            setProcessingPayment(true);
            const result = await api.post('/billing/initialize', {
                plan,
                interval: billingInterval
            });

            if (result.authorizationUrl) {
                // Redirect to Paystack checkout
                window.location.href = result.authorizationUrl;
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to initialize payment' });
            setProcessingPayment(false);
        }
    };

    const handleCancel = async () => {
        if (!confirm('Are you sure you want to cancel your subscription?')) return;

        try {
            await api.post('/billing/cancel', {});
            setMessage({ type: 'success', text: 'Subscription cancelled' });
            fetchBillingInfo();
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to cancel subscription' });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    const isActive = subscription?.status === 'active';
    const currentPlan = subscription?.planDetails;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-display">Billing & Subscription</h1>
                <p className="text-slate-500 text-base mt-2">Manage your subscription plan and payment history.</p>
            </div>

            {/* Messages */}
            {message && (
                <div className={`p-4 rounded-xl ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined">{message.type === 'success' ? 'check_circle' : 'error'}</span>
                        {message.text}
                        <button onClick={() => setMessage(null)} className="ml-auto">
                            <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                    </div>
                </div>
            )}

            {processingPayment && (
                <div className="p-4 rounded-xl bg-blue-50 text-blue-700">
                    <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                        Processing payment...
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Current Plan */}
                <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-slate-300 text-sm font-bold uppercase tracking-wider">Current Plan</p>
                                <h2 className="text-3xl font-bold mt-1">{currentPlan?.name || 'No Active Plan'}</h2>
                            </div>
                            <span className={`backdrop-blur-sm border px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${isActive ? 'bg-green-500/20 border-green-400/30 text-green-400' : 'bg-white/10 border-white/20 text-white'
                                }`}>
                                {subscription?.status || 'Inactive'}
                            </span>
                        </div>

                        {currentPlan ? (
                            <>
                                <div className="space-y-3 mb-8">
                                    {currentPlan.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-green-400">check_circle</span>
                                            <span className="font-medium text-slate-100">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-2xl font-bold">
                                            {formatCurrency(subscription?.amount || 0)}
                                            <span className="text-sm text-slate-400 font-medium">/{subscription?.interval}</span>
                                        </p>
                                        {subscription?.nextPaymentDate && (
                                            <p className="text-sm text-slate-400 mt-1">Renews on {formatDate(subscription.nextPaymentDate)}</p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setShowPlanModal(true)}
                                            className="bg-white text-slate-900 px-6 py-2.5 rounded-xl font-bold hover:bg-slate-100 transition-colors"
                                        >
                                            Change Plan
                                        </button>
                                        {isActive && (
                                            <button
                                                onClick={handleCancel}
                                                className="border border-white/20 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-white/10 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="py-8 text-center">
                                <p className="text-slate-400 mb-4">You don't have an active subscription</p>
                                <button
                                    onClick={() => setShowPlanModal(true)}
                                    className="bg-white text-slate-900 px-6 py-2.5 rounded-xl font-bold hover:bg-slate-100 transition-colors"
                                >
                                    Choose a Plan
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Billing Overview</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-slate-500">Billing Cycle</p>
                                <p className="font-bold text-slate-900 capitalize">{subscription?.interval || 'Not set'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Next Payment</p>
                                <p className="font-bold text-slate-900">{formatDate(subscription?.nextPaymentDate || null)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Total Payments</p>
                                <p className="font-bold text-slate-900">{payments.filter(p => p.status === 'success').length}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Invoice History */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900">Payment History</h3>
                </div>
                {payments.length > 0 ? (
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Reference</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {payments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900 font-mono text-sm">
                                        {payment.paystackReference.slice(0, 15)}...
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {formatDate(payment.paidAt || payment.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {payment.description || 'Subscription Payment'}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-700">
                                        {formatCurrency(payment.amount)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${payment.status === 'success'
                                                ? 'bg-green-100 text-green-700'
                                                : payment.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="py-12 text-center text-slate-400">
                        <span className="material-symbols-outlined text-4xl">receipt_long</span>
                        <p className="mt-2 text-sm">No payment history yet</p>
                    </div>
                )}
            </div>

            {/* Plan Selection Modal */}
            {showPlanModal && plans && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white">
                            <h3 className="text-xl font-bold text-slate-900">Choose Your Plan</h3>
                            <button onClick={() => setShowPlanModal(false)} className="text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Billing Interval Toggle */}
                        <div className="p-6 border-b border-slate-100">
                            <div className="flex items-center justify-center gap-4">
                                <span className={billingInterval === 'monthly' ? 'font-bold text-slate-900' : 'text-slate-500'}>Monthly</span>
                                <button
                                    onClick={() => setBillingInterval(billingInterval === 'monthly' ? 'yearly' : 'monthly')}
                                    className={`w-14 h-7 rounded-full p-1 transition-colors ${billingInterval === 'yearly' ? 'bg-primary' : 'bg-slate-200'}`}
                                >
                                    <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${billingInterval === 'yearly' ? 'translate-x-7' : ''}`}></div>
                                </button>
                                <span className={billingInterval === 'yearly' ? 'font-bold text-slate-900' : 'text-slate-500'}>
                                    Yearly <span className="text-green-600 text-sm">(Save 17%)</span>
                                </span>
                            </div>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Object.entries(plans).map(([key, plan]) => {
                                const amount = billingInterval === 'yearly' ? plan.yearlyAmount : plan.monthlyAmount;
                                const isCurrentPlan = subscription?.plan === key && isActive;

                                return (
                                    <div key={key} className={`border rounded-2xl p-6 ${isCurrentPlan ? 'border-primary bg-primary/5' : 'border-slate-200'}`}>
                                        <h4 className="text-lg font-bold text-slate-900">{plan.name}</h4>
                                        <p className="text-3xl font-bold text-slate-900 mt-4">
                                            {formatCurrency(amount)}
                                            <span className="text-sm text-slate-500 font-normal">/{billingInterval === 'yearly' ? 'year' : 'month'}</span>
                                        </p>

                                        <ul className="mt-6 space-y-3">
                                            {plan.features.map((feature, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                                    <span className="material-symbols-outlined text-green-500 text-[18px]">check</span>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>

                                        <button
                                            onClick={() => handleSubscribe(key)}
                                            disabled={isCurrentPlan || processingPayment}
                                            className={`w-full mt-6 py-2.5 rounded-xl font-bold transition-colors ${isCurrentPlan
                                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                    : 'bg-primary text-white hover:bg-primary/90'
                                                }`}
                                        >
                                            {isCurrentPlan ? 'Current Plan' : processingPayment ? 'Processing...' : 'Subscribe'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

