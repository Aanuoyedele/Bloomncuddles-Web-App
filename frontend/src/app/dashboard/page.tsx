"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface Stats {
    classes: number;
    students: number;
    assignments: number;
    teachers: number;
    pendingInvites: number;
}

export default function DashboardOverview() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await api.get('/stats');
                setStats(data);
            } catch (err) {
                console.error('Failed to load stats');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

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
                        <select className="bg-slate-50 border-slate-200 text-sm rounded-full px-3 py-1 focus:ring-0 cursor-pointer text-slate-600 outline-none">
                            <option>This Week</option>
                            <option>Last Week</option>
                        </select>
                    </div>
                    <div className="h-64 w-full flex items-end justify-between gap-2 px-2 relative">
                        {/* Grid Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                            {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-full h-px bg-slate-500"></div>)}
                        </div>

                        {/* Visual Bars Mockup */}
                        {[
                            { day: 'Mon', h: '40%' }, { day: 'Tue', h: '65%' }, { day: 'Wed', h: '55%' },
                            { day: 'Thu', h: '80%' }, { day: 'Fri', h: '70%' }
                        ].map((bar, i) => (
                            <div key={i} className="group relative flex flex-col items-center gap-2 h-full justify-end w-full">
                                <div
                                    className="w-full bg-gradient-to-t from-primary/20 to-primary/5 rounded-t-lg relative overflow-hidden transition-all duration-500 group-hover:bg-primary/30"
                                    style={{ height: bar.h }}
                                >
                                    <div className="absolute top-0 left-0 w-full h-[3px] bg-primary shadow-[0_0_15px_#486fa1]"></div>
                                </div>
                                <span className="text-xs text-slate-500 font-medium">{bar.day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Avg Scores */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg text-slate-900">Avg. Scores</h3>
                        <button className="text-primary text-sm font-semibold hover:text-primary/80 transition-colors">View All</button>
                    </div>
                    <div className="flex flex-col justify-center gap-6">
                        {[
                            { subject: 'Mathematics', score: '92%', color: 'bg-primary' },
                            { subject: 'Science', score: '85%', color: 'bg-secondary' },
                            { subject: 'English', score: '78%', color: 'bg-yellow-400' },
                            { subject: 'History', score: '88%', color: 'bg-emerald-500' }
                        ].map((item, i) => (
                            <div key={i} className="group">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium text-slate-900">{item.subject}</span>
                                    <span className="text-slate-500 font-semibold">{item.score}</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                    <div className={`${item.color} h-full rounded-full transition-all duration-1000 group-hover:opacity-90`} style={{ width: item.score }}></div>
                                </div>
                            </div>
                        ))}
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
                                    <th className="pb-3 font-bold opacity-70">Due Date</th>
                                    <th className="pb-3 font-bold opacity-70 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {[
                                    { title: 'Solar System Project', class: 'Class 5B', due: 'Oct 24, 2023', status: 'Active', statusColor: 'bg-green-100 text-green-700' },
                                    { title: 'Spelling Bee Prep', class: 'Class 3A', due: 'Oct 22, 2023', status: 'Grading', statusColor: 'bg-yellow-100 text-yellow-700' },
                                    { title: 'Fractions Worksheet', class: 'Class 4C', due: 'Oct 20, 2023', status: 'Completed', statusColor: 'bg-slate-100 text-slate-600' }
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50/80 transition-colors border-b border-transparent hover:border-slate-100 rounded-lg">
                                        <td className="py-4 pl-2 font-semibold text-slate-900">{row.title}</td>
                                        <td className="py-4 text-slate-500">{row.class}</td>
                                        <td className="py-4 text-slate-500">{row.due}</td>
                                        <td className="py-4 text-right">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${row.statusColor}`}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
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
                        {[
                            { name: 'Liam Johnson', meta: 'Class 5B • Math', score: '42%', scoreLabel: 'text-red-500', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxEIne1RVpnkugFNu61GTZHUqcEL8uof-zy7zDKHWYH3rFE02lyWt-8RRqrdltoyotJYzIzg5X8J-DQYguB8vnIyGkzLcaYwEBxzFcDpKqm-Pwi_tEd3WiiUiank5MgbH2DpbSaDr3Z9DAR3j1cVYTNxRy9zrfzNDN_u_SPr8qQ7m0_Ms6n4OzbcmycAQ42F1knLwHzk1iIR4D5ITu3p9iv80tYJTTQMymvH34Ffw59OJ2YaERN2ERrj1oUys-jFtuiT6tY-Auh-Kn' },
                            { name: 'Emma Williams', meta: 'Class 3A • Science', score: '55%', scoreLabel: 'text-secondary', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlaouFRE-v7zwb6Dc9pwbHZtoraue9nlAMj1AcuZXWq1j5bfS3RqjJZVqLOzE5onA68oJyYgzUaAkLPn3dLeGESLFu4xMlo64kqybeT72uPTaPuhYfZfs-5OrNhik4JRj5-qP5dbI6lauvdhqG1JrUGFl6mq30DrgVaj2Q20KwU5iB1kJorE6b5agbwqEQW6xIbAeFQQL1lg4moIFmR-_YNbZtHYzA0ebkuRIyh1wGmOr5rPCsDr2J4PpC5V55B_lmChwuLUTXtFTq' },
                            { name: 'Noah Brown', meta: 'Class 4C • History', score: '58%', scoreLabel: 'text-secondary', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAN3_dLRrEsVs6lid92U12ij15_-wOUUcVoDN9M73_LZ4q06rlFe15JHLAbqUvYY-0ARoIVL2Oz9s3PcGB0N17NohnZn-rPeb4G3vih8-deCBmtEL4PzRlUeGF9sxsas3Se1phzMXVZa2PoQbgBt5ljbjALAhNjYmqx1MNzSqKSxE_SM5lRECZtvSXui7HgQ_sMjxUde29lBkjCyFCKaKfvGI1OCQHXWqO5krkDgvIIu0Hc7BLetK6bejOn9kVzTvgQPQLHYLn-odsH' }
                        ].map((student, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-200">
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={student.avatar}
                                        alt={student.name}
                                        width={40}
                                        height={40}
                                        className="rounded-full object-cover ring-2 ring-white"
                                    />
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-900">{student.name}</h4>
                                        <p className="text-xs text-slate-500">{student.meta}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className={`text-sm font-bold ${student.scoreLabel}`}>{student.score}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">Avg Score</p>
                                    </div>
                                    <button className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-200">
                                        <span className="material-symbols-outlined text-sm">mail</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
