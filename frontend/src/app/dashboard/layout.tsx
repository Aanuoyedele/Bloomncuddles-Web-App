"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { DashboardProvider, useDashboard } from "./context";

// Define Roles and Navigation
type UserRole = 'Teacher' | 'Admin' | 'Parent';

const TEACHER_NAV = [
    { name: 'Overview', icon: 'dashboard', href: '/dashboard' },
    { name: 'Classes', icon: 'class', href: '/dashboard/classes' },
    { name: 'Students', icon: 'groups', href: '/dashboard/students' },
    { name: 'Assignments', icon: 'assignment', href: '/dashboard/assignments' },
    { name: 'Games', icon: 'sports_esports', href: '/dashboard/games' },
    { name: 'Library', icon: 'local_library', href: '/dashboard/library' },
    { name: 'Reports', icon: 'analytics', href: '/dashboard/reports' },
];

const ADMIN_NAV = [
    { name: 'Overview', icon: 'dashboard', href: '/dashboard' },
    { name: 'User Management', icon: 'manage_accounts', href: '/dashboard/users' },
    { name: 'Classes', icon: 'class', href: '/dashboard/classes' },
    { name: 'Students', icon: 'groups', href: '/dashboard/students' },
    { name: 'School Settings', icon: 'domain', href: '/dashboard/settings' },
    { name: 'Billing', icon: 'receipt_long', href: '/dashboard/billing' },
    { name: 'Reports', icon: 'analytics', href: '/dashboard/reports' },
];

const PARENT_NAV = [
    { name: 'Overview', icon: 'dashboard', href: '/dashboard' },
    { name: 'My Children', icon: 'child_care', href: '/dashboard/children' },
    { name: 'Messages', icon: 'chat', href: '/dashboard/messages' },
];

function DashboardContent({ children }: { children: React.ReactNode }) {
    const { userRole, setUserRole, logout } = useDashboard();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const schoolName = "Bloom High School";

    // Choose Navigation based on Role
    const navItems = userRole === 'Admin' ? ADMIN_NAV : userRole === 'Parent' ? PARENT_NAV : TEACHER_NAV;

    return (
        <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 h-full p-6 transition-transform duration-300 ease-in-out
                md:relative md:translate-x-0 flex flex-col
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex items-center gap-3 mb-8 px-2">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-md shadow-primary/30 shrink-0">
                        <span className="material-symbols-outlined">school</span>
                    </div>
                    <div className="overflow-hidden">
                        <h1 className="text-base font-extrabold tracking-tight text-slate-900 font-display truncate">{schoolName}</h1>
                        <p className="text-xs text-slate-500 font-bold truncate tracking-wide uppercase">{userRole} Portal</p>
                    </div>
                    {/* Close button for Mobile */}
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="md:hidden ml-auto text-slate-400 hover:text-slate-600"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Role Switcher (For Demo Purpose) */}
                <div className="mb-6 px-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">View As:</label>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button
                            onClick={() => setUserRole('Teacher')}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${userRole === 'Teacher' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Teacher
                        </button>
                        <button
                            onClick={() => setUserRole('Admin')}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${userRole === 'Admin' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Admin
                        </button>
                        <button
                            onClick={() => setUserRole('Parent')}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${userRole === 'Parent' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Parent
                        </button>
                    </div>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-hide">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30 font-bold'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
                                    }`}
                            >
                                <span className={`material-symbols-outlined ${isActive ? 'filled' : ''}`}>{item.icon}</span>
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto pt-6 border-t border-slate-100 space-y-1">
                    <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-primary rounded-xl transition-colors font-medium">
                        <span className="material-symbols-outlined">settings</span>
                        <span>Settings</span>
                    </Link>
                    <button
                        onClick={() => logout()}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors font-medium"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
                {/* Header */}
                <header className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6 bg-white border-b border-slate-200 md:border-none sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        {/* Hamburger Trigger */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>

                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-display truncate max-w-[200px] md:max-w-none">
                                {userRole === 'Teacher' ? 'Good morning, Mr. Smith 👋' : userRole === 'Admin' ? 'Admin Dashboard' : 'Parent Portal'}
                            </h2>
                            {userRole === 'Teacher' && (
                                <p className="text-slate-500 text-sm mt-1 hidden md:block">Here's what's happening in your classrooms today.</p>
                            )}
                            {userRole === 'Parent' && (
                                <p className="text-slate-500 text-sm mt-1 hidden md:block">Welcome back, Mr. & Mrs. Smith</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <div className="hidden md:flex items-center bg-slate-50 px-4 py-2.5 rounded-full border border-slate-200 w-64 hover:border-primary/50 transition-colors focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10">
                            <span className="material-symbols-outlined text-slate-400 text-xl">search</span>
                            <input
                                className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm ml-2 w-full text-slate-900 placeholder-slate-400"
                                placeholder={userRole === 'Teacher' ? "Search students..." : "Search..."}
                                type="text"
                            />
                        </div>
                        <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center relative hover:bg-slate-50 transition-colors text-slate-600">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-secondary rounded-full border-2 border-white"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-2">
                            <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm ring-2 ring-slate-100 relative overflow-hidden">
                                <Image
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAL7bJ7ejUy-RI4kXMLJN0xI_sjHsLHgzkDmSn9_9ck2gukTeMuVJdiBz6Lcgyppyn0dlNI6qUGGB9BG9PRGB-eetuOciTj2wHPhCxthZP0dAO-Zl5bFm22inn7Z_YbF63m6lXiuWRSoikaze2xIA0NL2S_ZRA-pDCq9AATci9q5AxqMBwtkzpPuTGMw_HiZqzqoC-5vp-tw6-2VTOhAo7MJ65xQbvhd1wdxoF_JHV9PCgfbyIQcro9R1Dvsy7iV2He67DPacr3YFKT"
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8 scrollbar-hide">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardProvider>
            <DashboardContent>{children}</DashboardContent>
        </DashboardProvider>
    );
}
