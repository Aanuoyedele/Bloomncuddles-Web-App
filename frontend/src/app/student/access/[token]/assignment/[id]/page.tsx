"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface Assignment {
    id: string;
    title: string;
    description?: string;
    dueDate: string;
    fileUrl?: string;
    class: { name: string };
    mySubmission?: {
        id: string;
        status: string;
        submittedAt?: string;
        feedback?: string;
        score?: number;
    };
}

export default function StudentAssignmentPage({ params }: { params: Promise<{ token: string; id: string }> }) {
    const { token, id } = use(params);
    const router = useRouter();
    const [assignment, setAssignment] = useState<Assignment | null>(null);
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch student info
                const studentRes = await fetch(`${API_BASE}/student/access/${token}`);
                if (studentRes.ok) {
                    const studentData = await studentRes.json();
                    setStudent(studentData);
                }

                // Fetch all assignments and find the one we need
                const res = await fetch(`${API_BASE}/student/access/${token}/assignments`);
                if (!res.ok) throw new Error('Failed to fetch assignment');

                const data = await res.json();
                const found = data.find((a: any) => a.id === id);

                if (!found) {
                    setError('Assignment not found');
                    return;
                }

                setAssignment(found);
            } catch (err) {
                console.error('Error fetching assignment:', err);
                setError('Failed to load assignment');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token, id]);

    const handleSubmit = async () => {
        if (!assignment) return;

        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE}/student/access/${token}/assignments/${id}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to submit');
            }

            setSubmitted(true);
        } catch (err: any) {
            setError(err.message || 'Failed to submit assignment');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 font-sans flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <p className="text-slate-600 font-bold text-lg">Loading your assignment...</p>
                    <p className="text-slate-400 text-sm">Just a moment! 🚀</p>
                </div>
            </div>
        );
    }

    if (error || !assignment) {
        return (
            <div className="min-h-screen bg-slate-50 font-sans flex items-center justify-center p-6">
                <div className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-md w-full border-2 border-red-100">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-5xl">😕</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Oops!</h2>
                    <p className="text-slate-600 mb-6">{error || 'Assignment not found'}</p>
                    <button
                        onClick={() => router.push(`/student/access/${token}`)}
                        className="px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:-translate-y-0.5"
                    >
                        Go Back Home
                    </button>
                </div>
            </div>
        );
    }

    const isSubmitted = assignment.mySubmission?.status === 'SUBMITTED' || assignment.mySubmission?.status === 'GRADED';
    const isGraded = assignment.mySubmission?.status === 'GRADED';
    const dueDate = new Date(assignment.dueDate);
    const isPastDue = dueDate < new Date();

    // Get subject color based on class name
    const getSubjectStyle = () => {
        const name = assignment.class.name.toLowerCase();
        if (name.includes('math')) return { bg: 'from-blue-400 to-indigo-500', icon: '🔢', color: 'blue' };
        if (name.includes('english') || name.includes('reading')) return { bg: 'from-purple-400 to-violet-500', icon: '📖', color: 'purple' };
        if (name.includes('science')) return { bg: 'from-green-400 to-teal-500', icon: '🔬', color: 'green' };
        if (name.includes('art')) return { bg: 'from-pink-400 to-rose-500', icon: '🎨', color: 'pink' };
        return { bg: 'from-orange-400 to-amber-500', icon: '📝', color: 'orange' };
    };

    const subjectStyle = getSubjectStyle();

    return (
        <div className="min-h-screen bg-slate-50 font-sans relative overflow-hidden">
            {/* Animated Floating Bubbles */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute w-64 h-64 bg-gradient-to-br from-primary/10 to-blue-200/20 rounded-full blur-3xl -top-20 -left-20 animate-float" />
                <div className="absolute w-96 h-96 bg-gradient-to-br from-pink-200/20 to-purple-200/20 rounded-full blur-3xl top-1/4 -right-32 animate-float-delayed" />
                <div className="absolute w-72 h-72 bg-gradient-to-br from-green-200/15 to-teal-200/20 rounded-full blur-3xl bottom-1/4 left-1/4 animate-float-slow" />
            </div>

            {/* SVG Wave Pattern - Top */}
            <div className="absolute top-16 left-0 right-0 pointer-events-none overflow-hidden z-0">
                <svg className="w-full h-24 opacity-30" viewBox="0 0 1440 100" preserveAspectRatio="none">
                    <path
                        fill="url(#wave-gradient-assignment)"
                        d="M0,50 C360,100 720,0 1080,50 C1260,75 1380,25 1440,50 L1440,0 L0,0 Z"
                    />
                    <defs>
                        <linearGradient id="wave-gradient-assignment" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b6cb5" />
                            <stop offset="50%" stopColor="#5b8bd5" />
                            <stop offset="100%" stopColor="#3b6cb5" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Header */}
            <header className="bg-white/95 backdrop-blur-md border-b border-slate-100 fixed top-0 left-0 right-0 z-50">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    {/* Back Button + Logo */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push(`/student/access/${token}`)}
                            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                        >
                            <span className="material-symbols-outlined text-slate-600">arrow_back</span>
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <span className="text-white text-sm">🌸</span>
                            </div>
                            <span className="font-bold text-slate-800 hidden sm:block">Explorer Portal</span>
                        </div>
                    </div>

                    {/* Page Title */}
                    <div className="text-center">
                        <h1 className="font-bold text-slate-900">Assignment</h1>
                        <p className="text-xs text-slate-500">{assignment.class.name}</p>
                    </div>

                    {/* Profile */}
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        {student?.name?.charAt(0) || '?'}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-2xl mx-auto px-4 py-6 pt-24 pb-20 relative z-10">
                {submitted ? (
                    // Success Screen
                    <div className="bg-white rounded-3xl shadow-xl p-8 text-center border-2 border-green-200">
                        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <span className="text-5xl">🎉</span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Awesome Work!</h2>
                        <p className="text-slate-600 mb-2">You finished your assignment!</p>
                        <div className="flex justify-center gap-2 mb-8">
                            <span className="text-3xl animate-bounce" style={{ animationDelay: '0ms' }}>⭐</span>
                            <span className="text-3xl animate-bounce" style={{ animationDelay: '100ms' }}>⭐</span>
                            <span className="text-3xl animate-bounce" style={{ animationDelay: '200ms' }}>⭐</span>
                        </div>
                        <button
                            onClick={() => router.push(`/student/access/${token}`)}
                            className="px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-white font-bold rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-primary/25 hover:-translate-y-0.5 text-lg"
                        >
                            Back to Dashboard 🏠
                        </button>
                    </div>
                ) : isGraded ? (
                    // Graded Screen
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-green-200">
                            {/* Score Header */}
                            <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-8 text-white text-center">
                                <p className="text-green-100 font-medium mb-2">Your Score</p>
                                <div className="text-6xl font-bold mb-2">{assignment.mySubmission?.score}%</div>
                                <div className="flex justify-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            className={`text-2xl ${(assignment.mySubmission?.score || 0) >= star * 20 ? '' : 'opacity-30'}`}
                                        >
                                            ⭐
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6">
                                <h2 className="text-xl font-bold text-slate-900 mb-2">{assignment.title}</h2>

                                {assignment.mySubmission?.feedback && (
                                    <div className="bg-blue-50 rounded-2xl p-4 mb-4 border border-blue-100">
                                        <div className="flex items-start gap-3">
                                            <span className="text-2xl">💬</span>
                                            <div>
                                                <p className="text-sm font-bold text-blue-700 mb-1">Teacher says:</p>
                                                <p className="text-slate-700">{assignment.mySubmission.feedback}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={() => router.push(`/student/access/${token}`)}
                                    className="w-full py-4 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined">arrow_back</span>
                                    Back to Assignments
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Assignment View
                    <div className="space-y-6">
                        {/* Assignment Hero Card */}
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                            {/* Colorful Header */}
                            <div className={`bg-gradient-to-r ${subjectStyle.bg} p-8 text-white relative overflow-hidden`}>
                                <div className="absolute top-0 right-0 text-[120px] opacity-20 -mr-4 -mt-4">
                                    {subjectStyle.icon}
                                </div>
                                <div className="relative z-10">
                                    <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold mb-3">
                                        {assignment.class.name}
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-bold leading-tight">{assignment.title}</h2>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-5">
                                {/* Instructions */}
                                <div className="bg-slate-50 rounded-2xl p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <span className="text-xl">📋</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 mb-1">What to do</h3>
                                            <p className="text-slate-600">
                                                {assignment.description || 'Complete this assignment and click the button when you\'re done!'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Due Date */}
                                <div className={`rounded-2xl p-4 flex items-center gap-4 ${isPastDue ? 'bg-red-50 border-2 border-red-200' : 'bg-amber-50 border-2 border-amber-200'
                                    }`}>
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isPastDue ? 'bg-red-100' : 'bg-amber-100'
                                        }`}>
                                        <span className="text-2xl">{isPastDue ? '⏰' : '📅'}</span>
                                    </div>
                                    <div>
                                        <p className={`font-bold ${isPastDue ? 'text-red-700' : 'text-amber-700'}`}>
                                            {isPastDue ? 'Past Due!' : 'Due Date'}
                                        </p>
                                        <p className={`text-sm ${isPastDue ? 'text-red-600' : 'text-amber-600'}`}>
                                            {dueDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                </div>

                                {/* File Download */}
                                {assignment.fileUrl && (
                                    <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                                    <span className="text-2xl">📄</span>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-blue-800">Assignment File</p>
                                                    <p className="text-sm text-blue-600">Download to get started</p>
                                                </div>
                                            </div>
                                            <a
                                                href={assignment.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-5 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-md flex items-center gap-2"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">download</span>
                                                Download
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* Already Submitted Notice */}
                                {isSubmitted && (
                                    <div className="bg-green-50 rounded-2xl p-4 border-2 border-green-200 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">✅</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-green-700">Already Submitted!</p>
                                            <p className="text-sm text-green-600">
                                                {assignment.mySubmission?.submittedAt &&
                                                    `on ${new Date(assignment.mySubmission.submittedAt).toLocaleDateString()}`
                                                }
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Submit Button */}
                                {!isSubmitted && (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={submitting}
                                        className={`w-full py-5 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold rounded-2xl text-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-green-500/25 ${submitting ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90 hover:-translate-y-0.5'
                                            }`}
                                    >
                                        {submitting ? (
                                            <>
                                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-2xl">🚀</span>
                                                I'm Done!
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Help Text */}
                        <div className="text-center text-slate-500 text-sm flex items-center justify-center gap-2 bg-white/50 backdrop-blur-sm rounded-xl py-3 px-4">
                            <span className="material-symbols-outlined text-[18px]">help</span>
                            Need help? Ask your teacher!
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-white/95 backdrop-blur-md border-t border-slate-100 fixed bottom-0 left-0 right-0 z-40 py-3">
                <div className="max-w-6xl mx-auto px-4 flex items-center justify-center gap-2 text-slate-500 text-sm">
                    <span className="text-lg">🌸</span>
                    <span>Bloom n Cuddles Explorer Portal</span>
                </div>
            </footer>
        </div>
    );
}
