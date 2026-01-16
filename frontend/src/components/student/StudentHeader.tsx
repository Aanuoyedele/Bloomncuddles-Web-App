"use client";

import Link from "next/link";
import { useState } from "react";

interface StudentHeaderProps {
    studentName: string;
    avatarUrl?: string;
}

export default function StudentHeader({ studentName, avatarUrl }: StudentHeaderProps) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const navLinks = [
        { name: "Home", href: "/student", icon: "home" },
        { name: "My Rewards", href: "/student/rewards", icon: "emoji_events" },
        { name: "Get Help", href: "/student/help", icon: "help" },
    ];

    return (
        <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/student" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-lg">🚀</span>
                        </div>
                        <span className="text-lg font-bold text-slate-800 hidden sm:block">
                            Explorer Portal
                        </span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 hover:bg-primary/10 hover:text-primary font-medium transition-all"
                            >
                                <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Profile */}
                    <div className="relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-3 p-2 rounded-full hover:bg-slate-50 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-pink-400 flex items-center justify-center text-white font-bold shadow-md">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt={studentName} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    studentName.charAt(0).toUpperCase()
                                )}
                            </div>
                        </button>

                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-fade-in">
                                <div className="px-4 py-3 border-b border-slate-100">
                                    <p className="font-bold text-slate-800">{studentName}</p>
                                    <p className="text-sm text-slate-500">Explorer</p>
                                </div>
                                <Link
                                    href="/student/profile"
                                    className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50"
                                >
                                    <span className="material-symbols-outlined text-[18px]">person</span>
                                    My Profile
                                </Link>
                                <Link
                                    href="/student/settings"
                                    className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50"
                                >
                                    <span className="material-symbols-outlined text-[18px]">settings</span>
                                    Settings
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
