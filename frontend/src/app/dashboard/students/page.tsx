"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import Alert from "@/components/Alert";

interface StudentData {
    id: string;
    name: string;
    grade: string;
    dob?: string;
    class?: { name: string; grade: string };
}

export default function StudentsPage() {
    const [students, setStudents] = useState<StudentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: '', grade: '', classId: '' });
    const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);

    // Edit modal state
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<StudentData | null>(null);
    const [editForm, setEditForm] = useState({ name: '', grade: '', classId: '' });
    const [saving, setSaving] = useState(false);
    const [editError, setEditError] = useState<string | null>(null);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const data = await api.get('/students');
            setStudents(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load students');
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
        fetchStudents();
        fetchClasses();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.grade || !formData.classId) return;

        setCreating(true);
        try {
            await api.post('/students', formData);
            setCreateModalOpen(false);
            setFormData({ name: '', grade: '', classId: '' });
            fetchStudents();
        } catch (err: any) {
            setFormError(err.message || 'Failed to create student');
        } finally {
            setCreating(false);
        }
    };

    // Open edit modal
    const openEditModal = (student: StudentData) => {
        setEditingStudent(student);
        setEditForm({ name: student.name, grade: student.grade, classId: student.class?.name || '' });
        setEditError(null);
        setEditModalOpen(true);
    };

    // Save edited student
    const handleSaveEdit = async () => {
        if (!editingStudent?.id) return;
        setSaving(true);
        setEditError(null);
        try {
            await api.patch(`/students/${editingStudent.id}`, editForm);
            setEditModalOpen(false);
            setEditingStudent(null);
            fetchStudents();
        } catch (err: any) {
            setEditError(err.message || 'Failed to update student');
        } finally {
            setSaving(false);
        }
    };

    // Delete student
    const handleDeleteStudent = async (id: string) => {
        if (!confirm('Are you sure you want to delete this student?')) return;
        try {
            await api.delete(`/students/${id}`);
            fetchStudents();
        } catch (err: any) {
            alert(err.message || 'Failed to delete student');
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-display">Students</h1>
                    <p className="text-slate-500 text-base mt-2">Manage your enrolled students, track progress, and assign activities.</p>
                </div>
                <button
                    onClick={() => setCreateModalOpen(true)}
                    className="flex items-center justify-center gap-2 rounded-xl h-11 px-6 bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5"
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    <span>Add New Student</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                    { label: 'Total Students', value: students.length.toString(), sub: 'Enrolled', subIcon: 'groups', icon: 'groups', color: 'text-primary', bg: 'bg-primary/10', subColor: 'text-slate-500' },
                    { label: 'Active Today', value: '0', sub: 'Feature coming soon', subIcon: 'check_circle', icon: 'check_circle', color: 'text-green-500', bg: 'bg-green-500/10', subColor: 'text-slate-500' },
                    { label: 'Needs Attention', value: '0', sub: 'Feature coming soon', subIcon: 'priority_high', icon: 'priority_high', color: 'text-secondary', bg: 'bg-secondary/10', subColor: 'text-slate-500' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <p className="text-slate-500 font-bold text-sm uppercase tracking-wide">{stat.label}</p>
                            <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                                <span className="material-symbols-outlined text-xl">{stat.icon}</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-4xl font-extrabold text-slate-900 font-display">{stat.value}</p>
                            <p className={`text-xs font-semibold flex items-center gap-1 mt-2 ${stat.subColor}`}>
                                <span className="material-symbols-outlined text-sm">{stat.subIcon}</span> {stat.sub}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-slate-400">search</span>
                        </div>
                        <input
                            className="w-full h-11 pl-10 pr-4 bg-slate-50 border-transparent focus:bg-white focus:border-primary focus:ring-0 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 transition-all"
                            placeholder="Search students by name, ID..."
                            type="text"
                        />
                    </div>
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

            {!loading && !error && students.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
                    <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">groups</span>
                    <h3 className="text-lg font-bold text-slate-700">No Students Yet</h3>
                    <p className="text-slate-500 mt-1">Add your first student to get started!</p>
                </div>
            )}

            {/* Students Table */}
            {!loading && !error && students.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-200">
                                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 w-1/3 min-w-[240px]">Student Name</th>
                                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500">Grade</th>
                                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500">Class</th>
                                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {students.map((student) => (
                                    <tr key={student.id} className="group hover:bg-slate-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900">{student.name}</span>
                                                    <span className="text-xs text-slate-500">ID: {student.id.slice(0, 8)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-sm font-medium text-slate-600">{student.grade}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                                                {student.class?.name || 'Unassigned'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => openEditModal(student)}
                                                    className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteStudent(student.id)}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create Student Modal */}
            {createModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Add New Student</h3>
                            <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-4">
                            {formError && (
                                <Alert type="error" message={formError} onClose={() => setFormError(null)} />
                            )}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Student Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="e.g. John Doe"
                                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Grade *</label>
                                <input
                                    type="text"
                                    value={formData.grade}
                                    onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                                    placeholder="e.g. Grade 5"
                                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
                                {creating ? 'Adding...' : 'Add Student'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Student Modal */}
            {editModalOpen && editingStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Edit Student</h3>
                            <button onClick={() => { setEditModalOpen(false); setEditingStudent(null); }} className="text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {editError && (
                            <div className="mb-4">
                                <Alert type="error" message={editError} onClose={() => setEditError(null)} />
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Name *</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Grade *</label>
                                <input
                                    type="text"
                                    value={editForm.grade}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, grade: e.target.value }))}
                                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Class</label>
                                <select
                                    value={editForm.classId}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, classId: e.target.value }))}
                                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                >
                                    <option value="">Select a class...</option>
                                    {classes.map(cls => (
                                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={handleSaveEdit}
                                disabled={saving}
                                className={`w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
