"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useDashboard } from "./context";

interface Stats {
    classes: number;
    students: number;
    assignments: number;
    teachers: number;
    pendingInvites: number;
}

interface EngagementDay {
    day: string;
    count: number;
    percentage: number;
}

interface ScoreData {
    className: string;
    avgScore: number;
    totalSubmissions: number;
}

interface AssignmentData {
    id: string;
    title: string;
    className: string;
    teacherName: string;
    dueDate: string;
    status: string;
}

interface AttentionItem {
    id: string;
    name: string;
    className?: string;
    issue: string;
    type: string;
}

export default function DashboardOverview() {
    const { userRole } = useDashboard();
    const [stats, setStats] = useState<Stats | null>(null);
    const [engagement, setEngagement] = useState<EngagementDay[]>([]);
    const [scores, setScores] = useState<ScoreData[]>([]);
    const [assignments, setAssignments] = useState<AssignmentData[]>([]);
    const [attention, setAttention] = useState<{ students: AttentionItem[], teachers: AttentionItem[] }>({ students: [], teachers: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [statsData, engData, scoresData, assignData, attentionData] = await Promise.all([
                    api.get('/stats'),
                    api.get('/stats/engagement'),
                    api.get('/stats/scores'),
                    api.get('/stats/assignments'),
                    api.get('/stats/attention')
                ]);
                setStats(statsData);
                setEngagement(engData.days || []);
                setScores(scoresData.scores || []);
                setAssignments(assignData.assignments || []);
                setAttention(attentionData || { students: [], teachers: [] });
            } catch (err) {
                console.error('Failed to load dashboard data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700';
            case 'In Progress': return 'bg-blue-100 text-blue-700';
            case 'Overdue': return 'bg-red-100 text-red-700';
            case 'Completed': return 'bg-slate-100 text-slate-600';
            default: return 'bg-yellow-100 text-yellow-700';
        }
    };

    const scoreColors = ['bg-primary', 'bg-secondary', 'bg-yellow-400', 'bg-emerald-500', 'bg-purple-500'];

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Classes', val: loading ? '...' : (stats?.classes ?? 0).toString(), sub: 'Active classes', subIcon: 'school', icon: 'class', color: 'text-primary', bg: 'bg-primary/10', subColor: 'text-slate-500' },
                    { label: 'Total Students', val: loading ? '...' : (stats?.students ?? 0).toString(), sub: 'Enrolled students', subIcon: 'groups', icon: 'groups', color: 'text-secondary', bg: 'bg-secondary/10', subColor: 'text-slate-500' },
                    { label: 'Total Teachers', val: loading ? '...' : (stats?.teachers ?? 0).toString(), sub: 'Active teachers', subIcon: 'person', icon: 'person', color: 'text-green-700', bg: 'bg-green-100', subColor: 'text-slate-500' },
                    { label: 'Pending Invites', val: loading ? '...' : (stats?.pendingInvites ?? 0).toString(), sub: 'Awaiting response', subIcon: 'hourglass_empty', icon: 'mail', color: 'text-secondary', bg: 'bg-secondary/10', subColor: 'text-secondary' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-500 font-medium text-sm mb-1">{stat.label}</p>
                                <h3 className="text-3xl font-bold text-slate-900">{stat.val}</h3>
                            </div>
                            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                                <span className="material-symbols-outlined text-[24px]">{stat.icon}</span>
                            </div>
                        </div>
                        <div className={`mt-4 flex items-center gap-1 text-sm ${stat.subColor}`}>
                            {stat.subIcon && <span className="material-symbols-outlined text-base">{stat.subIcon}</span>}
                            <span>{stat.sub}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Engagement Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-bold text-lg text-slate-900">Student Engagement</h3>
                        <span className="text-sm text-slate-500">Last 7 days</span>
                    </div>
                    <div className="h-64 w-full flex items-end justify-between gap-2 px-2 relative">
                        {/* Grid Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                            {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-full h-px bg-slate-500"></div>)}
                        </div>

                        {/* Visual Bars */}
                        {(engagement.length > 0 ? engagement : [
                            { day: 'Mon', percentage: 0 }, { day: 'Tue', percentage: 0 }, { day: 'Wed', percentage: 0 },
                            { day: 'Thu', percentage: 0 }, { day: 'Fri', percentage: 0 }
                        ]).map((bar, i) => (
                            <div key={i} className="group relative flex flex-col items-center gap-2 h-full justify-end w-full">
                                <div
                                    className="w-full bg-gradient-to-t from-primary/20 to-primary/5 rounded-t-lg relative overflow-hidden transition-all duration-500 group-hover:bg-primary/30"
                                    style={{ height: `${Math.max(bar.percentage, 5)}%` }}
                                >
                                    <div className="absolute top-0 left-0 w-full h-[3px] bg-primary shadow-[0_0_15px_#486fa1]"></div>
                                </div>
                                <span className="text-xs text-slate-500 font-medium">{bar.day}</span>
                            </div>
                        ))}
                    </div>
                    {engagement.length === 0 && !loading && (
                        <p className="text-center text-slate-400 text-sm mt-4">No engagement data yet. Students will appear here as they submit assignments.</p>
                    )}
                </div>

                {/* Avg Scores */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg text-slate-900">Avg. Scores</h3>
                        <button className="text-primary text-sm font-semibold hover:text-primary/80 transition-colors">View All</button>
                    </div>
                    <div className="flex flex-col justify-center gap-6">
                        {scores.length > 0 ? scores.map((item, i) => (
                            <div key={i} className="group">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium text-slate-900">{item.className}</span>
                                    <span className="text-slate-500 font-semibold">{item.avgScore}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                    <div className={`${scoreColors[i % scoreColors.length]} h-full rounded-full transition-all duration-1000 group-hover:opacity-90`} style={{ width: `${item.avgScore}%` }}></div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-8">
                                <span className="material-symbols-outlined text-4xl text-slate-300">grade</span>
                                <p className="text-slate-400 text-sm mt-2">No graded submissions yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Recent Assignments */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg text-slate-900">Recent Assignments</h3>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 hover:bg-primary hover:text-white transition-all duration-200 text-primary">
                            <span className="material-symbols-outlined text-lg">add</span>
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                <tr>
                                    <th className="pb-3 pl-2 font-bold opacity-70">Title</th>
                                    <th className="pb-3 font-bold opacity-70">Class</th>
                                    <th className="pb-3 font-bold opacity-70">Teacher</th>
                                    <th className="pb-3 font-bold opacity-70">Due Date</th>
                                    <th className="pb-3 font-bold opacity-70 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {assignments.length > 0 ? assignments.map((row) => (
                                    <tr key={row.id} className="hover:bg-slate-50/80 transition-colors border-b border-transparent hover:border-slate-100 rounded-lg">
                                        <td className="py-4 pl-2 font-semibold text-slate-900">{row.title}</td>
                                        <td className="py-4 text-slate-500">{row.className}</td>
                                        <td className="py-4 text-slate-500">{row.teacherName}</td>
                                        <td className="py-4 text-slate-500">{new Date(row.dueDate).toLocaleDateString()}</td>
                                        <td className="py-4 text-right">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(row.status)}`}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-slate-400">
                                            <span className="material-symbols-outlined text-4xl text-slate-300 block mb-2">assignment</span>
                                            No assignments yet
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Needs Attention */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg text-slate-900">Needs Attention</h3>
                        <button className="text-slate-400 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined">more_horiz</span>
                        </button>
                    </div>
                    <div className="space-y-4">
                        {(attention.students.length > 0 || attention.teachers.length > 0) ? (
                            <>
                                {attention.students.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-200">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-xl">person</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-slate-900">{item.name}</h4>
                                                <p className="text-xs text-slate-500">{item.className} • {item.issue}</p>
                                            </div>
                                        </div>
                                        <button className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-200">
                                            <span className="material-symbols-outlined text-sm">mail</span>
                                        </button>
                                    </div>
                                ))}
                                {attention.teachers.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-slate-50 border border-orange-100 hover:border-orange-200 hover:shadow-sm transition-all duration-200">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-xl">school</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-slate-900">{item.name}</h4>
                                                <p className="text-xs text-orange-600">Teacher • {item.issue}</p>
                                            </div>
                                        </div>
                                        <button className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all duration-200">
                                            <span className="material-symbols-outlined text-sm">mail</span>
                                        </button>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <span className="material-symbols-outlined text-4xl text-green-300">check_circle</span>
                                <p className="text-slate-500 text-sm mt-2 font-medium">All caught up! No issues to address.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

