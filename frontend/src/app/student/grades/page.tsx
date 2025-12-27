"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface Submission {
    id: string;
    status: string;
    score: number | null;
    grade: string | null;
    feedback: string | null;
    submissionFileUrl: string | null;
    submittedAt: string | null;
    gradedAt: string | null;
    assignment: {
        title: string;
        description: string | null;
        dueDate: string;
        class: { name: string };
    };
}

interface GradesData {
    submissions: Submission[];
    stats: {
        total: number;
        graded: number;
        pending: number;
        submitted: number;
        averageScore: number | null;
    };
}

export default function StudentGradesPage() {
    const [data, setData] = useState<GradesData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const response = await api.get('/student/grades');
                setData(response);
            } catch (err) {
                console.error('Failed to fetch grades:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchGrades();
    }, []);

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600 bg-green-100';
        if (score >= 60) return 'text-yellow-600 bg-yellow-100';
        if (score >= 40) return 'text-orange-600 bg-orange-100';
        return 'text-red-600 bg-red-100';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">My Grades 📊</h1>
                <p className="text-slate-500">View your assignment scores and teacher feedback</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <p className="text-3xl font-bold text-slate-900">{data?.stats.total || 0}</p>
                    <p className="text-slate-500 text-sm">Total Assignments</p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <p className="text-3xl font-bold text-green-600">{data?.stats.graded || 0}</p>
                    <p className="text-slate-500 text-sm">Graded</p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <p className="text-3xl font-bold text-blue-600">{data?.stats.submitted || 0}</p>
                    <p className="text-slate-500 text-sm">Submitted</p>
                </div>
                <div className="bg-primary rounded-2xl p-5 shadow-lg text-white">
                    <p className="text-3xl font-bold">
                        {data?.stats.averageScore !== null ? `${data?.stats.averageScore}%` : '--'}
                    </p>
                    <p className="text-white/80 text-sm">Average Score</p>
                </div>
            </div>

            {/* Grades Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900">All Submissions</h2>
                </div>

                {data?.submissions.length === 0 ? (
                    <div className="p-12 text-center">
                        <span className="text-5xl mb-4 block">📝</span>
                        <p className="text-slate-500">No submissions yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {data?.submissions.map((submission) => (
                            <div
                                key={submission.id}
                                className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                                onClick={() => setSelectedSubmission(submission)}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900">{submission.assignment.title}</h3>
                                        <div className="flex flex-wrap gap-3 mt-1 text-sm text-slate-500">
                                            <span>{submission.assignment.class.name}</span>
                                            <span>Due: {new Date(submission.assignment.dueDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {submission.status === 'GRADED' && submission.score !== null ? (
                                            <div className={`px-4 py-2 rounded-xl font-bold ${getScoreColor(submission.score)}`}>
                                                {submission.score}%
                                            </div>
                                        ) : (
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${submission.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-600' :
                                                submission.status === 'PENDING' ? 'bg-orange-100 text-orange-600' :
                                                    'bg-slate-100 text-slate-600'
                                                }`}>
                                                {submission.status}
                                            </span>
                                        )}
                                        <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedSubmission && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedSubmission(null)}>
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold text-slate-900 mb-1">{selectedSubmission.assignment.title}</h2>
                        <p className="text-slate-500 text-sm mb-4">{selectedSubmission.assignment.class.name}</p>

                        <div className="space-y-4">
                            {/* Status */}
                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                                <span className="text-slate-600">Status</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedSubmission.status === 'GRADED' ? 'bg-green-100 text-green-600' :
                                    selectedSubmission.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-600' :
                                        'bg-orange-100 text-orange-600'
                                    }`}>
                                    {selectedSubmission.status}
                                </span>
                            </div>

                            {/* Score */}
                            {selectedSubmission.score !== null && (
                                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                                    <span className="text-slate-600">Score</span>
                                    <span className={`px-4 py-2 rounded-xl font-bold text-lg ${getScoreColor(selectedSubmission.score)}`}>
                                        {selectedSubmission.score}%
                                    </span>
                                </div>
                            )}

                            {/* Grade Letter */}
                            {selectedSubmission.grade && (
                                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                                    <span className="text-slate-600">Grade</span>
                                    <span className="font-bold text-primary text-lg">{selectedSubmission.grade}</span>
                                </div>
                            )}

                            {/* Dates */}
                            <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Due Date</span>
                                    <span className="text-slate-700">{new Date(selectedSubmission.assignment.dueDate).toLocaleDateString()}</span>
                                </div>
                                {selectedSubmission.submittedAt && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Submitted</span>
                                        <span className="text-slate-700">{new Date(selectedSubmission.submittedAt).toLocaleDateString()}</span>
                                    </div>
                                )}
                                {selectedSubmission.gradedAt && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Graded</span>
                                        <span className="text-slate-700">{new Date(selectedSubmission.gradedAt).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>

                            {/* Feedback */}
                            {selectedSubmission.feedback && (
                                <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                                    <p className="text-xs font-bold text-primary mb-2">Teacher Feedback</p>
                                    <p className="text-slate-700">{selectedSubmission.feedback}</p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setSelectedSubmission(null)}
                            className="w-full mt-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
