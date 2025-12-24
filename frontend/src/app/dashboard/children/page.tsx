"use client";

import { useDashboard } from "../context";

export default function ChildrenPage() {
    const { userRole } = useDashboard();

    if (userRole !== 'Parent') {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <p className="text-slate-500">Access Restricted. Switch to Parent Role.</p>
            </div>
        );
    }

    const children = [
        {
            id: 1,
            name: "Leo Smith",
            grade: "Grade 5",
            school: "Bloom High School",
            avatar: "L",
            color: "bg-blue-500",
            attendance: "98%",
            avgGrade: "A-",
            nextClass: "Math 5A (09:00 AM)",
            recentActivity: "Completed Math Quiz: Fractions (90%)"
        },
        {
            id: 2,
            name: "Mia Smith",
            grade: "Grade 2",
            school: "Bloom High School",
            avatar: "M",
            color: "bg-pink-500",
            attendance: "95%",
            avgGrade: "B+",
            nextClass: "Art (10:30 AM)",
            recentActivity: "Submitted Drawing Assignment"
        }
    ];

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-display">My Children</h1>
                <p className="text-slate-500 text-base mt-2">Track the progress and activities of your children.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {children.map((child) => (
                    <div key={child.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-32 h-32 ${child.color} opacity-10 rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-500`}></div>

                        <div className="flex items-start gap-4 relative z-10">
                            <div className={`w-16 h-16 rounded-full ${child.color} flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/20`}>
                                {child.avatar}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-slate-900">{child.name}</h3>
                                <p className="text-slate-500 font-medium text-sm mb-4">{child.grade} • {child.school}</p>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <p className="text-xs text-slate-400 font-bold uppercase">Attendance</p>
                                        <p className="text-lg font-bold text-slate-700">{child.attendance}</p>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <p className="text-xs text-slate-400 font-bold uppercase">Avg. Grade</p>
                                        <p className="text-lg font-bold text-primary">{child.avgGrade}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <span className="material-symbols-outlined text-slate-400">schedule</span>
                                        <span>Next: <strong>{child.nextClass}</strong></span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <span className="material-symbols-outlined text-slate-400">history</span>
                                        <span className="truncate">{child.recentActivity}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors text-sm">
                                View Report Card
                            </button>
                            <button className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10 text-sm">
                                View Full Profile
                            </button>
                        </div>
                    </div>
                ))}

                {/* Add Child Card */}
                <button className="flex flex-col items-center justify-center min-h-[300px] rounded-2xl border-2 border-dashed border-slate-300 hover:border-primary hover:bg-primary/5 transition-all duration-300 group">
                    <div className="size-16 rounded-full bg-slate-100 group-hover:bg-white flex items-center justify-center mb-4 transition-colors shadow-sm group-hover:scale-110 duration-300">
                        <span className="material-symbols-outlined text-3xl text-slate-400 group-hover:text-primary transition-colors">add</span>
                    </div>
                    <p className="text-lg font-bold text-slate-700 group-hover:text-primary transition-colors">Link Another Child</p>
                    <p className="text-sm text-slate-500 mt-1">Use the code provided by the school</p>
                </button>
            </div>
        </div>
    );
}
