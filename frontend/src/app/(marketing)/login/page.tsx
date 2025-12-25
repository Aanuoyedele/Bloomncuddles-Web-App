"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ForgotPasswordModal from "@/components/ForgotPasswordModal";

export default function LoginPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const [formData, setFormData] = useState({
        fullname: '',
        schoolName: '',
        address: '',
        registrationType: 'teacher', // 'teacher' | 'school_admin'
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [isStudentLogin, setIsStudentLogin] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        // Clear error when user types
        if (errors[id] || errors.general) {
            setErrors(prev => ({ ...prev, [id]: '', general: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";

        if (!formData.password) newErrors.password = "Password is required";

        if (activeTab === 'register') {
            if (!formData.fullname) newErrors.fullname = "Full Name is required";
            // School name required only for school_admin
            if (formData.registrationType === 'school_admin' && !formData.schoolName) {
                newErrors.schoolName = "School Name is required";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);

        // Determine endpoint based on login type
        let endpoint: string;
        if (activeTab === 'login') {
            endpoint = isStudentLogin
                ? 'http://localhost:4000/api/auth/student-login'
                : 'http://localhost:4000/api/auth/login';
        } else {
            endpoint = 'http://localhost:4000/api/auth/register';
        }

        // Prepare payload
        const payload = activeTab === 'login'
            ? { email: formData.email, password: formData.password }
            : {
                email: formData.email,
                password: formData.password,
                name: formData.fullname,
                registrationType: formData.registrationType,
                schoolName: formData.registrationType === 'school_admin' ? formData.schoolName : undefined,
                address: formData.address || undefined
            };

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                setErrors(prev => ({ ...prev, general: data.message || 'Something went wrong' }));
            } else {
                // Success
                localStorage.setItem('token', data.token);
                // Redirect
                router.push('/dashboard');
            }
        } catch (error) {
            console.error(error);
            setErrors(prev => ({ ...prev, general: 'Network error. Please try again.' }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden bg-white">
            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] opacity-70 pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] opacity-60 pointer-events-none"></div>
            <div className="absolute top-[40%] right-[-10%] w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] opacity-50 pointer-events-none"></div>

            {/* Main Content Card */}
            <main className="relative w-full max-w-[520px] z-10 my-20">
                <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-2xl rounded-[2rem] p-6 sm:p-10 transition-all relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/40 to-transparent pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold mb-2 tracking-tight text-slate-900 font-display">
                                {activeTab === 'login' ? 'Welcome Back' : 'Partner with Us'}
                            </h1>
                            <p className="text-slate-500 font-medium">
                                {activeTab === 'login' ? 'Empowering the next generation of learners.' : 'Create an account for your school or classroom.'}
                            </p>
                        </div>

                        {/* Error Banner */}
                        {errors.general && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600 animate-in slide-in-from-top-2">
                                <span className="material-symbols-outlined">error</span>
                                <p className="text-sm font-bold">{errors.general}</p>
                            </div>
                        )}

                        {/* Tab Switcher */}
                        <div className="mb-6">
                            <div className="bg-slate-100/80 p-1.5 rounded-2xl flex relative">
                                <button
                                    onClick={() => { setActiveTab('login'); setIsStudentLogin(false); }}
                                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all text-center justify-center items-center gap-2 flex ${activeTab === 'login' ? 'bg-white text-primary shadow-sm border border-slate-100' : 'text-slate-500 hover:text-primary'}`}
                                >
                                    <span className="material-symbols-outlined text-[20px]">login</span>
                                    Login
                                </button>
                                <button
                                    onClick={() => { setActiveTab('register'); setIsStudentLogin(false); }}
                                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all text-center justify-center items-center gap-2 flex ${activeTab === 'register' ? 'bg-white text-primary shadow-sm border border-slate-100' : 'text-slate-500 hover:text-primary'}`}
                                >
                                    <span className="material-symbols-outlined text-[20px]">person_add</span>
                                    Register
                                </button>
                            </div>
                        </div>

                        {/* Student Login Toggle - only shown on login tab */}
                        {activeTab === 'login' && (
                            <div className="mb-6 flex items-center justify-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsStudentLogin(false)}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${!isStudentLogin ? 'bg-primary text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                >
                                    <span className="material-symbols-outlined text-[18px] align-middle mr-1">school</span>
                                    Staff
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsStudentLogin(true)}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${isStudentLogin ? 'bg-secondary text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                >
                                    <span className="material-symbols-outlined text-[18px] align-middle mr-1">face</span>
                                    Student
                                </button>
                            </div>
                        )}

                        {/* Form Container */}
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                            {/* Register Fields */}
                            {activeTab === 'register' && (
                                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-slate-700 ml-1" htmlFor="fullname">Full Name</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">badge</span>
                                            </div>
                                            <input
                                                className={`w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border ${errors.fullname ? 'border-red-500 shake' : 'border-slate-200'} rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium focus:bg-white`}
                                                id="fullname"
                                                value={formData.fullname}
                                                onChange={handleInputChange}
                                                placeholder="John Doe"
                                                type="text"
                                            />
                                        </div>
                                        {errors.fullname && <p className="text-xs text-red-500 font-bold ml-1">{errors.fullname}</p>}
                                    </div>

                                    {/* School Name - Only for School Admin */}
                                    {formData.registrationType === 'school_admin' && (
                                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                            <label className="block text-sm font-bold text-slate-700 ml-1" htmlFor="schoolName">School Name *</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">school</span>
                                                </div>
                                                <input
                                                    className={`w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border ${errors.schoolName ? 'border-red-500' : 'border-slate-200'} rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium focus:bg-white`}
                                                    id="schoolName"
                                                    value={formData.schoolName}
                                                    onChange={handleInputChange}
                                                    placeholder="Bloom High School"
                                                    type="text"
                                                />
                                            </div>
                                            {errors.schoolName && <p className="text-xs text-red-500 font-bold ml-1">{errors.schoolName}</p>}
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-slate-700 ml-1" htmlFor="address">Address</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">location_on</span>
                                            </div>
                                            <input
                                                className={`w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border ${errors.address ? 'border-red-500' : 'border-slate-200'} rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium focus:bg-white`}
                                                id="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                // placeholder="123 Education Lane, City"
                                                placeholder="Optional"
                                                type="text"
                                            />
                                        </div>
                                        {errors.address && <p className="text-xs text-red-500 font-bold ml-1">{errors.address}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-slate-700 ml-1" htmlFor="registrationType">I am registering as...</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">assignment_ind</span>
                                            </div>
                                            <select
                                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium focus:bg-white appearance-none"
                                                id="registrationType"
                                                value={formData.registrationType}
                                                onChange={handleInputChange}
                                            >
                                                <option value="teacher">Independent Teacher</option>
                                                <option value="school_admin">School Administrator</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                                <span className="material-symbols-outlined text-slate-400">expand_more</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-500 ml-1">
                                            {formData.registrationType === 'school_admin'
                                                ? '🏫 Create a school and invite teachers to join.'
                                                : '👩‍🏫 Start with your own personal classroom.'}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Common Fields */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 ml-1" htmlFor="email">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">mail</span>
                                    </div>
                                    <input
                                        className={`w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border ${errors.email ? 'border-red-500' : 'border-slate-200'} rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium focus:bg-white`}
                                        id="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="user@school.edu"
                                        type="email"
                                    />
                                </div>
                                {errors.email && <p className="text-xs text-red-500 font-bold ml-1">{errors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="block text-sm font-bold text-slate-700" htmlFor="password">Password</label>
                                    {activeTab === 'login' && (
                                        <button
                                            type="button"
                                            onClick={() => setShowForgotPassword(true)}
                                            className="text-xs font-bold text-secondary hover:text-secondary/80 hover:underline"
                                        >
                                            Forgot Password?
                                        </button>
                                    )}
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">lock</span>
                                    </div>
                                    <input
                                        className={`w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border ${errors.password ? 'border-red-500' : 'border-slate-200'} rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium focus:bg-white`}
                                        id="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Enter your password"
                                        type="password"
                                    />
                                </div>
                                {errors.password && <p className="text-xs text-red-500 font-bold ml-1">{errors.password}</p>}
                            </div>

                            <button
                                disabled={loading}
                                className={`mt-2 w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 transform active:scale-[0.98] flex justify-center items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                type="submit"
                            >
                                {loading ? 'Processing...' : (activeTab === 'login' ? 'Log In' : 'Create Account')}
                                {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
                            </button>
                        </form>

                        <div className="relative my-8">
                            <div aria-hidden="true" className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-white/50 px-3 text-xs font-bold text-slate-400 uppercase tracking-wider backdrop-blur-sm rounded-full">Or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 bg-white/50 hover:bg-white rounded-xl transition-all group hover:shadow-md hover:border-slate-300">
                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                <span className="text-sm font-bold text-slate-700">Google</span>
                            </button>
                            <button className="flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 bg-white/50 hover:bg-white rounded-xl transition-all group hover:shadow-md hover:border-slate-300">
                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform text-slate-900" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.1 2.69-.99 3.85-.68 1.45.28 2.5.95 3.3 2.08-2.91 1.66-2.43 5.36.43 6.6-1.14 2.53-2.12 3.69-2.66 4.17zm-1.87-14.4c.53-2.31 2.39-4.01 4.54-4.14.3.46.99 3.55-2.67 5.25-1.25.59-3.26-.06-1.87-1.11z" />
                                </svg>
                                <span className="text-sm font-bold text-slate-700">Apple</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center relative z-10">
                    <p className="text-xs text-slate-500 font-medium">
                        By continuing, you agree to our <a className="font-bold text-primary hover:text-primary/80 underline decoration-dotted underline-offset-4" href="#">Terms of Service</a> and <a className="font-bold text-primary hover:text-primary/80 underline decoration-dotted underline-offset-4" href="#">Privacy Policy</a>.
                    </p>
                </div>
            </main>

            {/* Forgot Password Modal */}
            <ForgotPasswordModal
                isOpen={showForgotPassword}
                onClose={() => setShowForgotPassword(false)}
            />

            {/* Background Image Side (Optional/Hidden on Mobile) */}
            <div className="hidden xl:block absolute right-0 top-0 h-full w-1/3 z-0 pointer-events-none">
                <div className="relative h-full w-full">
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white z-10"></div>
                    <div className="absolute inset-0 bg-white/10 z-10 mix-blend-overlay"></div>
                    <img alt="Abstract educational tools" className="h-full w-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0fXVYV0EQ7xaaf1lAKDm6ZPErkNEtnhP4tkx-E1XDxdRc-7vMVuDLU8PIieKxpaCKfVWK98p9Oc9es-krEV6ahXi9IEQmAXcuxprVZiX3U8VNI0_enE0z2WDnkLvgAX6mHrzHhopEANEJQRGUS9uzI-nPOuZgblVdJqWPjZiMFAv2bkuyaZLfOVnYr9QXBbLPuUC10j5y75a0ww9tD4TFkCVdWBVvDm38NRdmQtvKdx5NysAii-5B-9zFz2NuYKDJt9g9vi_Jum1g" />
                </div>
            </div>
        </div>
    );
}
