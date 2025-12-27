"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

interface Student {
    id: string;
    name: string;
    grade: string;
    accessToken: string;
    class?: {
        name: string;
    };
}

export default function ParentDashboard() {
    const [children, setChildren] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
        fetchChildren();
    }, []);

    const fetchChildren = async () => {
        try {
            const data = await api.get('/students');
            setChildren(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load children');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="bg-primary rounded-2xl p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">
                    Welcome back, {user?.name?.split(' ')[0]}! 👋
                </h1>
                <p className="text-white/80">
                    View your children's learning progress and access their portals.
                </p>
            </div>

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 flex items-center gap-3">
                    <span className="material-symbols-outlined">error</span>
                    <p className="font-medium">{error}</p>
                </div>
            )}

            {/* No Children State */}
            {children.length === 0 && !error && (
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
            )}

            {/* Children Grid */}
            {children.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-4">
                        Your Children ({children.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {children.map((child) => (
                            <div
                                key={child.id}
                                className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 group"
                            >
                                {/* Child Avatar & Name */}
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold shadow-lg">
                                        {child.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">{child.name}</h3>
                                        <p className="text-slate-500 text-sm">{child.grade}</p>
                                    </div>
                                </div>

                                {/* Class Info */}
                                <div className="flex items-center gap-2 text-slate-600 mb-4">
                                    <span className="material-symbols-outlined text-[18px]">school</span>
                                    <span className="text-sm font-medium">
                                        {child.class?.name || 'No class assigned'}
                                    </span>
                                </div>

                                {/* Quick Stats - Placeholder */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="bg-slate-50 rounded-xl p-3 text-center">
                                        <span className="material-symbols-outlined text-primary text-xl">assignment</span>
                                        <p className="text-xs text-slate-500 mt-1">Assignments</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-3 text-center">
                                        <span className="material-symbols-outlined text-secondary text-xl">sports_esports</span>
                                        <p className="text-xs text-slate-500 mt-1">Games</p>
                                    </div>
                                </div>

                                {/* Access Portal Button */}
                                <Link
                                    href={`/student/access/${child.accessToken}`}
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all"
                                >
                                    <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                                    Access Learning Portal
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Help Section */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">help</span>
                    Need Help?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="p-4 bg-slate-50 rounded-xl">
                        <p className="font-medium text-slate-700 mb-1">Missing a child?</p>
                        <p className="text-slate-500">
                            Contact your child's teacher and ask them to add your email address
                            as the parent email for your child.
                        </p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                        <p className="font-medium text-slate-700 mb-1">Can't access portal?</p>
                        <p className="text-slate-500">
                            Make sure you're using the same email that the teacher has on file.
                            Contact the school if issues persist.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
