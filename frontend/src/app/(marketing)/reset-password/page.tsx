"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [tokenError, setTokenError] = useState("");
    const [userName, setUserName] = useState("");

    // Validate token on mount
    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setTokenError("Invalid reset link. Please request a new one.");
                setValidating(false);
                return;
            }

            try {
                const res = await fetch("http://localhost:4000/api/auth/validate-setup-token", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token }),
                });

                const data = await res.json();

                if (!res.ok) {
                    setTokenError(data.message || "Invalid or expired reset link");
                } else {
                    setUserName(data.name);
                }
            } catch {
                setTokenError("Something went wrong. Please try again.");
            } finally {
                setValidating(false);
            }
        };

        validateToken();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!password) {
            setError("Please enter a new password");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("http://localhost:4000/api/auth/setup-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Something went wrong");
            } else {
                setSuccess(true);
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    router.push("/login");
                }, 3000);
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Loading state
    if (validating) {
        return (
            <div className="text-center py-12">
                <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
                <p className="mt-4 text-slate-500 font-medium">Validating your reset link...</p>
            </div>
        );
    }

    // Invalid token state
    if (tokenError) {
        return (
            <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-red-600 text-3xl">error</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Invalid Reset Link</h2>
                <p className="text-slate-500 mb-6">{tokenError}</p>
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-xl transition-all"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                    Back to Login
                </Link>
            </div>
        );
    }

    // Success state
    if (success) {
        return (
            <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-green-600 text-3xl">check_circle</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Password Reset Successful!</h2>
                <p className="text-slate-500 mb-6">
                    Your password has been updated. Redirecting you to login...
                </p>
                <div className="flex items-center justify-center gap-2 text-primary">
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    <span className="font-medium">Redirecting...</span>
                </div>
            </div>
        );
    }

    // Form state
    return (
        <>
            <div className="text-center mb-6">
                <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-2xl">lock_reset</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Reset Your Password</h2>
                {userName && (
                    <p className="text-slate-500 text-sm">
                        Hi <strong className="text-slate-700">{userName}</strong>, create a new password below.
                    </p>
                )}
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-sm">
                    <span className="material-symbols-outlined text-lg">error</span>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700 ml-1" htmlFor="password">
                        New Password
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">lock</span>
                        </div>
                        <input
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium focus:bg-white"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Minimum 8 characters"
                            type="password"
                            autoFocus
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700 ml-1" htmlFor="confirmPassword">
                        Confirm Password
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">lock_check</span>
                        </div>
                        <input
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium focus:bg-white"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter your password"
                            type="password"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl transition-all flex justify-center items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {loading ? (
                        <>
                            <span className="material-symbols-outlined animate-spin">progress_activity</span>
                            Updating...
                        </>
                    ) : (
                        <>
                            Reset Password
                            <span className="material-symbols-outlined">check</span>
                        </>
                    )}
                </button>
            </form>
        </>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden bg-white">
            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] opacity-70 pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] opacity-60 pointer-events-none"></div>
            <div className="absolute top-[40%] right-[-10%] w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] opacity-50 pointer-events-none"></div>

            {/* Main Content Card */}
            <main className="relative w-full max-w-[480px] z-10">
                <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-2xl rounded-[2rem] p-6 sm:p-8 transition-all relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/40 to-transparent pointer-events-none"></div>
                    <div className="relative z-10">
                        <Suspense fallback={
                            <div className="text-center py-12">
                                <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
                            </div>
                        }>
                            <ResetPasswordForm />
                        </Suspense>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <Link href="/login" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">
                        ← Back to Login
                    </Link>
                </div>
            </main>
        </div>
    );
}
