"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TeacherRegistration() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        if (errors[id]) setErrors(prev => ({ ...prev, [id]: "" }));
    };

    const getPasswordStrength = (pw: string) => {
        if (!pw) return { label: "", color: "", width: "0%" };
        let score = 0;
        if (pw.length >= 8) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        if (pw.length >= 12) score++;
        if (score <= 1) return { label: "Weak", color: "bg-red-500", width: "20%" };
        if (score <= 2) return { label: "Fair", color: "bg-orange-400", width: "40%" };
        if (score <= 3) return { label: "Good", color: "bg-yellow-400", width: "60%" };
        if (score <= 4) return { label: "Strong", color: "bg-green-500", width: "80%" };
        return { label: "Excellent", color: "bg-emerald-500", width: "100%" };
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.fullname.trim()) newErrors.fullname = "Full name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Enter a valid email";
        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 8) newErrors.password = "Minimum 8 characters";
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setErrors({});

        try {
            const res = await fetch("http://localhost:4000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.fullname,
                    email: formData.email,
                    password: formData.password,
                    registrationType: "teacher",
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setErrors({ general: data.message || "Registration failed" });
                setLoading(false);
                return;
            }

            // Store auth
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            setStep(1);
            setLoading(false);

            // Redirect to dashboard after celebration
            setTimeout(() => router.push("/dashboard"), 3000);
        } catch {
            setErrors({ general: "Network error. Please try again." });
            setLoading(false);
        }
    };

    const pwStrength = getPasswordStrength(formData.password);

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden bg-ice/20">
            <main className="relative w-full max-w-[520px] z-10 my-20">
                {step === 0 ? (
                    <>
                        <div className="text-center mb-6">
                            <Link href="/register" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary transition-colors mb-4">
                                <span className="material-symbols-outlined text-base">arrow_back</span>
                                Back to registration options
                            </Link>
                            <div className="size-16 mx-auto bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-4xl">person</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-navy tracking-tight mb-2">
                                Teacher Registration
                            </h1>
                            <p className="text-slate-500 font-medium text-sm">
                                Set up your personal classroom. It&apos;s quick and free.
                            </p>
                        </div>

                        <div className="bg-white border border-navy/5 shadow-2xl rounded-2xl p-8 sm:p-10">
                            {errors.general && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600">
                                    <span className="material-symbols-outlined">error</span>
                                    <p className="text-sm font-bold">{errors.general}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-700" htmlFor="fullname">Full Name *</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-slate-400">person</span>
                                        </div>
                                        <input
                                            className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border ${errors.fullname ? "border-red-500" : "border-slate-200"} rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-medium`}
                                            id="fullname" value={formData.fullname} onChange={handleChange}
                                            placeholder="e.g., Jane Adeyemi" type="text"
                                        />
                                    </div>
                                    {errors.fullname && <p className="text-xs text-red-500 font-bold">{errors.fullname}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-700" htmlFor="email">Email Address *</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-slate-400">mail</span>
                                        </div>
                                        <input
                                            className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border ${errors.email ? "border-red-500" : "border-slate-200"} rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-medium`}
                                            id="email" value={formData.email} onChange={handleChange}
                                            placeholder="you@example.com" type="email"
                                        />
                                    </div>
                                    {errors.email && <p className="text-xs text-red-500 font-bold">{errors.email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-700" htmlFor="password">Password *</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-slate-400">lock</span>
                                        </div>
                                        <input
                                            className={`w-full pl-12 pr-12 py-3.5 bg-slate-50 border ${errors.password ? "border-red-500" : "border-slate-200"} rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-medium`}
                                            id="password" value={formData.password} onChange={handleChange}
                                            placeholder="Minimum 8 characters" type={showPassword ? "text" : "password"}
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                            <span className="material-symbols-outlined text-xl">{showPassword ? "visibility_off" : "visibility"}</span>
                                        </button>
                                    </div>
                                    {formData.password && (
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div className={`h-full ${pwStrength.color} rounded-full transition-all duration-500`} style={{ width: pwStrength.width }}></div>
                                            </div>
                                            <span className="text-xs font-bold text-slate-500">{pwStrength.label}</span>
                                        </div>
                                    )}
                                    {errors.password && <p className="text-xs text-red-500 font-bold">{errors.password}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-700" htmlFor="confirmPassword">Confirm Password *</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-slate-400">lock</span>
                                        </div>
                                        <input
                                            className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border ${errors.confirmPassword ? "border-red-500" : "border-slate-200"} rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-medium`}
                                            id="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                                            placeholder="Re-enter password" type="password"
                                        />
                                    </div>
                                    {errors.confirmPassword && <p className="text-xs text-red-500 font-bold">{errors.confirmPassword}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm hover:translate-y-[-1px] shadow-lg shadow-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Creating Account...
                                        </>
                                    ) : (
                                        "Create My Classroom"
                                    )}
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="bg-white border border-navy/5 shadow-2xl rounded-2xl p-10 text-center animate-in fade-in zoom-in-95 duration-500">
                        <div className="size-20 mx-auto bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-5xl">celebration</span>
                        </div>
                        <h2 className="text-2xl font-bold text-navy mb-3">You&apos;re All Set! 🎉</h2>
                        <p className="text-slate-500 mb-6">Welcome to Bloomncuddles, {formData.fullname.split(" ")[0]}!</p>
                        <p className="text-sm text-slate-400">Redirecting to your dashboard...</p>
                        <div className="mt-4 flex justify-center">
                            <div className="flex gap-1">
                                <div className="size-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                <div className="size-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                                <div className="size-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                            </div>
                        </div>
                    </div>
                )}

                <p className="text-center text-sm text-slate-500 mt-8">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary font-bold hover:underline">
                        Log in here
                    </Link>
                </p>
            </main>
        </div>
    );
}
