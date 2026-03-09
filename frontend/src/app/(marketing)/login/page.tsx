"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ForgotPasswordModal from "@/components/ForgotPasswordModal";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: Record<string, string> = {};
        if (!email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
        if (!password) newErrors.password = "Password is required";
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setLoading(true);

        try {
            const res = await fetch('http://localhost:4000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                setErrors({ general: data.message || 'Something went wrong' });
            } else {
                // Check if user is trying to login as parent on teacher/admin portal
                if (data.user?.role === 'PARENT') {
                    setErrors({ general: 'Parent accounts should use the Parent Portal login.' });
                    return;
                }

                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                router.push('/dashboard');
            }
        } catch {
            setErrors({ general: 'Network error. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden bg-ice/20">
            <main className="relative w-full max-w-[520px] z-10 my-20">
                <div className="bg-white border border-navy/5 shadow-2xl rounded-[2rem] p-8 sm:p-12 transition-all relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="text-center mb-10">
                            <div className="size-16 mx-auto bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-4xl">school</span>
                            </div>
                            <h1 className="text-3xl font-bold mb-3 text-navy tracking-tight">Welcome Back</h1>
                            <p className="text-slate-500 font-medium">Log in to continue to your dashboard.</p>
                        </div>

                        {/* Error Banner */}
                        {errors.general && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600 animate-in slide-in-from-top-2">
                                <span className="material-symbols-outlined">error</span>
                                <p className="text-sm font-bold">{errors.general}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 ml-1" htmlFor="email">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-slate-400">mail</span>
                                    </div>
                                    <input
                                        className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border ${errors.email ? 'border-red-500' : 'border-slate-200'} rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium focus:bg-white`}
                                        id="email"
                                        value={email}
                                        onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '', general: '' })); }}
                                        placeholder="user@school.edu"
                                        type="email"
                                    />
                                </div>
                                {errors.email && <p className="text-xs text-red-500 font-bold ml-1">{errors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="block text-sm font-bold text-slate-700" htmlFor="password">Password</label>
                                    <button
                                        type="button"
                                        onClick={() => setShowForgotPassword(true)}
                                        className="text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-slate-400">lock</span>
                                    </div>
                                    <input
                                        className={`w-full pl-12 pr-12 py-3.5 bg-slate-50 border ${errors.password ? 'border-red-500' : 'border-slate-200'} rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium focus:bg-white`}
                                        id="password"
                                        value={password}
                                        onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '', general: '' })); }}
                                        placeholder="Enter your password"
                                        type={showPassword ? "text" : "password"}
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                        <span className="material-symbols-outlined text-xl">{showPassword ? "visibility_off" : "visibility"}</span>
                                    </button>
                                </div>
                                {errors.password && <p className="text-xs text-red-500 font-bold ml-1">{errors.password}</p>}
                            </div>

                            <button
                                disabled={loading}
                                className={`mt-4 w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex justify-center items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                type="submit"
                            >
                                {loading ? 'Logging in...' : 'Log In'}
                                {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
                            </button>
                        </form>

                        <div className="relative my-8">
                            <div aria-hidden="true" className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-white px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-3 border border-slate-200 bg-white hover:bg-slate-50 transition-all group px-[15px] py-[15px] rounded-[6px]">
                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                <span className="text-sm font-bold text-slate-700">Google</span>
                            </button>
                            <button className="flex items-center justify-center gap-3 border border-slate-200 bg-white hover:bg-slate-50 transition-all group px-[15px] py-[15px] rounded-[6px]">
                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform text-slate-900" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.1 2.69-.99 3.85-.68 1.45.28 2.5.95 3.3 2.08-2.91 1.66-2.43 5.36.43 6.6-1.14 2.53-2.12 3.69-2.66 4.17zm-1.87-14.4c.53-2.31 2.39-4.01 4.54-4.14.3.46.99 3.55-2.67 5.25-1.25.59-3.26-.06-1.87-1.11z" />
                                </svg>
                                <span className="text-sm font-bold text-slate-700">Apple</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Register CTA */}
                <div className="mt-8 text-center relative z-10">
                    <p className="text-sm text-slate-500 font-medium">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="font-bold text-primary hover:underline">
                            Register here
                        </Link>
                    </p>
                </div>

                {/* Parent Portal Link */}
                <div className="mt-4 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-secondary/10 rounded-full">
                        <span className="material-symbols-outlined text-secondary">family_restroom</span>
                        <span className="text-sm text-secondary font-medium">
                            Are you a parent?
                            <Link href="/parent/login" className="font-bold hover:underline ml-1">
                                Parent Portal
                            </Link>
                        </span>
                    </div>
                </div>
            </main>

            <ForgotPasswordModal
                isOpen={showForgotPassword}
                onClose={() => setShowForgotPassword(false)}
            />
        </div>
    );
}
