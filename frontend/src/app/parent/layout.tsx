"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

export default function ParentLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [showProfile, setShowProfile] = useState(false);

    useEffect(() => {
        // Skip auth check for login page
        if (pathname === '/parent/login') {
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            router.push('/parent/login');
            return;
        }

        const parsed = JSON.parse(userData);
        if (parsed.role !== 'PARENT') {
            if (parsed.role === 'ADMIN' || parsed.role === 'TEACHER') {
                router.push('/dashboard');
            } else {
                router.push('/parent/login');
            }
            return;
        }

        setUser(parsed);
        setLoading(false);
    }, [router, pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/parent/login');
    };

    // For login page, render without layout
    if (pathname === '/parent/login') {
        return <>{children}</>;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background-cream flex items-center justify-center font-sans">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    const navItems = [
        { name: "Overview", href: "/parent", icon: "dashboard" },
        { name: "Children", href: "/parent/children", icon: "school" },
        { name: "Messages", href: "/parent/messages", icon: "mail" },
        { name: "Settings", href: "/parent/settings", icon: "settings" },
    ];

    const isActive = (href: string) => {
        if (href === '/parent') return pathname === '/parent';
        return pathname?.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-background-cream font-sans relative overflow-hidden">
            {/* Animated Floating Bubbles */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute w-64 h-64 bg-gradient-to-br from-primary/10 to-pink-200/20 rounded-full blur-3xl -top-20 -left-20 animate-float" />
                <div className="absolute w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl top-1/4 -right-32 animate-float-delayed" />
                <div className="absolute w-72 h-72 bg-gradient-to-br from-green-200/15 to-teal-200/20 rounded-full blur-3xl bottom-1/4 left-1/4 animate-float-slow" />
                <div className="absolute w-48 h-48 bg-gradient-to-br from-orange-200/20 to-yellow-200/20 rounded-full blur-2xl bottom-20 right-1/3 animate-float" />
                <div className="absolute w-32 h-32 bg-gradient-to-br from-pink-200/25 to-rose-200/20 rounded-full blur-xl top-1/2 left-10 animate-float-delayed" />
            </div>

            {/* SVG Wave Pattern - Top */}
            <div className="absolute top-0 left-0 right-0 pointer-events-none overflow-hidden">
                <svg className="w-full h-32 opacity-30" viewBox="0 0 1440 120" preserveAspectRatio="none">
                    <path
                        fill="url(#wave-gradient-top)"
                        d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,30 1440,60 L1440,0 L0,0 Z"
                    />
                    <defs>
                        <linearGradient id="wave-gradient-top" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#486fa1" />
                            <stop offset="50%" stopColor="#ec7daf" />
                            <stop offset="100%" stopColor="#486fa1" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* SVG Blob Pattern - Bottom */}
            <div className="fixed bottom-0 left-0 right-0 pointer-events-none overflow-hidden">
                <svg className="w-full h-48 opacity-20" viewBox="0 0 1440 200" preserveAspectRatio="none">
                    <path
                        fill="url(#wave-gradient-bottom)"
                        d="M0,100 C240,150 480,50 720,100 C960,150 1200,50 1440,100 L1440,200 L0,200 Z"
                    />
                    <path
                        fill="url(#wave-gradient-bottom-2)"
                        fillOpacity="0.5"
                        d="M0,120 C360,80 720,160 1080,120 C1260,100 1380,140 1440,120 L1440,200 L0,200 Z"
                    />
                    <defs>
                        <linearGradient id="wave-gradient-bottom" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#22c55e" />
                            <stop offset="50%" stopColor="#14b8a6" />
                            <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                        <linearGradient id="wave-gradient-bottom-2" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ec4899" />
                            <stop offset="100%" stopColor="#f97316" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Header */}
            <header className="bg-white/95 backdrop-blur-md border-b border-slate-100 fixed top-0 left-0 right-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/parent" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-white text-lg">🌸</span>
                            </div>
                            <div className="hidden sm:block">
                                <span className="text-lg font-bold text-slate-800">Parent Portal</span>
                                <span className="text-xs text-slate-500 block">Bloom n Cuddles</span>
                            </div>
                        </Link>

                        {/* Navigation - Horizontal */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${isActive(item.href)
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Right Side - Profile */}
                        <div className="flex items-center gap-3">
                            {/* Notifications */}
                            <button className="relative p-2 rounded-xl hover:bg-slate-50 transition-colors">
                                <span className="material-symbols-outlined text-slate-600">notifications</span>
                                <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full"></span>
                            </button>

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowProfile(!showProfile)}
                                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                                        {user?.name?.charAt(0).toUpperCase() || 'P'}
                                    </div>
                                    <span className="hidden sm:block text-sm font-medium text-slate-700">
                                        {user?.name?.split(' ')[0]}
                                    </span>
                                    <span className="material-symbols-outlined text-slate-400 text-[18px]">
                                        expand_more
                                    </span>
                                </button>

                                {showProfile && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                                        <div className="px-4 py-3 border-b border-slate-100">
                                            <p className="font-bold text-slate-800">{user?.name}</p>
                                            <p className="text-sm text-slate-500 truncate">{user?.email}</p>
                                        </div>
                                        <Link
                                            href="/parent/settings"
                                            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50"
                                            onClick={() => setShowProfile(false)}
                                        >
                                            <span className="material-symbols-outlined text-[18px]">settings</span>
                                            Settings
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 w-full text-left"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">logout</span>
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <nav className="flex md:hidden gap-1 pb-3 overflow-x-auto">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${isActive(item.href)
                                    ? 'bg-primary text-white'
                                    : 'text-slate-600 bg-slate-50'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28 pb-24 relative z-10">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white/95 backdrop-blur-md border-t border-slate-100 fixed bottom-0 left-0 right-0 z-40 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                            <span className="text-lg">🌸</span>
                            <span>Bloom n Cuddles Parent Portal</span>
                        </div>
                        <nav className="flex items-center gap-6">
                            <Link href="/student" className="text-slate-500 hover:text-primary text-sm font-medium">
                                Student Portal
                            </Link>
                            <Link href="/privacy" className="text-slate-500 hover:text-primary text-sm font-medium">
                                Privacy
                            </Link>
                            <Link href="/contact" className="text-slate-500 hover:text-primary text-sm font-medium">
                                Support
                            </Link>
                        </nav>
                    </div>
                </div>
            </footer>
        </div>
    );
}
