"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";

interface ReportData {
    stats: {
        classAverage: number;
        completionRate: number;
        needsAttention: number;
    };
    weeklyPerformance: { week: string; avg: number }[];
    classBreakdown: { name: string; avg: number }[];
    studentProgress: {
        id: string;
        name: string;
        className: string;
        avgScore: number;
        completed: number;
        total: number;
        missing: number;
        status: string;
        statusColor: string;
    }[];
    classes: { id: string; name: string }[];
}

export default function ReportsPage() {
    const [data, setData] = useState<ReportData | null>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('30');
    const [classFilter, setClassFilter] = useState('all');
    const [showPeriodMenu, setShowPeriodMenu] = useState(false);
    const [showClassMenu, setShowClassMenu] = useState(false);
    const [exporting, setExporting] = useState(false);
    const reportRef = useRef<HTMLDivElement>(null);

    const periodOptions = [
        { label: 'Last 7 Days', value: '7' },
        { label: 'Last 30 Days', value: '30' },
        { label: 'Last 90 Days', value: '90' },
        { label: 'Last Year', value: '365' }
    ];

    const fetchReportData = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({ period, classId: classFilter });
            const result = await api.get(`/reports?${params.toString()}`);
            setData(result);
        } catch (err) {
            console.error('Failed to load reports:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReportData();
    }, [period, classFilter]);

    const handleExportPDF = async () => {
        setExporting(true);
        try {
            // Use browser print dialog for PDF
            window.print();
        } finally {
            setExporting(false);
        }
    };

    const selectedPeriod = periodOptions.find(p => p.value === period)?.label || 'Last 30 Days';
    const selectedClass = data?.classes.find(c => c.id === classFilter)?.name || 'All Classes';

    const colors = ['bg-primary', 'bg-secondary', 'bg-blue-400', 'bg-teal-500', 'bg-purple-500', 'bg-orange-400'];
    const textColors = ['text-primary', 'text-secondary', 'text-blue-400', 'text-teal-500', 'text-purple-500', 'text-orange-400'];

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 print:space-y-4" ref={reportRef}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 print:hidden">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-display">Reports</h1>
                    <p className="text-slate-500 text-base mt-2">Performance metrics for {selectedPeriod.toLowerCase()}.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExportPDF}
                        disabled={exporting}
                        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">download</span>
                        {exporting ? 'Exporting...' : 'Export PDF'}
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 print:hidden">
                {/* Class Filter */}
                <div className="relative">
                    <button
                        onClick={() => { setShowClassMenu(!showClassMenu); setShowPeriodMenu(false); }}
                        className="flex h-9 items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 pl-4 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        Class: {classFilter === 'all' ? 'All Classes' : selectedClass}
                        <span className="material-symbols-outlined text-[20px] text-slate-400">expand_more</span>
                    </button>
                    {showClassMenu && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-[160px]">
                            <button
                                onClick={() => { setClassFilter('all'); setShowClassMenu(false); }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${classFilter === 'all' ? 'font-bold text-primary' : 'text-slate-700'}`}
                            >
                                All Classes
                            </button>
                            {data?.classes.map(cls => (
                                <button
                                    key={cls.id}
                                    onClick={() => { setClassFilter(cls.id); setShowClassMenu(false); }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${classFilter === cls.id ? 'font-bold text-primary' : 'text-slate-700'}`}
                                >
                                    {cls.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Period Filter */}
                <div className="relative ml-auto">
                    <button
                        onClick={() => { setShowPeriodMenu(!showPeriodMenu); setShowClassMenu(false); }}
                        className="flex h-9 items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 pl-4 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px] text-slate-500">calendar_today</span>
                        Period: {selectedPeriod}
                        <span className="material-symbols-outlined text-[20px] text-slate-400">expand_more</span>
                    </button>
                    {showPeriodMenu && (
                        <div className="absolute top-full right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-[160px]">
                            {periodOptions.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => { setPeriod(opt.value); setShowPeriodMenu(false); }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${period === opt.value ? 'font-bold text-primary' : 'text-slate-700'}`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: 'Class Average', value: `${data?.stats.classAverage || 0}%`, icon: 'school', color: 'text-primary', bg: 'bg-primary/10' },
                    { title: 'Completion Rate', value: `${data?.stats.completionRate || 0}%`, icon: 'assignment_turned_in', color: 'text-blue-600', bg: 'bg-blue-100' },
                    { title: 'Needs Attention', value: `${data?.stats.needsAttention || 0} Students`, icon: 'warning', color: 'text-secondary', bg: 'bg-secondary/10' }
                ].map((stat, i) => (
                    <div key={i} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
                                <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-bold">{stat.title}</p>
                            <p className="text-slate-900 text-3xl font-black tracking-tight mt-1">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart - Weekly Performance */}
                <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col h-96">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-lg font-bold text-slate-900">Weekly Performance</h4>
                    </div>
                    <div className="flex-1 flex items-end gap-4 relative px-2">
                        {data?.weeklyPerformance && data.weeklyPerformance.length > 0 ? (
                            data.weeklyPerformance.map((week, i) => (
                                <div key={i} className="group flex flex-col items-center flex-1 gap-2 cursor-pointer h-full justify-end">
                                    <div className="w-full bg-primary/10 rounded-t-lg group-hover:bg-primary/20 transition-all relative overflow-hidden" style={{ height: `${Math.max(week.avg, 5)}%` }}>
                                        <div className="absolute bottom-0 w-full bg-primary rounded-t-lg transition-all duration-500" style={{ height: '100%' }}></div>
                                    </div>
                                    <div className="text-center">
                                        <span className="text-xs font-bold text-slate-600">{week.avg}%</span>
                                        <span className="block text-xs font-bold text-slate-400">{week.week}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-slate-400">
                                <div className="text-center">
                                    <span className="material-symbols-outlined text-4xl">bar_chart</span>
                                    <p className="mt-2 text-sm">No performance data available</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Secondary Chart - Class Breakdown */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col h-96">
                    <h4 className="text-lg font-bold text-slate-900 mb-6">Class Breakdown</h4>
                    <div className="flex-1 flex flex-col justify-center gap-6">
                        {data?.classBreakdown && data.classBreakdown.length > 0 ? (
                            data.classBreakdown.slice(0, 5).map((item, i) => (
                                <div key={i} className="flex flex-col gap-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-bold text-slate-700">{item.name}</span>
                                        <span className={`font-bold ${textColors[i % textColors.length]}`}>{item.avg}%</span>
                                    </div>
                                    <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                                        <div className={`h-full rounded-full ${colors[i % colors.length]}`} style={{ width: `${item.avg}%` }}></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-slate-400">
                                <span className="material-symbols-outlined text-4xl">pie_chart</span>
                                <p className="mt-2 text-sm">No class data available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Student Progress List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="text-xl font-bold text-slate-900">Student Progress</h4>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    {data?.studentProgress && data.studentProgress.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Class</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Avg. Score</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Completed</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.studentProgress.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-slate-900">{student.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{student.className}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-16 rounded-full bg-slate-100 overflow-hidden">
                                                    <div className={`h-full ${student.avgScore >= 75 ? 'bg-green-500' : student.avgScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${student.avgScore}%` }}></div>
                                                </div>
                                                <span className="text-xs font-bold text-slate-600">{student.avgScore}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {student.completed}/{student.total}
                                            {student.missing > 0 && <span className="text-red-500 ml-1">({student.missing} late)</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${student.statusColor}`}>
                                                {student.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="py-12 text-center text-slate-400">
                            <span className="material-symbols-outlined text-4xl">groups</span>
                            <p className="mt-2 text-sm">No student data available</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Print styles */}
            <style jsx global>{`
                @media print {
                    body { background: white !important; }
                    .print\\:hidden { display: none !important; }
                    .print\\:space-y-4 > * + * { margin-top: 1rem; }
                }
            `}</style>
        </div>
    );
}

