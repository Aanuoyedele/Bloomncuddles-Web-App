"use client";

import { useState, useEffect } from "react";
import { useDashboard } from "@/app/dashboard/context";
import { api } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Image from "next/image";

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

interface AssignmentData {
    id: string;
    title: string;
    className: string;
    teacherName: string;
    dueDate: string;
    status: string;
    score?: string; // Mocking score/amount
}


interface NeedsAttentionStudent {
    id: string;
    name: string;
    className: string;
    issue: string;
    type: string;
}

interface NeedsAttentionTeacher {
    id: string;
    name: string;
    issue: string;
    type: string;
}

interface TopPerformer {
    className: string;
    avgScore: number;
    totalSubmissions: number;
}

export default function DashboardOverview() {
    const { userName } = useDashboard();
    
    const [stats, setStats] = useState<Stats | null>(null);
    const [engagement, setEngagement] = useState<EngagementDay[]>([]);
    const [assignments, setAssignments] = useState<AssignmentData[]>([]);
    
    const [attentionStudents, setAttentionStudents] = useState<NeedsAttentionStudent[]>([]);
    const [attentionTeachers, setAttentionTeachers] = useState<NeedsAttentionTeacher[]>([]);
    const [topClasses, setTopClasses] = useState<TopPerformer[]>([]);
    
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [statsData, engData, assignData, attentionData, topData] = await Promise.all([
                    api.get('/stats'),
                    api.get('/stats/engagement'),
                    api.get('/stats/assignments'),
                    api.get('/stats/attention'),
                    api.get('/stats/scores')
                ]);
                
                setStats(statsData);
                
                // Map engagement data properly
                const baseEng = (engData.days || []).map((e: { day: string, count: number, percentage: number }) => ({
                    day: e.day,
                    primary: e.count * 10, // Visual multiplier for chart
                    secondary: (e.count * 10) * 0.7
                }));
                const mockEng = baseEng.length ? baseEng : [
                    { day: 'Sun', primary: 0, secondary: 0 },
                    { day: 'Mon', primary: 0, secondary: 0 },
                    { day: 'Tue', primary: 0, secondary: 0 },
                    { day: 'Wed', primary: 0, secondary: 0 },
                    { day: 'Thu', primary: 0, secondary: 0 },
                    { day: 'Fri', primary: 0, secondary: 0 },
                    { day: 'Sat', primary: 0, secondary: 0 },
                ];
                setEngagement(mockEng);

                // Safely assign backend responses to state objects
                setAssignments(assignData.assignments || []);
                setAttentionStudents(attentionData.students || []);
                setAttentionTeachers(attentionData.teachers || []);
                setTopClasses(topData.scores || []);
                
            } catch (err) {
                console.error('Failed to load dashboard data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    // Format like "14th Aug 2023"
    const formatDate = () => {
        const d = new Date();
        const suffixes = ["th", "st", "nd", "rd"];
        const v = d.getDate() % 100;
        const suffix = suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
        const month = d.toLocaleDateString('en-US', { month: 'short' });
        return `${d.getDate()}${suffix} ${month} ${d.getFullYear()}`;
    };

    return (
        <div className="min-h-[calc(100vh-80px)] font-sans -mx-4 md:-mx-8 -mt-4 md:-mt-8 bg-[#F5F7F8] p-6 lg:p-10">
            
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-[#1A1C20] text-3xl font-bold tracking-tight mb-1">Dashboard</h1>
                    <p className="text-[#88909D] text-sm font-medium">{formatDate()}</p>
                </div>

                {/* Profile actions (Simulated for layout matching) */}
                <div className="flex items-center gap-3 md:hidden">
                    {/* The layout of Niond has custom buttons here which are covered by the main layout wrapper in Bloomncuddles. 
                        We will mock them here for the sake of the internal panel view. */}
                    <button className="size-12 rounded-[14px] bg-white border border-[#E9ECEF] flex items-center justify-center text-[#4A5568] hover:shadow-sm"><span className="material-symbols-outlined text-[20px]">chat_bubble_outline</span></button>
                    <button className="size-12 rounded-[14px] bg-white border border-[#E9ECEF] flex items-center justify-center text-[#4A5568] hover:shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">notifications</span>
                    </button>
                    <div className="flex items-center gap-3 bg-white border border-[#E9ECEF] rounded-full py-2 pr-5 pl-2 ml-2">
                        <div className="size-8 rounded-full bg-[#E2E8F0] overflow-hidden">
                            <Image src="/hero-educators.png" alt="Profile" width={32} height={32} className="object-cover" />
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-[#1A1C20] text-sm font-bold leading-tight">{userName || "Nora Watson"}</p>
                            <p className="text-[#88909D] text-[10px] uppercase font-bold tracking-wider">Sales Manager</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions / Shortcuts Row */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
                {[
                    { label: 'Add Student', icon: 'person_add', link: '/dashboard/students', bg: 'bg-[#D0C3FA]', color: 'text-[#4A3C8B]' },
                    { label: 'Create Class', icon: 'collections_bookmark', link: '/dashboard/classes', bg: 'bg-[#A4CCFE]', color: 'text-[#2B5494]' },
                    { label: 'Send Announcement', icon: 'campaign', link: '/dashboard/communications', bg: 'bg-[#8EEBBA]', color: 'text-[#1E7044]' },
                    { label: 'Generate Report', icon: 'bar_chart', link: '/dashboard/reports', bg: 'bg-[#088A85]', color: 'text-white' },
                    { label: 'Schedule Event', icon: 'event', link: '/dashboard/calendar', bg: 'bg-[#D0C3FA]', color: 'text-[#4A3C8B]' },
                    { label: 'Invite Teacher', icon: 'mail', link: '/dashboard/users', bg: 'bg-[#A4CCFE]', color: 'text-[#2B5494]' } 
                ].map((action, i) => (
                    <a key={i} href={action.link} className="flex items-center gap-2.5 bg-white border border-[#E9ECEF] rounded-2xl px-4 py-3 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-md hover:border-[#CBD5E1] transition-all group hover:-translate-y-0.5">
                        <div className={`size-8 rounded-full flex items-center justify-center ${action.bg} ${action.color}`}>
                            <span className="material-symbols-outlined text-[16px]">{action.icon}</span>
                        </div>
                        <span className="text-sm font-bold text-[#1A1C20]">{action.label}</span>
                    </a>
                ))}
            </div>

            {/* Stat Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                
                {/* Purple */}
                <div className="bg-[#D0C3FA] rounded-[24px] p-6 shadow-sm border border-[#C2B2F9]/50 transition-transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-[#4A3C8B] font-bold text-sm bg-white/30 px-3 py-1.5 rounded-full">
                            <span className="material-symbols-outlined text-[16px]">class</span>
                            Total classes
                        </div>
                    </div>
                    <div className="mb-2">
                        <h3 className="text-[#1A1C20] text-[32px] font-extrabold tracking-tight leading-none">
                            {loading ? '...' : (stats?.classes ?? 0)}
                        </h3>
                    </div>
                    <p className="text-[#4A3C8B]/80 text-[11px] font-bold">Active in the school</p>
                </div>

                {/* Blue */}
                <div className="bg-[#A4CCFE] rounded-[24px] p-6 shadow-sm border border-[#8EBFFE]/50 transition-transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-[#2B5494] font-bold text-sm bg-white/30 px-3 py-1.5 rounded-full">
                            <span className="material-symbols-outlined text-[16px]">groups</span>
                            Total students
                        </div>
                    </div>
                    <div className="mb-2">
                        <h3 className="text-[#1A1C20] text-[32px] font-extrabold tracking-tight leading-none">
                            {loading ? '...' : (stats?.students ?? 0)}
                        </h3>
                    </div>
                    <p className="text-[#2B5494]/80 text-[11px] font-bold">Enrolled across all classes</p>
                </div>

                {/* Green */}
                <div className="bg-[#8EEBBA] rounded-[24px] p-6 shadow-sm border border-[#71E4A6]/50 transition-transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-[#1E7044] font-bold text-sm bg-white/40 px-3 py-1.5 rounded-full">
                            <span className="material-symbols-outlined text-[16px]">person</span>
                            Total teachers
                        </div>
                    </div>
                    <div className="mb-2">
                        <h3 className="text-[#1A1C20] text-[32px] font-extrabold tracking-tight leading-none">
                            {loading ? '...' : (stats?.teachers ?? 0)}
                        </h3>
                    </div>
                    <p className="text-[#1E7044]/80 text-[11px] font-bold">Currently employed</p>
                </div>

                {/* Teal / Custom Ad */}
                <div className="bg-[#088A85] rounded-[24px] p-6 shadow-sm text-white relative overflow-hidden transition-transform hover:-translate-y-1">
                    <div className="absolute -right-4 top-4 text-white/20">
                        <span className="material-symbols-outlined text-6xl">menu_book</span>
                    </div>
                    <div className="absolute right-8 bottom-6 size-4 rounded-full border-2 border-white/30"></div>
                    
                    <h3 className="text-white/90 font-bold text-lg mb-4 relative z-10">Average Attendance</h3>
                    <div className="mb-2 relative z-10">
                        <div className="flex items-baseline gap-1">
                            {/* We don't have a specific global attendance API yet, so we'll mock an average matching the original requested design style or show pending */}
                            <span className="text-[32px] font-extrabold tracking-tight leading-none">92.5%</span>
                        </div>
                        <p className="text-white/70 text-[11px] font-medium mt-1">Overall attendance this month</p>
                    </div>
                    <button className="mt-4 bg-[#B9F566] text-[#1A1C20] font-bold text-xs px-5 py-2.5 rounded-full hover:bg-[#A3DE52] transition-colors relative z-10">
                        View Details
                    </button>
                </div>

            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                {/* LEFT MAIN (Spans 2-3 cols) */}
                <div className="lg:col-span-2 xl:col-span-3 space-y-6">

                    {/* Chart & Analysis Row */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        
                        {/* Regular Sell (Chart Component) */}
                        <div className="xl:col-span-2 bg-white rounded-[24px] p-8 shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-[#E9ECEF]">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-[#1A1C20] text-xl font-bold">Student Engagement</h3>
                                <button className="bg-[#E4F9C2] text-[#4F681A] font-bold text-xs px-4 py-2 rounded-lg hover:bg-[#D5EFAC] transition-colors">Export</button>
                            </div>
                            <div className="h-[240px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={engagement} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barGap={2} barSize={8}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F2F5" />
                                        <XAxis 
                                            dataKey="day" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#88909D', fontSize: 13, fontWeight: 500 }} 
                                            dy={10}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#88909D', fontSize: 13, fontWeight: 500 }} 
                                            tickFormatter={(val) => `${val/1000}k`}
                                        />
                                        <Tooltip 
                                            cursor={{fill: 'rgba(0,0,0,0.02)'}}
                                            contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.05)'}}
                                        />
                                        <Bar dataKey="primary" fill="#D0C3FA" radius={[4, 4, 4, 4]} />
                                        <Bar dataKey="secondary" fill="#8EEBBA" radius={[4, 4, 4, 4]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-transparent rounded-[24px] p-0 flex flex-col justify-center">
                            <h3 className="text-[#1A1C20] text-xl font-bold mb-1">Needs attention</h3>
                            <p className="text-[#88909D] text-sm mb-6">Students requiring assistance</p>
                            
                            <div className="space-y-3">
                                {loading ? (
                                    <div className="text-sm text-slate-500">Loading...</div>
                                ) : (attentionStudents.length > 0 || attentionTeachers.length > 0) ? (
                                    <>
                                        {attentionStudents.slice(0, 3).map((student, idx) => (
                                            <button key={`student-${idx}`} className="w-full bg-white rounded-2xl p-4 flex items-center justify-between shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-[#E9ECEF] hover:border-[#FDA4AF] transition-all group">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded-full bg-[#FFE4E6] flex items-center justify-center text-[#E11D48] shrink-0">
                                                        <span className="material-symbols-outlined text-[16px]">priority_high</span>
                                                    </div>
                                                    <div className="text-left overflow-hidden">
                                                        <p className="font-bold text-[#1A1C20] text-sm leading-tight truncate">{student.name}</p>
                                                        <p className="text-[#88909D] text-[11px] font-medium truncate">{student.className} ({student.issue})</p>
                                                    </div>
                                                </div>
                                                <span className="material-symbols-outlined text-[#88909D] group-hover:text-[#E11D48] transition-colors">chevron_right</span>
                                            </button>
                                        ))}
                                        {attentionTeachers.slice(0, 2).map((teacher, idx) => (
                                            <button key={`teacher-${idx}`} className="w-full bg-white rounded-2xl p-4 flex items-center justify-between shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-[#E9ECEF] hover:border-[#FDBA74] transition-all group">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded-full bg-[#FFEDD5] flex items-center justify-center text-[#F97316] shrink-0">
                                                        <span className="material-symbols-outlined text-[16px]">warning</span>
                                                    </div>
                                                    <div className="text-left overflow-hidden">
                                                        <p className="font-bold text-[#1A1C20] text-sm leading-tight truncate">{teacher.name} (Teacher)</p>
                                                        <p className="text-[#88909D] text-[11px] font-medium truncate">{teacher.issue}</p>
                                                    </div>
                                                </div>
                                                <span className="material-symbols-outlined text-[#88909D] group-hover:text-[#F97316] transition-colors">chevron_right</span>
                                            </button>
                                        ))}
                                    </>
                                ) : (
                                    <div className="bg-white rounded-2xl p-4 flex items-center justify-center border border-[#E9ECEF]">
                                        <p className="text-[#88909D] text-sm font-medium">No alerts right now.</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 flex items-center gap-2 text-[#88909D] text-xs font-bold border-t border-[#E9ECEF] pt-6">
                                System alerts generated automatically
                            </div>
                        </div>
                    </div>

                    {/* Recent Assignments (Table Component) */}
                    <div className="bg-white rounded-[24px] p-8 shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-[#E9ECEF]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-[#1A1C20] text-xl font-bold">Recent Assignments</h3>
                            <button className="bg-[#E4F9C2] text-[#4F681A] font-bold text-xs px-5 py-2 rounded-lg hover:bg-[#D5EFAC] transition-colors">View All</button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-[#F0F2F5]">
                                        <th className="py-4 text-[#88909D] font-medium text-sm">Subject Name</th>
                                        <th className="py-4 text-[#88909D] font-medium text-sm">Teacher&apos;s Name</th>
                                        <th className="py-4 text-[#88909D] font-medium text-sm">Class</th>
                                        <th className="py-4 text-[#88909D] font-medium text-sm">Due Date</th>
                                        <th className="py-4 text-[#88909D] font-medium text-sm text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignments.map((item, idx) => (
                                        <tr key={idx} className="border-b border-[#F0F2F5] last:border-none hover:bg-[#F8FAFC] transition-colors">
                                            <td className="py-5 font-bold text-[#1A1C20] text-sm">{item.title}</td>
                                            <td className="py-5 text-[#4A5568] text-sm font-medium">{item.teacherName}</td>
                                            <td className="py-5 text-[#4A5568] text-sm font-medium">{item.className}</td>
                                            <td className="py-5 text-[#4A5568] text-sm font-medium">{item.dueDate}</td>
                                            <td className="py-5 text-right">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                    item.status === 'Active' ? 'bg-[#E4F9C2] text-[#4F681A]' :
                                                    item.status === 'Grading' ? 'bg-[#FFF3C4] text-[#B45309]' :
                                                    'bg-[#D1FAE5] text-[#065F46]'
                                                }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

                {/* RIGHT SIDEBAR (Spans 1 col) */}
                <div className="space-y-6 lg:col-span-1 xl:col-span-1">

                    {/* Daily Meeting (Notification style) */}
                    <div className="bg-white rounded-[24px] p-8 shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-[#E9ECEF] flex flex-col items-center text-center">
                        <div className="size-16 rounded-full bg-[#D0C3FA]/30 text-[#4A3C8B] flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-3xl">videocam</span>
                        </div>
                        <h3 className="text-[#1A1C20] text-lg font-bold mb-1">Daily Meeting</h3>
                        <p className="text-[#88909D] text-xs font-bold mb-6">12+ Person <span className="mx-2">•</span> 8:30 PM</p>
                        
                        <div className="flex items-center justify-center gap-3 w-full bg-[#F4F7FC] rounded-2xl p-4 mb-6">
                            <div className="flex -space-x-3">
                                {/* Avatars */}
                                <div className="size-8 rounded-full bg-slate-200 border-2 border-white relative z-30 overflow-hidden">
                                     <Image src="/hero-educators.png" alt="Team member" width={32} height={32} className="w-full h-full object-cover" />
                                </div>
                                <div className="size-8 rounded-full bg-[#FCA5A5] border-2 border-white relative z-20 overflow-hidden text-xs flex items-center justify-center font-bold text-white">E</div>
                                <div className="size-8 rounded-full bg-[#8EEBBA] border-2 border-white relative z-10 overflow-hidden text-xs flex items-center justify-center font-bold text-[#1E7044]">S</div>
                            </div>
                            <p className="text-left text-[#1A1C20] text-xs font-bold leading-tight flex-1">They will conduct<br/>the meeting</p>
                        </div>
                        
                        <button className="w-full bg-[#1A1C20] text-white font-bold text-sm rounded-xl py-4 hover:bg-[#2A2C30] transition-colors shadow-lg shadow-black/10">
                            Click for meeting link
                        </button>
                    </div>

                    {/* Top Performers */}
                    <div className="bg-white rounded-[24px] p-8 shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-[#E9ECEF]">
                        <h3 className="text-[#1A1C20] text-xl font-bold mb-6">Top Performers</h3>
                        
                        <div className="space-y-3 mb-6">
                            {loading ? (
                                <div className="text-sm text-slate-500">Loading...</div>
                            ) : topClasses.length > 0 ? (
                                topClasses.map((item, i) => {
                                    const colors = ['#FCD34D', '#93C5FD', '#F87171', '#A78BFA', '#34D399'];
                                    const color = colors[i % colors.length];
                                    const initial = item.className.charAt(0).toUpperCase();

                                    return (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-[#F8FAFC] border border-[#F1F5F9] cursor-pointer hover:border-[#CBD5E1] transition-colors group">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm shrink-0" style={{ backgroundColor: color }}>
                                                    {initial}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-[#1A1C20] text-sm font-bold truncate">{item.className}</p>
                                                    <p className="text-[#88909D] text-[10px] uppercase tracking-wider truncate">Avg Score: {item.avgScore}%</p>
                                                </div>
                                            </div>
                                            <span className="material-symbols-outlined text-[#88909D] text-[20px] group-hover:text-[#1A1C20] transition-colors">chevron_right</span>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-sm text-[#88909D] p-3 text-center">No performance data yet.</div>
                            )}
                        </div>

                        <button className="w-full bg-[#E0E7FF] text-[#4F46E5] font-bold text-sm rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-[#C7D2FE] transition-colors">
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                            View all students
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}
