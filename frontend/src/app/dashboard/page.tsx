"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
    const router = useRouter();
    const [stats, setStats] = useState<Stats | null>(null);
    const [engagement, setEngagement] = useState<EngagementDay[]>([]);
    const [scores, setScores] = useState<ScoreData[]>([]);
    const [assignments, setAssignments] = useState<AssignmentData[]>([]);
    const [attention, setAttention] = useState<{ students: AttentionItem[], teachers: AttentionItem[] }>({ students: [], teachers: [] });
    const [loading, setLoading] = useState(true);
    const [engagementFilter, setEngagementFilter] = useState('7days');

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

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Classes', val: loading ? '...' : (stats?.classes ?? 0).toString(), sub: 'Active classes', subIcon: 'school', icon: 'class', color: 'text-white', bg: 'bg-white/20', cardBg: 'bg-blue-600 text-white shadow-blue-500/30 border-blue-400/30', pattern: 'bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_70%)]' },
                    { label: 'Total Students', val: loading ? '...' : (stats?.students ?? 0).toString(), sub: 'Enrolled students', subIcon: 'groups', icon: 'groups', color: 'text-white', bg: 'bg-white/20', cardBg: 'bg-emerald-500 text-white shadow-emerald-500/30 border-emerald-400/30', pattern: 'bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.2),transparent_60%)]' },
                    { label: 'Total Teachers', val: loading ? '...' : (stats?.teachers ?? 0).toString(), sub: 'Active teachers', subIcon: 'person', icon: 'person', color: 'text-white', bg: 'bg-white/20', cardBg: 'bg-purple-600 text-white shadow-purple-500/30 border-purple-400/30', pattern: 'bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]' },
                    { label: 'Pending Invites', val: loading ? '...' : (stats?.pendingInvites ?? 0).toString(), sub: 'Awaiting response', subIcon: 'hourglass_empty', icon: 'mail', color: 'text-white', bg: 'bg-white/20', cardBg: 'bg-orange-500 text-white shadow-orange-500/30 border-orange-400/30', pattern: 'bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_60%)]' }
                ].map((stat, i) => (
                    <div key={i} className={`relative overflow-hidden p-6 rounded-3xl shadow-lg border flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 group ${stat.cardBg}`}>
                        {/* Distinct Background Patterns per card */}
                        <div className={`absolute inset-0 w-full h-full ${stat.pattern} mix-blend-overlay opacity-60 pointer-events-none`}></div>
                        
                        {/* Decorative Blobs */}
                        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-all duration-500 pointer-events-none group-hover:scale-125"></div>
                        <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-black/10 blur-xl group-hover:bg-black/20 transition-all duration-500 pointer-events-none group-hover:scale-125"></div>
                        
                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <p className="text-white/80 font-medium text-sm mb-1 tracking-wide uppercase text-[11px]">{stat.label}</p>
                                <h3 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-sm">{stat.val}</h3>
                            </div>
                            <div className={`w-14 h-14 rounded-2xl ${stat.bg} backdrop-blur-md border border-white/20 flex items-center justify-center ${stat.color} group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-inner`}>
                                <span className="material-symbols-outlined text-[28px]">{stat.icon}</span>
                            </div>
                        </div>
                        <div className="relative z-10 mt-6 flex items-center gap-1.5 text-xs text-white/90 font-bold bg-black/10 hover:bg-black/20 transition-colors w-fit px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
                            {stat.subIcon && <span className="material-symbols-outlined text-[14px] opacity-90">{stat.subIcon}</span>}
                            <span>{stat.sub}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Engagement Chart */}
                <div className="lg:col-span-2 relative overflow-hidden bg-white p-7 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 group">
                    {/* Subtle dot pattern background */}
                    <div className="absolute inset-0 bg-grid-slate-100/[0.04] bg-[length:16px_16px] pointer-events-none"></div>
                    <div className="absolute top-0 left-0 w-full h-1 bg-primary opacity-80"></div>
                    
                    <div className="relative z-10 flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-extrabold text-xl text-slate-900 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                    <span className="material-symbols-outlined text-lg">insights</span>
                                </span>
                                Student Engagement
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">Platform activity over the last 7 days</p>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px] text-slate-500">filter_list</span>
                            <select 
                                value={engagementFilter} 
                                onChange={(e) => setEngagementFilter(e.target.value)}
                                className="bg-transparent text-xs font-bold text-slate-600 outline-none cursor-pointer"
                            >
                                <option value="7days">Last 7 days</option>
                                <option value="30days">Last 30 days</option>
                                <option value="year">This Year</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="h-64 w-full relative z-10 mt-4">
                        {engagement.length > 0 || !loading ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={engagement.length > 0 ? engagement : [
                                    { day: 'Mon', percentage: 10 }, { day: 'Tue', percentage: 22 }, { day: 'Wed', percentage: 15 },
                                    { day: 'Thu', percentage: 45 }, { day: 'Fri', percentage: 30 }
                                ]}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                                    <XAxis 
                                        dataKey="day" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }} 
                                        dy={10} 
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#64748B', fontSize: 12 }} 
                                        dx={-10}
                                    />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                                        cursor={{ stroke: '#486fa1', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="percentage" 
                                        stroke="#486fa1" 
                                        strokeWidth={4} 
                                        dot={{ fill: '#ed5667', strokeWidth: 2, r: 4 }} 
                                        activeDot={{ r: 6, strokeWidth: 0, fill: '#ed5667' }}
                                        animationDuration={1500}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : null}
                    </div>
                    {engagement.length === 0 && !loading && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-20">
                            <p className="bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm text-slate-500 text-sm font-medium flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-400">hourglass_empty</span>
                                Waiting for data...
                            </p>
                        </div>
                    )}
                </div>

                {/* Avg Scores */}
                <div className="relative overflow-hidden bg-slate-900 p-7 rounded-[2rem] shadow-xl border border-slate-800 text-white">
                    {/* Dark sleek background pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.1),transparent_70%)] pointer-events-none"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="relative z-10 flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-extrabold text-xl flex items-center gap-2">
                                <span className="material-symbols-outlined text-secondary">workspace_premium</span>
                                Class Averages
                            </h3>
                            <p className="text-sm text-slate-400 mt-1">Top performing classes</p>
                        </div>
                        <button 
                            onClick={() => router.push('/dashboard/classes')}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                            title="View all classes"
                        >
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                    </div>
                    
                    <div className="relative z-10 flex flex-col justify-center gap-7">
                        {scores.length > 0 ? scores.map((item, i) => (
                            <div key={i} className="group outline-none">
                                <div className="flex justify-between items-end text-sm mb-2.5">
                                    <span className="font-bold text-slate-200">{item.className}</span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-black tracking-tight">{item.avgScore}</span>
                                        <span className="text-slate-400 text-xs font-bold">%</span>
                                    </div>
                                </div>
                                <div className="w-full bg-slate-800/80 rounded-full h-3 overflow-hidden border border-slate-700/50 shadow-inner">
                                    <div className={`h-full rounded-full transition-all duration-1000 relative overflow-hidden`} style={{ width: `${item.avgScore}%`, backgroundColor: i % 2 === 0 ? 'var(--color-primary)' : 'var(--color-secondary)' }}>
                                        <div className="absolute inset-0 bg-white/20 w-full h-full" style={{ transform: 'skewX(-20deg)', animation: 'shimmer 2s infinite' }}></div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-10 bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                                <div className="w-12 h-12 bg-slate-700 flex items-center justify-center rounded-full mx-auto mb-3">
                                    <span className="material-symbols-outlined text-2xl text-slate-400">leaderboard</span>
                                </div>
                                <p className="text-slate-300 font-medium">No Data Available</p>
                                <p className="text-slate-500 text-xs mt-1">Check back after grading.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Recent Assignments */}
                <div className="bg-white p-7 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>
                    
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                                <span className="material-symbols-outlined">assignment</span>
                            </div>
                            <h3 className="font-extrabold text-xl text-slate-900">Recent Assignments</h3>
                        </div>
                        <button 
                            onClick={() => router.push('/dashboard/assignments/new')}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 text-slate-600 shadow-sm shadow-slate-200/50"
                            title="Create new assignment"
                        >
                            <span className="material-symbols-outlined text-xl">add</span>
                        </button>
                    </div>
                    <div className="overflow-x-auto relative z-10">
                        <table className="w-full text-left">
                            <thead className="text-xs text-slate-400 font-bold uppercase tracking-wider border-b-2 border-slate-100 bg-slate-50/50">
                                <tr>
                                    <th className="py-3 pl-4 rounded-tl-lg">Title</th>
                                    <th className="py-3">Class</th>
                                    <th className="py-3">Teacher</th>
                                    <th className="py-3">Due Date</th>
                                    <th className="py-3 pr-4 text-right rounded-tr-lg">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {assignments.length > 0 ? assignments.map((row) => (
                                    <tr key={row.id} className="hover:bg-slate-50 transition-colors border-b border-slate-50 group cursor-pointer">
                                        <td className="py-4 pl-4 font-bold text-slate-900 group-hover:text-primary transition-colors">{row.title}</td>
                                        <td className="py-4 text-slate-500 font-medium">
                                            <span className="bg-slate-100 px-2 py-1 rounded-md text-slate-600 text-xs">{row.className}</span>
                                        </td>
                                        <td className="py-4 text-slate-500">{row.teacherName}</td>
                                        <td className="py-4 text-slate-500 font-medium">{new Date(row.dueDate).toLocaleDateString()}</td>
                                        <td className="py-4 pr-4 border-none flex justify-end">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${getStatusColor(row.status)}`}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center">
                                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-3 border border-slate-100">
                                                <span className="material-symbols-outlined text-3xl text-slate-300">task</span>
                                            </div>
                                            <p className="font-bold text-slate-600">No Assignments Found</p>
                                            <p className="text-sm text-slate-400 mt-1">Get started by creating a new assignment.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-red-50 p-7 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-red-100 relative overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-100 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shadow-inner">
                                    <span className="material-symbols-outlined">notification_important</span>
                                </div>
                                {(attention.students.length > 0 || attention.teachers.length > 0) && (
                                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
                                    </span>
                                )}
                            </div>
                            <h3 className="font-extrabold text-xl text-slate-900">Needs Attention</h3>
                        </div>
                        <button 
                            onClick={() => router.push('/dashboard/messages')}
                            className="text-slate-400 hover:text-slate-800 transition-colors bg-white w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center shadow-sm"
                            title="Go to messages"
                        >
                            <span className="material-symbols-outlined text-sm">more_horiz</span>
                        </button>
                    </div>
                    <div className="space-y-3 relative z-10">
                        {(attention.students.length > 0 || attention.teachers.length > 0) ? (
                            <>
                                {attention.students.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:border-red-200 hover:shadow-md transition-all duration-300 group cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center border border-red-200 group-hover:scale-110 transition-transform">
                                                <span className="material-symbols-outlined text-[22px]">person</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-slate-900">{item.name}</h4>
                                                <p className="text-xs text-slate-500">{item.className} • {item.issue}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); router.push('/dashboard/messages'); }}
                                            className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 text-slate-500 flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 shadow-sm"
                                            title="Message student"
                                        >
                                            <span className="material-symbols-outlined text-lg">mail</span>
                                        </button>
                                    </div>
                                ))}
                                {attention.teachers.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:border-orange-200 hover:shadow-md transition-all duration-300 group cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center border border-orange-200 group-hover:scale-110 transition-transform">
                                                <span className="material-symbols-outlined text-[22px]">school</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-slate-900">{item.name}</h4>
                                                <p className="text-xs text-orange-600">Teacher • {item.issue}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); router.push('/dashboard/messages'); }}
                                            className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 text-slate-500 flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300 shadow-sm"
                                            title="Message teacher"
                                        >
                                            <span className="material-symbols-outlined text-lg">mail</span>
                                        </button>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div className="text-center py-12 bg-white/50 backdrop-blur border border-green-100 rounded-2xl shadow-[inset_0_2px_10px_rgb(0,0,0,0.02)]">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 border-4 border-white shadow-sm mb-4">
                                    <span className="material-symbols-outlined text-3xl text-green-500">check_circle</span>
                                </div>
                                <h4 className="font-bold text-slate-900 text-lg">All Caught Up!</h4>
                                <p className="text-slate-500 text-sm mt-1 font-medium">No pressing issues need your attention right now.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

