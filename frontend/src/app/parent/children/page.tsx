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
    };
}

const colors = [
    'from-blue-400 to-blue-500',
    'from-pink-400 to-pink-500',
    'from-green-400 to-green-500',
    'from-purple-400 to-purple-500',
    'from-orange-400 to-orange-500',
];

export default function ChildrenListPage() {
    const [children, setChildren] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchChildren();
    }, []);

    const fetchChildren = async () => {
        try {
            const data = await api.get('/students');
            setChildren(data);
        } catch (err) {
            console.error('Failed to fetch children:', err);
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
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">My Children</h1>
                <p className="text-slate-500">View detailed progress for each child</p>
            </div>

            {children.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                    <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">family_restroom</span>
                    <h2 className="text-xl font-bold text-slate-700 mb-2">No Children Linked Yet</h2>
                    <p className="text-slate-500 max-w-md mx-auto">
                        Ask your child's teacher to add your email as the parent email
                        for your child.
                    </p>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 gap-6">
                    {children.map((child, index) => (
                        <Link
                            key={child.id}
                            href={`/parent/children/${child.id}`}
                            className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all group"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                {/* Avatar */}
                                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${colors[index % colors.length]} flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                                    {child.name.charAt(0).toUpperCase()}
                                </div>

                                {/* Info */}
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-primary transition-colors">
                                        {child.name}
                                    </h3>
                                    <p className="text-slate-500">{child.grade}</p>
                                    {child.class?.name && (
                                        <p className="text-slate-400 text-sm">{child.class.name}</p>
                                    )}
                                </div>

                                {/* Arrow */}
                                <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">
                                    arrow_forward
                                </span>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
                                <div className="text-center">
                                    <p className="font-bold text-slate-800">98%</p>
                                    <p className="text-xs text-slate-500">Attendance</p>
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-green-600">A+</p>
                                    <p className="text-xs text-slate-500">Avg Grade</p>
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-slate-800">🔥 5</p>
                                    <p className="text-xs text-slate-500">Streak</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
