"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DashboardProvider, useDashboard } from "./context";
import { api } from "@/lib/api";

// Define Roles and Navigation
type UserRole = 'Teacher' | 'Admin' | 'Parent' | 'Student';

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

const STUDENT_NAV = [
    { name: 'Overview', icon: 'dashboard', href: '/dashboard' },
    { name: 'My Assignments', icon: 'assignment', href: '/dashboard/assignments' },
    { name: 'Games', icon: 'sports_esports', href: '/dashboard/games' },
    { name: 'My Grades', icon: 'grade', href: '/dashboard/grades' },
];

function DashboardContent({ children }: { children: React.ReactNode }) {
    const { userRole, userName, isLoading, logout, schoolSettings } = useDashboard();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const schoolName = schoolSettings?.name || "Loading...";
    const schoolLogo = schoolSettings?.logoUrl;

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Notification state
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    // Fetch notifications on mount
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await api.get('/notifications');
                setNotifications(data.notifications || []);
                setUnreadCount(data.unreadCount || 0);
            } catch (err) {
                console.error('Failed to fetch notifications:', err);
            }
        };
        fetchNotifications();
    }, []);

    // Search handler with debounce
    useEffect(() => {
        if (searchQuery.length < 2) {
            setSearchResults([]);
            setShowSearchResults(false);
            return;
        }

        const timer = setTimeout(async () => {
            setSearchLoading(true);
            try {
                const data = await api.get(`/notifications/search?q=${encodeURIComponent(searchQuery)}`);
                setSearchResults(data.results || []);
                setShowSearchResults(true);
            } catch (err) {
                console.error('Search failed:', err);
            } finally {
                setSearchLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Click outside handlers
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowSearchResults(false);
            }
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchResultClick = (link: string) => {
        setShowSearchResults(false);
        setSearchQuery('');
        router.push(link);
    };

    // Choose Navigation based on Role
    const getNavItems = () => {
        switch (userRole) {
            case 'Admin': return ADMIN_NAV;
            case 'Parent': return PARENT_NAV;
            case 'Student': return STUDENT_NAV;
            default: return TEACHER_NAV;
        }
    };
    const navItems = getNavItems();

    // Loading state
    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="text-center">
                    <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
                    <p className="mt-4 text-slate-500 font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

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
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-md shadow-primary/30 shrink-0 overflow-hidden">
                        {schoolLogo ? (
                            <Image src={schoolLogo} alt="School Logo" width={40} height={40} className="object-cover" />
                        ) : (
                            <span className="material-symbols-outlined">school</span>
                        )}
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
                                {userRole === 'Student'
                                    ? `Hey, ${userName || 'Student'} 👋`
                                    : userRole === 'Parent'
                                        ? `Welcome, ${userName || 'Parent'} 👋`
                                        : userRole === 'Admin'
                                            ? 'Admin Dashboard'
                                            : `Good morning, ${userName || 'Teacher'} 👋`
                                }
                            </h2>
                            {userRole === 'Teacher' && (
                                <p className="text-slate-500 text-sm mt-1 hidden md:block">Here's what's happening in your classrooms today.</p>
                            )}
                            {userRole === 'Parent' && (
                                <p className="text-slate-500 text-sm mt-1 hidden md:block">Track your children's progress and activities.</p>
                            )}
                            {userRole === 'Student' && (
                                <p className="text-slate-500 text-sm mt-1 hidden md:block">Ready to learn something amazing today?</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Search */}
                        <div className="hidden md:block relative" ref={searchRef}>
                            <div className="flex items-center bg-slate-50 px-4 py-2.5 rounded-full border border-slate-200 w-64 hover:border-primary/50 transition-colors focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10">
                                <span className="material-symbols-outlined text-slate-400 text-xl">search</span>
                                <input
                                    className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm ml-2 w-full text-slate-900 placeholder-slate-400"
                                    placeholder={userRole === 'Teacher' ? "Search students..." : "Search..."}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
                                />
                                {searchLoading && (
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                                )}
                            </div>
                            {/* Search Results Dropdown */}
                            {showSearchResults && searchResults.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
                                    {searchResults.map((result) => (
                                        <button
                                            key={`${result.type}-${result.id}`}
                                            onClick={() => handleSearchResultClick(result.link)}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                <span className="material-symbols-outlined text-lg">{result.icon}</span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900 text-sm">{result.title}</p>
                                                <p className="text-xs text-slate-500">{result.subtitle}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                            {showSearchResults && searchQuery.length >= 2 && searchResults.length === 0 && !searchLoading && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-4 text-center text-slate-500 text-sm">
                                    No results found
                                </div>
                            )}
                        </div>

                        {/* Notifications */}
                        <div className="relative" ref={notifRef}>
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center relative hover:bg-slate-50 transition-colors text-slate-600"
                            >
                                <span className="material-symbols-outlined">notifications</span>
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 w-4 h-4 bg-secondary rounded-full border-2 border-white text-[10px] font-bold text-white flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
                                    <div className="p-4 border-b border-slate-100">
                                        <h3 className="font-bold text-slate-900">Notifications</h3>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.map((notif) => (
                                                <Link
                                                    key={notif.id}
                                                    href={notif.link}
                                                    onClick={() => setShowNotifications(false)}
                                                    className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors ${!notif.read ? 'bg-primary/5' : ''}`}
                                                >
                                                    <div className={`w-10 h-10 rounded-lg ${notif.bg} flex items-center justify-center ${notif.color} shrink-0`}>
                                                        <span className="material-symbols-outlined">{notif.icon}</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-slate-900 text-sm">{notif.title}</p>
                                                        <p className="text-xs text-slate-500 truncate">{notif.message}</p>
                                                    </div>
                                                    <span className="text-xs text-slate-400 shrink-0">{notif.time}</span>
                                                </Link>
                                            ))
                                        ) : (
                                            <div className="py-8 text-center text-slate-400">
                                                <span className="material-symbols-outlined text-3xl">notifications_off</span>
                                                <p className="mt-2 text-sm">No notifications</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

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
