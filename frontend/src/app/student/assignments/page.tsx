"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface Assignment {
    id: string;
    title: string;
    description: string | null;
    dueDate: string;
    fileUrl: string | null;
    subject?: string;
    imageUrl?: string;
    class: { name: string };
    mySubmission: {
        id: string;
        status: string;
        score: number | null;
        grade: string | null;
        feedback: string | null;
        submissionFileUrl: string | null;
        submittedAt: string | null;
    } | null;
}

// Subject-based images and colors
const subjectStyles: Record<string, { color: string; bgColor: string; image: string }> = {
    'English': { color: 'text-pink-600', bgColor: 'bg-pink-100', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=250&fit=crop' },
    'Maths': { color: 'text-blue-600', bgColor: 'bg-blue-100', image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=250&fit=crop' },
    'Science': { color: 'text-green-600', bgColor: 'bg-green-100', image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=250&fit=crop' },
    'Reading': { color: 'text-orange-600', bgColor: 'bg-orange-100', image: 'https://images.unsplash.com/photo-1474366521946-c3b861217ad2?w=400&h=250&fit=crop' },
    'Art': { color: 'text-purple-600', bgColor: 'bg-purple-100', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=250&fit=crop' },
    'default': { color: 'text-slate-600', bgColor: 'bg-slate-100', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop' },
};

export default function StudentAssignmentsPage() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'ready' | 'finished'>('ready');
    const [submitModal, setSubmitModal] = useState<Assignment | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        setLoading(true);
        try {
            const data = await api.get(`/student/assignments`);
            setAssignments(data);
        } catch (err) {
            console.error('Failed to fetch assignments:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!submitModal || !selectedFile) return;

        setSubmitting(true);
        try {
            const reader = new FileReader();
            reader.onload = async () => {
                const fileUrl = reader.result as string;
                await api.post(`/student/assignments/${submitModal.id}/submit`, { fileUrl });
                setSubmitModal(null);
                setSelectedFile(null);
                fetchAssignments();
            };
            reader.readAsDataURL(selectedFile);
        } catch (err) {
            console.error('Failed to submit:', err);
            alert('Failed to submit assignment');
        } finally {
            setSubmitting(false);
        }
    };

    // Filter assignments based on tab
    const readyAssignments = assignments.filter(a => !a.mySubmission || a.mySubmission.status === 'PENDING');
    const finishedAssignments = assignments.filter(a => a.mySubmission && a.mySubmission.status !== 'PENDING');
    const displayedAssignments = activeTab === 'ready' ? readyAssignments : finishedAssignments;

    const getSubjectStyle = (assignment: Assignment) => {
        // Try to detect subject from class name or title
        const text = `${assignment.class.name} ${assignment.title}`.toLowerCase();
        if (text.includes('english') || text.includes('spelling') || text.includes('phonics')) return subjectStyles['English'];
        if (text.includes('math')) return subjectStyles['Maths'];
        if (text.includes('science') || text.includes('plant') || text.includes('life')) return subjectStyles['Science'];
        if (text.includes('reading') || text.includes('book')) return subjectStyles['Reading'];
        if (text.includes('art') || text.includes('draw')) return subjectStyles['Art'];
        return subjectStyles['default'];
    };

    const detectSubject = (assignment: Assignment) => {
        const text = `${assignment.class.name} ${assignment.title}`.toLowerCase();
        if (text.includes('english') || text.includes('spelling') || text.includes('phonics')) return 'ENGLISH';
        if (text.includes('math')) return 'MATHS';
        if (text.includes('science') || text.includes('plant') || text.includes('life')) return 'SCIENCE';
        if (text.includes('reading') || text.includes('book')) return 'READING';
        if (text.includes('art') || text.includes('draw')) return 'ART';
        return 'ASSIGNMENT';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <span className="material-symbols-outlined text-primary text-3xl">assignment</span>
                        <h1 className="text-2xl font-bold text-slate-900">My Assignments</h1>
                    </div>
                    <p className="text-slate-500">
                        {activeTab === 'ready'
                            ? `You have ${readyAssignments.length} fun tasks waiting for you.`
                            : `You've completed ${finishedAssignments.length} assignments. Great job!`
                        }
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
                <button
                    onClick={() => setActiveTab('ready')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all ${activeTab === 'ready'
                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }`}
                >
                    <span className="material-symbols-outlined text-[18px]">pending_actions</span>
                    Ready to Start
                    {readyAssignments.length > 0 && (
                        <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${activeTab === 'ready' ? 'bg-white/20' : 'bg-primary/10 text-primary'
                            }`}>
                            {readyAssignments.length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('finished')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all ${activeTab === 'finished'
                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }`}
                >
                    <span className="material-symbols-outlined text-[18px]">task_alt</span>
                    Finished
                </button>
            </div>

            {/* Loading */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/30 border-t-primary"></div>
                </div>
            ) : displayedAssignments.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
                    <span className="text-6xl mb-4 block">
                        {activeTab === 'ready' ? '🎉' : '📝'}
                    </span>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                        {activeTab === 'ready' ? 'All caught up!' : 'No finished assignments yet'}
                    </h3>
                    <p className="text-slate-500">
                        {activeTab === 'ready'
                            ? 'You have no pending assignments. Time to play some games!'
                            : 'Complete some assignments and they\'ll show up here.'
                        }
                    </p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {displayedAssignments.map((assignment) => {
                        const style = getSubjectStyle(assignment);
                        const subject = detectSubject(assignment);
                        const isFinished = assignment.mySubmission && assignment.mySubmission.status !== 'PENDING';
                        const isGraded = assignment.mySubmission?.status === 'GRADED';

                        return (
                            <div
                                key={assignment.id}
                                className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
                            >
                                {/* Image Header */}
                                <div className="relative h-40 overflow-hidden">
                                    <img
                                        src={assignment.imageUrl || style.image}
                                        alt={assignment.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                    {/* Subject Badge */}
                                    <div className="absolute top-4 left-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${style.bgColor} ${style.color}`}>
                                            ⚡ {subject}
                                        </span>
                                    </div>

                                    {/* Status Badge for finished */}
                                    {isFinished && (
                                        <div className="absolute top-4 right-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${isGraded ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                                                }`}>
                                                {isGraded ? '✓ Graded' : '✓ Submitted'}
                                            </span>
                                        </div>
                                    )}

                                    {/* Title Overlay */}
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h3 className="text-white font-bold text-lg line-clamp-2 drop-shadow-lg">
                                            {assignment.title}
                                        </h3>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    {assignment.description && (
                                        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                                            {assignment.description}
                                        </p>
                                    )}

                                    {/* Meta Info */}
                                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                                            {new Date(assignment.dueDate).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[16px]">school</span>
                                            {assignment.class.name}
                                        </div>
                                    </div>

                                    {/* Score if graded */}
                                    {isGraded && assignment.mySubmission?.score !== null && (
                                        <div className="mb-4 p-3 bg-green-50 rounded-xl flex items-center justify-between">
                                            <span className="text-sm font-medium text-green-700">Your Score</span>
                                            <span className="text-xl font-bold text-green-600">
                                                {assignment.mySubmission?.score}%
                                            </span>
                                        </div>
                                    )}

                                    {/* Action Button */}
                                    {!isFinished ? (
                                        <button
                                            onClick={() => setSubmitModal(assignment)}
                                            className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                        >
                                            GO!
                                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                        </button>
                                    ) : assignment.mySubmission?.status === 'SUBMITTED' ? (
                                        <div className="w-full py-3 bg-blue-100 text-blue-600 font-bold rounded-xl text-center">
                                            Waiting for Teacher
                                        </div>
                                    ) : (
                                        <button className="w-full py-3 bg-slate-100 text-slate-600 font-bold rounded-xl flex items-center justify-center gap-2">
                                            View Feedback
                                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Help Banner */}
            <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <span className="text-4xl">💡</span>
                    <div>
                        <p className="font-bold text-slate-800">Need help with an assignment?</p>
                        <p className="text-slate-600 text-sm">Ask your teacher for guidance!</p>
                    </div>
                </div>
                <button className="px-5 py-2 bg-white text-slate-700 rounded-xl font-bold shadow-sm hover:shadow-md transition-all">
                    Message Teacher
                </button>
            </div>

            {/* Submit Modal */}
            {submitModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSubmitModal(null)}>
                    <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="text-center mb-6">
                            <span className="text-5xl mb-4 block">📝</span>
                            <h2 className="text-xl font-bold text-slate-900">Submit Your Work</h2>
                            <p className="text-slate-500">{submitModal.title}</p>
                        </div>

                        <div className="mb-6">
                            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-primary transition-colors cursor-pointer">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    <span className="material-symbols-outlined text-5xl text-slate-400 mb-3 block">cloud_upload</span>
                                    <p className="text-slate-600 font-bold">
                                        {selectedFile ? selectedFile.name : 'Click to upload your work'}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-2">PDF, DOC, DOCX, JPG, PNG</p>
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setSubmitModal(null)}
                                className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!selectedFile || submitting}
                                className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Submitting...' : 'Submit! 🚀'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
