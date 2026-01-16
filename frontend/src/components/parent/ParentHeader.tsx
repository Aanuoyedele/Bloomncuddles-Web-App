"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ParentHeaderProps {
    userName?: string;
    onLogout: () => void;
}

export default function ParentHeader({ userName, onLogout }: ParentHeaderProps) {
    const pathname = usePathname();
    const [searchQuery, setSearchQuery] = useState("");
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const tabs = [
        { name: "Dashboard", href: "/parent" },
        { name: "Children", href: "/parent/children" },
        { name: "Messages", href: "/parent/messages" },
        { name: "Resources", href: "/parent/resources" },
    ];

    return (
        <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between gap-4">
                    {/* Search Bar */}
                    <div className="flex-1 max-w-md relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Search for students, grades or messages..."
                            className="w-full h-10 pl-10 pr-4 bg-slate-50 border-0 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-primary/20 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        {/* Notifications */}
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                            <span className="material-symbols-outlined text-slate-600">notifications</span>
                            <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full"></span>
                        </button>

                        {/* Profile */}
                        <div className="relative">
                            <button
                                onClick={() => setShowProfile(!showProfile)}
                                className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-50 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                                    {userName?.charAt(0).toUpperCase() || 'P'}
                                </div>
                            </button>

                            {showProfile && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                                    <div className="px-4 py-3 border-b border-slate-100">
                                        <p className="font-bold text-slate-800">{userName}</p>
                                        <p className="text-sm text-slate-500">Parent Account</p>
                                    </div>
                                    <Link
                                        href="/parent/settings"
                                        className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">settings</span>
                                        Settings
                                    </Link>
                                    <button
                                        onClick={onLogout}
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

                {/* Tab Navigation */}
                <nav className="flex gap-1 mt-4 -mb-4">
                    {tabs.map((tab) => {
                        const isActive = tab.href === '/parent'
                            ? pathname === '/parent'
                            : pathname?.startsWith(tab.href);
                        return (
                            <Link
                                key={tab.name}
                                href={tab.href}
                                className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${isActive
                                        ? 'text-primary border-primary'
                                        : 'text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300'
                                    }`}
                            >
                                {tab.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
}
