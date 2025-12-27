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
            // Redirect non-parents to their appropriate dashboard
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
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/parent" className="flex items-center gap-2">
                            <span className="text-2xl">🌸</span>
                            <span className="text-xl font-bold text-primary">
                                Bloom n Cuddles
                            </span>
                        </Link>

                        {/* User Menu */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-full">
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                                    {user?.name?.charAt(0) || 'P'}
                                </div>
                                <span className="text-sm font-medium text-slate-700 hidden sm:block">
                                    {user?.name}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Logout"
                            >
                                <span className="material-symbols-outlined">logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}
