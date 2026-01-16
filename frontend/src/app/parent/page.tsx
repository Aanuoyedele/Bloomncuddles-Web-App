"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

interface Student {
    id: string;
    name: string;
    grade: string;
    accessToken: string;
    class?: {
        name: string;
        grade: string;
    };
}

interface Assignment {
    id: string;
    title: string;
    dueDate: string;
    class: { name: string };
}

// Motivational quotes for parents
const quotes = [
    { text: "Education is the most powerful weapon you can use to change the world.", author: "Nelson Mandela" },
    { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
    { text: "Every child is gifted. They just unwrap their packages at different times.", author: "Unknown" },
    { text: "Children are not things to be molded, but are people to be unfolded.", author: "Jess Lair" },
    { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
];

export default function ParentDashboard() {
    const [children, setChildren] = useState<Student[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const [dailyQuote, setDailyQuote] = useState<typeof quotes[0] | null>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
        // Set daily quote based on date
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
        setDailyQuote(quotes[dayOfYear % quotes.length]);

        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const studentsData = await api.get('/students');
            setChildren(studentsData);

            try {
                const assignmentsData = await api.get('/assignments');
                setAssignments(assignmentsData);
            } catch {
                console.log('Could not fetch assignments');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const firstName = user?.name?.split(' ')[0] || 'Parent';

    const colors = [
        'from-blue-400 to-blue-500',
        'from-pink-400 to-pink-500',
        'from-green-400 to-green-500',
        'from-purple-400 to-purple-500',
        'from-orange-400 to-orange-500',
    ];

    const upcomingHomework = assignments
        .filter(a => new Date(a.dueDate) >= new Date())
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 5);

    const getDaysRemaining = (dueDate: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(dueDate);
        due.setHours(0, 0, 0, 0);
        const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diff < 0) return { text: 'Overdue', color: 'text-red-600 bg-red-50' };
        if (diff === 0) return { text: 'Due today', color: 'text-orange-600 bg-orange-50' };
        if (diff === 1) return { text: 'Due tomorrow', color: 'text-orange-600 bg-orange-50' };
        return { text: `${diff} days left`, color: 'text-slate-600 bg-slate-50' };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Floating Decorative Illustrations - Left Side */}
            <div className="hidden xl:block fixed left-8 top-1/4 space-y-8 opacity-40 pointer-events-none">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-200 to-pink-300 rounded-2xl rotate-12 flex items-center justify-center text-3xl shadow-lg animate-pulse">
                    📚
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full -rotate-6 flex items-center justify-center text-2xl shadow-md ml-4">
                    ⭐
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-green-200 to-green-300 rounded-xl rotate-6 flex items-center justify-center text-2xl shadow-md">
                    🎨
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-full rotate-12 flex items-center justify-center text-xl shadow-sm ml-6">
                    ✏️
                </div>
            </div>

            {/* Floating Decorative Illustrations - Right Side */}
            <div className="hidden xl:block fixed right-8 top-1/3 space-y-8 opacity-40 pointer-events-none">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-200 to-purple-300 rounded-2xl -rotate-12 flex items-center justify-center text-2xl shadow-lg">
                    🌟
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full rotate-6 flex items-center justify-center text-xl shadow-md ml-4">
                    🎯
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-teal-200 to-teal-300 rounded-xl -rotate-6 flex items-center justify-center text-3xl shadow-md">
                    🏆
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-rose-200 to-rose-300 rounded-full rotate-12 flex items-center justify-center text-xl shadow-sm ml-2 animate-bounce" style={{ animationDuration: '3s' }}>
                    💡
                </div>
            </div>

            {/* Main Content */}
            <div className="space-y-6 max-w-6xl mx-auto">
                {/* Welcome Header */}
                <div className="bg-gradient-to-r from-primary to-primary-light rounded-3xl p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
                    <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/10 rounded-full translate-y-1/2" />

                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold mb-2">
                            Welcome back, {firstName}! 👋
                        </h1>
                        <p className="text-white/80">
                            Here's a quick look at your children's school week.
                        </p>
                    </div>
                </div>

                {/* Motivational Quote Widget */}
                {dailyQuote && (
                    <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-6 border border-amber-100 relative overflow-hidden">
                        <div className="absolute top-2 right-4 text-6xl opacity-10">💭</div>
                        <div className="relative z-10 flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl flex items-center justify-center text-white text-xl shadow-lg flex-shrink-0">
                                ✨
                            </div>
                            <div>
                                <p className="text-slate-700 font-medium italic mb-2">
                                    "{dailyQuote.text}"
                                </p>
                                <p className="text-slate-500 text-sm">— {dailyQuote.author}</p>
                            </div>
                        </div>
                        <p className="text-xs text-amber-600/60 mt-3">Daily Inspiration</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 flex items-center gap-3">
                        <span className="material-symbols-outlined">error</span>
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                {/* No Children State */}
                {children.length === 0 && !error ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                        <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">family_restroom</span>
                        <h2 className="text-xl font-bold text-slate-700 mb-2">No Children Linked Yet</h2>
                        <p className="text-slate-500 max-w-md mx-auto">
                            Ask your child's teacher to add your email address ({user?.email}) as the parent email
                            for your child. They will automatically appear here!
                        </p>
                        <div className="mt-6 p-4 bg-blue-50 rounded-xl inline-block">
                            <p className="text-blue-700 text-sm">
                                <span className="font-medium">Your email:</span> {user?.email}
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Linked Children */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">family_restroom</span>
                                    Your Children ({children.length})
                                </h2>
                                <Link href="/parent/children" className="text-primary text-sm font-bold hover:underline">
                                    View All →
                                </Link>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {children.map((child, index) => (
                                    <Link
                                        key={child.id}
                                        href={`/parent/children/${child.id}`}
                                        className="group relative p-4 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-lg transition-all text-center"
                                    >
                                        <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${colors[index % colors.length]} flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-3`}>
                                            {child.name.charAt(0).toUpperCase()}
                                        </div>
                                        <h3 className="font-bold text-slate-800 text-sm">{child.name}</h3>
                                        <p className="text-xs text-slate-500">{child.grade}</p>
                                        {child.class?.name && (
                                            <p className="text-xs text-slate-400">{child.class.name}</p>
                                        )}
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="material-symbols-outlined text-primary text-[16px]">arrow_forward</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Stats Summary */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-2xl border border-slate-100 p-5 text-center">
                                <div className="w-12 h-12 mx-auto bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                                    <span className="material-symbols-outlined text-blue-600">school</span>
                                </div>
                                <p className="text-2xl font-bold text-slate-800">{children.length}</p>
                                <p className="text-sm text-slate-500">Children</p>
                            </div>
                            <div className="bg-white rounded-2xl border border-slate-100 p-5 text-center">
                                <div className="w-12 h-12 mx-auto bg-orange-100 rounded-xl flex items-center justify-center mb-3">
                                    <span className="material-symbols-outlined text-orange-600">assignment</span>
                                </div>
                                <p className="text-2xl font-bold text-slate-800">{upcomingHomework.length}</p>
                                <p className="text-sm text-slate-500">Upcoming Tasks</p>
                            </div>
                            <div className="bg-white rounded-2xl border border-slate-100 p-5 text-center">
                                <div className="w-12 h-12 mx-auto bg-green-100 rounded-xl flex items-center justify-center mb-3">
                                    <span className="material-symbols-outlined text-green-600">trending_up</span>
                                </div>
                                <p className="text-2xl font-bold text-slate-800">98%</p>
                                <p className="text-sm text-slate-500">Avg Attendance</p>
                            </div>
                            <div className="bg-white rounded-2xl border border-slate-100 p-5 text-center">
                                <div className="w-12 h-12 mx-auto bg-purple-100 rounded-xl flex items-center justify-center mb-3">
                                    <span className="material-symbols-outlined text-purple-600">emoji_events</span>
                                </div>
                                <p className="text-2xl font-bold text-slate-800">5</p>
                                <p className="text-sm text-slate-500">Badges Earned</p>
                            </div>
                        </div>

                        {/* Two Column Layout */}
                        <div className="grid lg:grid-cols-2 gap-6">
                            {/* Upcoming Homework */}
                            <div className="bg-white rounded-2xl border border-slate-100 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-orange-500">assignment</span>
                                        Upcoming Homework
                                    </h2>
                                </div>

                                {upcomingHomework.length === 0 ? (
                                    <div className="text-center py-8">
                                        <span className="text-4xl mb-2 block">🎉</span>
                                        <p className="text-slate-500">No upcoming homework!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {upcomingHomework.map((hw) => {
                                            const dueInfo = getDaysRemaining(hw.dueDate);
                                            return (
                                                <div
                                                    key={hw.id}
                                                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                                                >
                                                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-xl">
                                                        📝
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-bold text-slate-800 text-sm truncate">{hw.title}</h3>
                                                        <p className="text-xs text-slate-500">{hw.class.name}</p>
                                                    </div>
                                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${dueInfo.color}`}>
                                                        {dueInfo.text}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Quick Access */}
                            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border border-slate-100 p-6">
                                <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">bolt</span>
                                    Quick Actions
                                </h2>
                                <div className="space-y-3">
                                    {children.slice(0, 3).map((child) => (
                                        <Link
                                            key={child.id}
                                            href={`/student/access/${child.accessToken}`}
                                            className="flex items-center gap-4 p-4 bg-white rounded-xl hover:shadow-lg transition-all group"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center text-white font-bold">
                                                {child.name.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-slate-800 text-sm">Access {child.name}'s Portal</p>
                                                <p className="text-xs text-slate-500">View learning activities</p>
                                            </div>
                                            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">
                                                open_in_new
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Help Section */}
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">help</span>
                        Need Help?
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-white rounded-xl">
                            <p className="font-medium text-slate-700 mb-1">Missing a child?</p>
                            <p className="text-slate-500 text-sm">
                                Contact your child's teacher and ask them to add your email address
                                as the parent email.
                            </p>
                        </div>
                        <div className="p-4 bg-white rounded-xl">
                            <p className="font-medium text-slate-700 mb-1">Need support?</p>
                            <p className="text-slate-500 text-sm">
                                Email us at support@bloomncuddles.com and we'll help you out.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
