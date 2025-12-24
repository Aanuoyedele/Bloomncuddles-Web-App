"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import Alert from "@/components/Alert";

interface AssignmentData {
    id: string;
    title: string;
    description?: string;
    dueDate: string;
    class?: { name: string };
}

export default function AssignmentsPage() {
    const [assignments, setAssignments] = useState<AssignmentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [formData, setFormData] = useState({ title: '', description: '', dueDate: '', classId: '' });
    const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);

    // Edit modal state
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState<AssignmentData | null>(null);
    const [editForm, setEditForm] = useState({ title: '', description: '', dueDate: '', classId: '' });
    const [saving, setSaving] = useState(false);
    const [editError, setEditError] = useState<string | null>(null);

    const fetchAssignments = async () => {
        try {
            setLoading(true);
            const data = await api.get('/assignments');
            setAssignments(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load assignments');
        } finally {
            setLoading(false);
        }
    };

    const fetchClasses = async () => {
        try {
            const data = await api.get('/classes');
            setClasses(data);
        } catch (err) {
            console.error('Failed to load classes');
        }
    };

    useEffect(() => {
        fetchAssignments();
        fetchClasses();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.dueDate || !formData.classId) return;

        setCreating(true);
        try {
            await api.post('/assignments', formData);
            setCreateModalOpen(false);
            setFormData({ title: '', description: '', dueDate: '', classId: '' });
            fetchAssignments();
        } catch (err: any) {
            setFormError(err.message || 'Failed to create assignment');
        } finally {
            setCreating(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getStatus = (dueDate: string) => {
        const now = new Date();
        const due = new Date(dueDate);
        if (due < now) return { label: 'Overdue', color: 'bg-red-50 text-secondary border-red-100' };
        return { label: 'Active', color: 'bg-green-100 text-green-700 border-green-200' };
    };

    // Open edit modal
    const openEditModal = (assignment: AssignmentData) => {
        setEditingAssignment(assignment);
        const dueStr = assignment.dueDate ? new Date(assignment.dueDate).toISOString().split('T')[0] : '';
        setEditForm({ title: assignment.title, description: assignment.description || '', dueDate: dueStr, classId: '' });
        setEditError(null);
        setEditModalOpen(true);
    };

    // Save edited assignment
    const handleSaveEdit = async () => {
        if (!editingAssignment?.id) return;
        setSaving(true);
        setEditError(null);
        try {
            await api.patch(`/assignments/${editingAssignment.id}`, editForm);
            setEditModalOpen(false);
            setEditingAssignment(null);
            fetchAssignments();
        } catch (err: any) {
            setEditError(err.message || 'Failed to update assignment');
        } finally {
            setSaving(false);
        }
    };

    // Delete assignment
    const handleDeleteAssignment = async (id: string) => {
        if (!confirm('Are you sure you want to delete this assignment?')) return;
        try {
            await api.delete(`/assignments/${id}`);
            fetchAssignments();
        } catch (err: any) {
            alert(err.message || 'Failed to delete assignment');
        }
    };


    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-display">Assignments</h1>
                    <p className="text-slate-500 text-base mt-2">Manage and track student coursework across all classes.</p>
                </div>
                <button
                    onClick={() => setCreateModalOpen(true)}
                    className="flex items-center justify-center gap-2 rounded-xl h-11 px-6 bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 min-w-[160px]"
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    <span>Create Assignment</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-6 lg:col-span-5 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400">search</span>
                    </div>
                    <input
                        className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                        placeholder="Search assignments by name..."
                        type="text"
                    />
                </div>
            </div>

            {/* Loading / Error / Empty States */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 flex items-center gap-3">
                    <span className="material-symbols-outlined">error</span>
                    <p className="font-bold">{error}</p>
                </div>
            )}

            {!loading && !error && assignments.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
                    <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">assignment</span>
                    <h3 className="text-lg font-bold text-slate-700">No Assignments Yet</h3>
                    <p className="text-slate-500 mt-1">Create your first assignment to get started!</p>
                </div>
            )}

            {!loading && !error && assignments.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="py-4 pl-6 pr-4 w-12">
                                        <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4" />
                                    </th>
                                    <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">Assignment Name</th>
                                    <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">Class / Group</th>
                                    <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">Due Date</th>
                                    <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                                    <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {assignments.map((row) => {
                                    const status = getStatus(row.dueDate);
                                    return (
                                        <tr key={row.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="py-4 pl-6 pr-4">
                                                <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4" />
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="font-bold text-slate-900 block">{row.title}</span>
                                                {row.description && <span className="text-xs text-slate-500">{row.description.slice(0, 50)}...</span>}
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="text-sm font-medium text-slate-600">{row.class?.name || 'No Class'}</span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                                    <span className="material-symbols-outlined text-[16px] opacity-70">calendar_today</span>
                                                    {formatDate(row.dueDate)}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${status.color}`}>
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => openEditModal(row)}
                                                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteAssignment(row.id)}
                                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
                        <p className="text-sm text-slate-500">Showing <span className="font-bold text-slate-900">{assignments.length}</span> results</p>
                    </div>
                </div>
            )}

            {/* Create Assignment Modal */}
            {createModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Create Assignment</h3>
                            <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-4">
                            {formError && (
                                <Alert type="error" message={formError} onClose={() => setFormError(null)} />
                            )}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="e.g. Weekly Spelling List"
                                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Brief description of the assignment..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Due Date *</label>
                                <input
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Class *</label>
                                <select
                                    value={formData.classId}
                                    onChange={(e) => setFormData(prev => ({ ...prev, classId: e.target.value }))}
                                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    required
                                >
                                    <option value="">Select a class...</option>
                                    {classes.map(cls => (
                                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                                    ))}
                                </select>
                                {classes.length === 0 && (
                                    <p className="text-xs text-slate-500 mt-1">No classes available. Create a class first!</p>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={creating || classes.length === 0}
                                className={`w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors mt-4 ${(creating || classes.length === 0) ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {creating ? 'Creating...' : 'Create Assignment'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
