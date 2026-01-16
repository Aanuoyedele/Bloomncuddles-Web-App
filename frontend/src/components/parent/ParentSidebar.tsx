"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface ParentSidebarProps {
    userName?: string;
    unreadMessages?: number;
}

export default function ParentSidebar({ userName, unreadMessages = 0 }: ParentSidebarProps) {
    const pathname = usePathname();

    const navItems = [
        { name: "Overview", href: "/parent", icon: "dashboard" },
        { name: "Child Progress", href: "/parent/children", icon: "school" },
        { name: "Messages", href: "/parent/messages", icon: "mail", badge: unreadMessages },
        { name: "Settings", href: "/parent/settings", icon: "settings" },
    ];

    const isActive = (href: string) => {
        if (href === '/parent') {
            return pathname === '/parent';
        }
        return pathname?.startsWith(href);
    };

    return (
        <aside className="w-64 bg-white border-r border-slate-100 min-h-screen flex flex-col">
            {/* Logo Header */}
            <div className="p-6 border-b border-slate-100">
                <Link href="/parent" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">🌸</span>
                    </div>
                    <div>
                        <span className="text-lg font-bold text-slate-800 block">Parent Portal</span>
                        <span className="text-xs text-slate-500">Bloom n Cuddles</span>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive(item.href)
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                        <span className="flex-1">{item.name}</span>
                        {item.badge && item.badge > 0 && (
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${isActive(item.href) ? 'bg-white/20 text-white' : 'bg-primary text-white'
                                }`}>
                                {item.badge}
                            </span>
                        )}
                    </Link>
                ))}
            </nav>

            {/* Upgrade Banner */}
            <div className="p-4">
                <div className="bg-gradient-to-br from-secondary/10 to-pink-100 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">⭐</span>
                        <span className="font-bold text-slate-800 text-sm">Go Premium</span>
                    </div>
                    <p className="text-xs text-slate-600 mb-3">
                        Unlock detailed progress reports and more features!
                    </p>
                    <button className="w-full py-2 bg-secondary text-white rounded-xl font-bold text-sm hover:bg-secondary-light transition-colors">
                        Upgrade
                    </button>
                </div>
            </div>

            {/* User Footer */}
            <div className="p-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                        {userName?.charAt(0).toUpperCase() || 'P'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 text-sm truncate">{userName || 'Parent'}</p>
                        <p className="text-xs text-slate-500">Basic Member</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
