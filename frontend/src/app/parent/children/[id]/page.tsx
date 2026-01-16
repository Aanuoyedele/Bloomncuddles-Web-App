"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

interface StudentDetails {
    id: string;
    name: string;
    grade: string;
    className: string;
    teacherName: string;
    assignments: any[];
    recentGrades: any[];
}

export default function ChildProgressPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [student, setStudent] = useState<StudentDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStudentDetails();
    }, []);

    const fetchStudentDetails = async () => {
        try {
            // Fetch student data
            const data = await api.get(`/students/${resolvedParams.id}`);
            setStudent(data);
        } catch (err) {
            console.error('Failed to fetch student details:', err);
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

    if (!student) {
        return (
            <div className="text-center py-20">
                <span className="text-5xl mb-4 block">😕</span>
                <h2 className="text-xl font-bold text-slate-700">Student not found</h2>
                <Link href="/parent" className="text-primary font-bold mt-4 inline-block">
                    ← Back to Overview
                </Link>
            </div>
        );
    }

    // Mock subject data for demo
    const subjects = [
        { name: 'Phonics', progress: 75, level: 'PHNIIC LOFLS', modules: '12/15 Modules', color: 'bg-pink-100 text-pink-600' },
        { name: 'Maths', progress: 60, level: 'Addition & Subtraction', modules: '9/15 Modules', color: 'bg-blue-100 text-blue-600' },
        { name: 'Reading', progress: 45, level: 'Chapter Books', modules: '7/15 Modules', color: 'bg-orange-100 text-orange-600' },
    ];

    const teacherLinks = [
        { title: 'Phonics Sheet - Vol. 4', icon: '📄' },
        { title: 'Karakter Sounds', icon: '🔊' },
        { title: 'Weekend Reading List', icon: '📚' },
    ];

    return (
        <div className="space-y-6 max-w-6xl">
            {/* Back Button */}
            <Link
                href="/parent"
                className="inline-flex items-center gap-2 text-slate-600 hover:text-primary font-medium transition-colors"
            >
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                Back to Overview
            </Link>

            {/* Student Header */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                            {student.name.charAt(0).toUpperCase()}
                        </div>

                        {/* Info */}
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">{student.name}</h1>
                            <p className="text-slate-500">
                                {student.grade} • Spring Term • {student.className || 'Class A'}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-600 text-xs font-bold rounded-full">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                    13 Badges Earned
                                </span>
                                <span className="text-xs text-slate-400">• Last online: Today, 09:52 am</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">download</span>
                            Download Report
                        </button>
                        <button className="px-4 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">mail</span>
                            Message Teacher
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Subject Overviews - Takes 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-800">Subject Overviews</h2>
                        <button className="text-primary text-sm font-bold hover:underline">See all subjects</button>
                    </div>

                    <div className="space-y-4">
                        {subjects.map((subject) => (
                            <div key={subject.name} className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-lg transition-all">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="font-bold text-slate-800 mb-1">{subject.name}</h3>
                                        <p className="text-sm text-slate-500">{subject.level}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${subject.color}`}>
                                        {subject.modules}
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-3">
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <span className="text-slate-500">Progress</span>
                                        <span className="font-bold text-slate-700">{subject.progress}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500"
                                            style={{ width: `${subject.progress}%` }}
                                        />
                                    </div>
                                </div>

                                <button className="text-primary text-sm font-bold hover:underline">
                                    View Curriculum →
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Teacher Links */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-5">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-[20px]">link</span>
                            Teacher Links
                        </h3>
                        <div className="space-y-3">
                            {teacherLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                    <span className="text-xl">{link.icon}</span>
                                    <span className="text-sm font-medium text-slate-700">{link.title}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Engagement Stats */}
                    <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-5">
                        <h3 className="font-bold text-slate-800 mb-4">Engagement Stats</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">Library Time</span>
                                <span className="font-bold text-slate-800">4.3h</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">Mood</span>
                                <span className="text-xl">😊</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">Report Grade</span>
                                <span className="font-bold text-green-600">Excellent</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Stats */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div>
                        <p className="text-3xl font-bold text-slate-800">98.5%</p>
                        <p className="text-sm text-slate-500">Attendance</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-slate-800">12 Dec</p>
                        <p className="text-sm text-slate-500">Last Assessment</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-green-600">Excellent</p>
                        <p className="text-sm text-slate-500">Report Grade</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-slate-800">🔥 5</p>
                        <p className="text-sm text-slate-500">Day Streak</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
