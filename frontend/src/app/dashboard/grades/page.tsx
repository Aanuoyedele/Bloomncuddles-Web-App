"use client";

import { useDashboard } from "../context";
import { useState, useEffect } from "react";

interface Grade {
    id: string;
    assignmentTitle: string;
    className: string;
    grade: string | null;
    feedback: string | null;
    status: string;
    submittedAt: string | null;
    dueDate: string;
}

export default function GradesPage() {
    const { userRole } = useDashboard();
    const [grades, setGrades] = useState<Grade[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Fetch actual grades from API
        // For now, using placeholder data
        const mockGrades: Grade[] = [
            {
                id: '1',
                assignmentTitle: 'Math Homework - Chapter 5',
                className: 'Mathematics 101',
                grade: 'A',
                feedback: 'Excellent work! Great understanding of the concepts.',
                status: 'GRADED',
                submittedAt: '2024-12-20T14:30:00Z',
                dueDate: '2024-12-21T23:59:00Z'
            },
            {
                id: '2',
                assignmentTitle: 'Reading Comprehension Quiz',
                className: 'English Language Arts',
                grade: 'B+',
                feedback: 'Good effort! Work on your analysis skills.',
                status: 'GRADED',
                submittedAt: '2024-12-18T10:00:00Z',
                dueDate: '2024-12-19T23:59:00Z'
            },
            {
                id: '3',
                assignmentTitle: 'Science Project Proposal',
                className: 'Science',
                grade: null,
                feedback: null,
                status: 'PENDING',
                submittedAt: '2024-12-22T09:00:00Z',
                dueDate: '2024-12-25T23:59:00Z'
            },
        ];

        setTimeout(() => {
            setGrades(mockGrades);
            setLoading(false);
        }, 500);
    }, []);

    // Only students should see this page
    if (userRole !== 'Student') {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">lock</span>
                <h2 className="text-xl font-bold text-slate-700 mb-2">Access Restricted</h2>
                <p className="text-slate-500">This page is only available for students.</p>
            </div>
        );
    }

    const getGradeColor = (grade: string | null) => {
        if (!grade) return 'bg-slate-100 text-slate-500';
        if (grade.startsWith('A')) return 'bg-green-100 text-green-700';
        if (grade.startsWith('B')) return 'bg-blue-100 text-blue-700';
        if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-700';
        if (grade.startsWith('D')) return 'bg-orange-100 text-orange-700';
        return 'bg-red-100 text-red-700';
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'GRADED':
                return <span className="px-2 py-1 text-xs font-bold rounded-full bg-green-100 text-green-700">Graded</span>;
            case 'PENDING':
                return <span className="px-2 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-700">Pending Review</span>;
            case 'SUBMITTED':
                return <span className="px-2 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-700">Submitted</span>;
            default:
                return <span className="px-2 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-600">{status}</span>;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Grades</h1>
                    <p className="text-slate-500 mt-1">Track your academic progress and feedback</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                        <p className="text-xs font-bold text-slate-500 uppercase">Average</p>
                        <p className="text-2xl font-bold text-primary">A-</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                        <p className="text-xs font-bold text-slate-500 uppercase">Completed</p>
                        <p className="text-2xl font-bold text-green-600">{grades.filter(g => g.status === 'GRADED').length}/{grades.length}</p>
                    </div>
                </div>
            </div>

            {/* Grades List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100">
                    {grades.length === 0 ? (
                        <div className="p-8 text-center">
                            <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">assignment</span>
                            <h3 className="text-lg font-bold text-slate-700 mb-2">No Grades Yet</h3>
                            <p className="text-slate-500">Complete some assignments to see your grades here!</p>
                        </div>
                    ) : (
                        grades.map((grade) => (
                            <div key={grade.id} className="p-5 hover:bg-slate-50 transition-colors">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    {/* Grade Circle */}
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl ${getGradeColor(grade.grade)}`}>
                                        {grade.grade || '—'}
                                    </div>

                                    {/* Assignment Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="font-bold text-slate-900">{grade.assignmentTitle}</h3>
                                            {getStatusBadge(grade.status)}
                                        </div>
                                        <p className="text-sm text-slate-500 mt-1">
                                            <span className="material-symbols-outlined text-[16px] align-middle mr-1">class</span>
                                            {grade.className}
                                        </p>
                                        {grade.feedback && (
                                            <p className="text-sm text-slate-600 mt-2 bg-slate-50 rounded-lg p-3">
                                                <span className="material-symbols-outlined text-[16px] align-middle mr-1 text-primary">chat</span>
                                                {grade.feedback}
                                            </p>
                                        )}
                                    </div>

                                    {/* Date Info */}
                                    <div className="text-right text-sm text-slate-500">
                                        {grade.submittedAt && (
                                            <p>
                                                <span className="font-medium">Submitted:</span>{' '}
                                                {new Date(grade.submittedAt).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
