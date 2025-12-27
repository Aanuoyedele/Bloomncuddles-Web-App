"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface Assignment {
    id: string;
    title: string;
    description: string | null;
    dueDate: string;
    fileUrl: string | null;
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

export default function StudentAssignmentsPage() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');
    const [submitModal, setSubmitModal] = useState<Assignment | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        fetchAssignments();
    }, [filter]);

    const fetchAssignments = async () => {
        setLoading(true);
        try {
            const data = await api.get(`/student/assignments${filter !== 'all' ? `?status=${filter}` : ''}`);
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
            // Convert file to base64
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

    const getStatusBadge = (assignment: Assignment) => {
        if (!assignment.mySubmission || assignment.mySubmission.status === 'PENDING') {
            const isPast = new Date(assignment.dueDate) < new Date();
            return (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${isPast ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                    {isPast ? 'Overdue' : 'Pending'}
                </span>
            );
        }
        if (assignment.mySubmission.status === 'SUBMITTED') {
            return <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-600">Submitted</span>;
        }
        if (assignment.mySubmission.status === 'GRADED') {
            return <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-600">Graded</span>;
        }
        return null;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Assignments</h1>
                    <p className="text-slate-500">View and submit your class assignments</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {(['all', 'pending', 'submitted', 'graded'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${filter === f
                                ? 'bg-primary text-white'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* Loading */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : assignments.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                    <span className="material-symbols-outlined text-5xl text-slate-300">assignment</span>
                    <p className="text-slate-500 mt-2">No assignments found</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {assignments.map((assignment) => (
                        <div key={assignment.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-slate-900">{assignment.title}</h3>
                                        {getStatusBadge(assignment)}
                                    </div>
                                    {assignment.description && (
                                        <p className="text-slate-600 text-sm mb-3">{assignment.description}</p>
                                    )}
                                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">calendar_today</span>
                                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">class</span>
                                            {assignment.class.name}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    {assignment.fileUrl && (
                                        <a
                                            href={assignment.fileUrl}
                                            target="_blank"
                                            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 text-sm font-bold transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-sm">download</span>
                                            View File
                                        </a>
                                    )}
                                    {(!assignment.mySubmission || assignment.mySubmission.status === 'PENDING') && (
                                        <button
                                            onClick={() => setSubmitModal(assignment)}
                                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-sm">upload</span>
                                            Submit
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Submission Info */}
                            {assignment.mySubmission && assignment.mySubmission.status !== 'PENDING' && (
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        {assignment.mySubmission.submittedAt && (
                                            <div className="text-slate-500">
                                                Submitted: {new Date(assignment.mySubmission.submittedAt).toLocaleDateString()}
                                            </div>
                                        )}
                                        {assignment.mySubmission.score !== null && (
                                            <div className="font-bold text-green-600">
                                                Score: {assignment.mySubmission.score}%
                                            </div>
                                        )}
                                        {assignment.mySubmission.grade && (
                                            <div className="font-bold text-primary">
                                                Grade: {assignment.mySubmission.grade}
                                            </div>
                                        )}
                                    </div>
                                    {assignment.mySubmission.feedback && (
                                        <div className="mt-2 p-3 bg-slate-50 rounded-xl">
                                            <p className="text-xs font-bold text-slate-500 mb-1">Teacher Feedback:</p>
                                            <p className="text-slate-700">{assignment.mySubmission.feedback}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Submit Modal */}
            {submitModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSubmitModal(null)}>
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Submit Assignment</h2>
                        <p className="text-slate-500 mb-6">{submitModal.title}</p>

                        <div className="mb-6">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Upload Your Work</label>
                            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-primary transition-colors">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">cloud_upload</span>
                                    <p className="text-slate-600 font-medium">
                                        {selectedFile ? selectedFile.name : 'Click to upload'}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">PDF, DOC, DOCX, JPG, PNG</p>
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
                                className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
