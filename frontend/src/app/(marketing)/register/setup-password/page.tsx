"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Alert from "@/components/Alert";

function SetupPasswordContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [loading, setLoading] = useState(true);
    const [validating, setValidating] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [tokenData, setTokenData] = useState<{ email: string; name: string } | null>(null);

    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setError("No token provided");
                setValidating(false);
                setLoading(false);
                return;
            }

            try {
                const data = await api.post("/auth/validate-setup-token", { token });
                setTokenData(data);
                setValidating(false);
            } catch (err: any) {
                setError(err.message || "Invalid or expired token");
                setValidating(false);
            } finally {
                setLoading(false);
            }
        };
        validateToken();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setSubmitting(true);
        try {
            await api.post("/auth/setup-password", { token, password });
            setSuccess(true);
            setTimeout(() => router.push("/login"), 2000);
        } catch (err: any) {
            setError(err.message || "Failed to set password");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-slate-600">Validating your link...</p>
                </div>
            </div>
        );
    }

    if (validating === false && error && !tokenData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full text-center">
                    <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Invalid Link</h1>
                    <p className="text-slate-600 mb-6">{error}</p>
                    <a href="/login" className="inline-block bg-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-primary/90 transition-colors">
                        Go to Login
                    </a>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full text-center">
                    <span className="material-symbols-outlined text-6xl text-green-500 mb-4">check_circle</span>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Password Set Successfully!</h1>
                    <p className="text-slate-600 mb-6">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Set Your Password</h1>
                    {tokenData && (
                        <p className="text-slate-600 mt-2">
                            Welcome, <strong>{tokenData.name}</strong>! Create a password to access your account.
                        </p>
                    )}
                </div>

                {error && (
                    <div className="mb-6">
                        <Alert type="error" message={error} onClose={() => setError(null)} />
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="At least 8 characters"
                            className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repeat your password"
                            className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className={`w-full h-12 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {submitting ? 'Setting Password...' : 'Set Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function SetupPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        }>
            <SetupPasswordContent />
        </Suspense>
    );
}
