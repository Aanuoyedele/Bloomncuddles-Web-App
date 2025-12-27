"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

interface DashboardData {
    student: {
        name: string;
        grade: string;
        className: string;
        teacherName: string;
    };
    stats: {
        pendingAssignments: number;
        totalAssignments: number;
        averageScore: number | null;
        gamesAvailable: number;
    };
}

export default function StudentDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await api.get('/student/dashboard');
                setData(response);
            } catch (err) {
                console.error('Failed to fetch dashboard:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-primary rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-[-50%] right-[-20%] w-[400px] h-[400px] bg-white/10 rounded-full"></div>
                <div className="absolute bottom-[-30%] left-[-10%] w-[300px] h-[300px] bg-white/10 rounded-full"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">
                        Welcome back, {data?.student.name || 'Student'}! 👋
                    </h1>
                    <p className="text-white/80 text-lg">
                        {data?.student.className} • {data?.student.grade}
                    </p>
                    <p className="text-white/60 mt-1">
                        Teacher: {data?.student.teacherName}
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/student/assignments" className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-orange-100">
                            <span className="material-symbols-outlined text-orange-500">assignment</span>
                        </div>
                        {(data?.stats.pendingAssignments || 0) > 0 && (
                            <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                                {data?.stats.pendingAssignments} pending
                            </span>
                        )}
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{data?.stats.totalAssignments || 0}</p>
                    <p className="text-slate-500 text-sm mt-1">Total Assignments</p>
                </Link>

                <Link href="/student/grades" className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-green-100">
                            <span className="material-symbols-outlined text-green-500">grade</span>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">
                        {data?.stats.averageScore !== null ? `${data?.stats.averageScore}%` : '--'}
                    </p>
                    <p className="text-slate-500 text-sm mt-1">Average Score</p>
                </Link>

                <Link href="/student/games" className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-orange-100">
                            <span className="material-symbols-outlined text-orange-500">sports_esports</span>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{data?.stats.gamesAvailable || 0}</p>
                    <p className="text-slate-500 text-sm mt-1">Games Available</p>
                </Link>

                <Link href="/student/library" className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-blue-100">
                            <span className="material-symbols-outlined text-blue-500">menu_book</span>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">📚</p>
                    <p className="text-slate-500 text-sm mt-1">Reading Library</p>
                </Link>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Assignments Preview */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-900">Pending Assignments</h2>
                        <Link href="/student/assignments" className="text-primary text-sm font-bold hover:underline">
                            View All →
                        </Link>
                    </div>
                    <div className="p-6">
                        {(data?.stats.pendingAssignments || 0) > 0 ? (
                            <div className="text-center py-4">
                                <p className="text-4xl mb-2">📝</p>
                                <p className="font-bold text-slate-700">
                                    You have {data?.stats.pendingAssignments} assignment(s) to complete!
                                </p>
                                <Link href="/student/assignments" className="mt-4 inline-block px-6 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors">
                                    Start Working
                                </Link>
                            </div>
                        ) : (
                            <div className="text-center py-4 text-slate-500">
                                <p className="text-4xl mb-2">🎉</p>
                                <p className="font-bold">All caught up! No pending assignments.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Play Games */}
                <div className="bg-secondary rounded-2xl shadow-lg overflow-hidden text-white">
                    <div className="p-6">
                        <h2 className="text-lg font-bold mb-2">Learn While Playing! 🎮</h2>
                        <p className="text-white/80 mb-6">
                            Fun educational games assigned by your teacher!
                        </p>
                        <Link href="/student/games" className="inline-block px-6 py-3 bg-white text-secondary rounded-xl font-bold hover:bg-white/90 transition-colors">
                            Play Now →
                        </Link>
                    </div>
                    <div className="px-6 pb-6">
                        <div className="flex gap-2">
                            <span className="text-4xl">🧩</span>
                            <span className="text-4xl">📚</span>
                            <span className="text-4xl">🔢</span>
                            <span className="text-4xl">✏️</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
