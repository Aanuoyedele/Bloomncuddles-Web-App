"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface StudentUser {
    id: string;
    name: string;
    email: string;
    role: string;
    grade: string;
    className: string;
}

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<StudentUser | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        // Skip auth check for token-based access routes
        if (pathname?.startsWith('/student/access/')) {
            return;
        }

        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            router.push('/login');
            return;
        }

        const parsed = JSON.parse(userData);
        if (parsed.role !== 'STUDENT') {
            router.push('/login');
            return;
        }

        setUser(parsed);
    }, [router, pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    const navItems = [
        { name: "Dashboard", href: "/student", icon: "dashboard" },
        { name: "Assignments", href: "/student/assignments", icon: "assignment" },
        { name: "Games", href: "/student/games", icon: "sports_esports" },
        { name: "Library", href: "/student/library", icon: "menu_book" },
        { name: "My Grades", href: "/student/grades", icon: "grade" },
    ];

    // For token-based access routes, render without the sidebar layout
    if (pathname?.startsWith('/student/access/')) {
        return <>{children}</>;
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
                <div className="flex h-16 items-center justify-between px-4 lg:px-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-lg">B</span>
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="font-bold text-slate-900">Bloom n Cuddles</h1>
                                <p className="text-xs text-slate-500">Student Portal</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg">
                            <span className="material-symbols-outlined text-primary text-sm">school</span>
                            <span className="text-sm font-bold text-primary">{user.grade}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-white font-bold">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-bold text-slate-900">{user.name}</p>
                                <p className="text-xs text-slate-500">{user.className}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-red-500"
                            title="Logout"
                        >
                            <span className="material-symbols-outlined">logout</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className={`fixed lg:sticky top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
                    <nav className="p-4 space-y-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive
                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                        }`}
                                >
                                    <span className="material-symbols-outlined">{item.icon}</span>
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Fun Quote */}
                    <div className="absolute bottom-4 left-4 right-4 p-4 bg-primary/10 rounded-2xl">
                        <p className="text-sm font-bold text-slate-700">💡 Learn Tip</p>
                        <p className="text-xs text-slate-600 mt-1">Keep practicing! Every mistake helps you learn something new.</p>
                    </div>
                </aside>

                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main Content */}
                <main className="flex-1 p-4 lg:p-8 min-h-[calc(100vh-4rem)]">
                    {children}
                </main>
            </div>
        </div>
    );
}
