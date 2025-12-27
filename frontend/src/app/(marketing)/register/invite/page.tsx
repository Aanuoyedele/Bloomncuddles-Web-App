"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface InviteData {
    valid: boolean;
    email: string;
    role: string;
    schoolName: string;
    schoolId: string;
}

export default function InviteRegistrationPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [inviteData, setInviteData] = useState<InviteData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: "", password: "", confirmPassword: "" });
    const [submitting, setSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        async function validateToken() {
            if (!token) {
                setError("No invite token provided");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`http://localhost:4000/api/invites/validate/${token}`);
                const data = await res.json();

                if (!res.ok) {
                    setError(data.message || "Invalid invite");
                } else {
                    setInviteData(data);
                }
            } catch (err) {
                setError("Failed to validate invite. Please try again.");
            } finally {
                setLoading(false);
            }
        }

        validateToken();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errors: Record<string, string> = {};

        if (!formData.name) errors.name = "Name is required";
        if (!formData.password) errors.password = "Password is required";
        if (formData.password.length < 6) errors.password = "Password must be at least 6 characters";
        if (formData.password !== formData.confirmPassword) errors.confirmPassword = "Passwords do not match";

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch("http://localhost:4000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: inviteData?.email,
                    password: formData.password,
                    name: formData.name,
                    registrationType: "invite",
                    inviteToken: token
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setFormErrors({ general: data.message || "Registration failed" });
            } else {
                localStorage.setItem("token", data.token);
                router.push("/dashboard");
            }
        } catch (err) {
            setFormErrors({ general: "Network error. Please try again." });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-600 font-medium">Validating invite...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-3xl text-red-500">error</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Invalid Invite</h1>
                    <p className="text-slate-600 mb-6">{error}</p>
                    <Link
                        href="/login"
                        className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-3xl text-primary">mail</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">You're Invited!</h1>
                    <p className="text-slate-600">
                        Join <strong className="text-primary">{inviteData?.schoolName}</strong> as a{" "}
                        <strong>{inviteData?.role}</strong>
                    </p>
                </div>

                {formErrors.general && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600">
                        <span className="material-symbols-outlined">error</span>
                        <p className="text-sm font-bold">{formErrors.general}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={inviteData?.email || ""}
                            disabled
                            className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Your Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="John Doe"
                            className={`w-full px-4 py-3 bg-slate-50 border ${formErrors.name ? 'border-red-500' : 'border-slate-200'} rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary`}
                        />
                        {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Password *</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            placeholder="••••••••"
                            className={`w-full px-4 py-3 bg-slate-50 border ${formErrors.password ? 'border-red-500' : 'border-slate-200'} rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary`}
                        />
                        {formErrors.password && <p className="text-xs text-red-500 mt-1">{formErrors.password}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Confirm Password *</label>
                        <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            placeholder="••••••••"
                            className={`w-full px-4 py-3 bg-slate-50 border ${formErrors.confirmPassword ? 'border-red-500' : 'border-slate-200'} rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary`}
                        />
                        {formErrors.confirmPassword && <p className="text-xs text-red-500 mt-1">{formErrors.confirmPassword}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className={`w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {submitting ? 'Creating Account...' : 'Join School'}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-500 mt-6">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary font-bold hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
