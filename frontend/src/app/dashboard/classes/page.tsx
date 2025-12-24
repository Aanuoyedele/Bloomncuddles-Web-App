"use client";

import { useDashboard } from "../context";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import Alert from "@/components/Alert";

interface ClassData {
    id: string;
    name: string;
    grade: string;
    schedule?: string;
    teacher?: { name: string; email: string };
    _count?: { students: number };
}

export default function ClassesPage() {
    const { userRole } = useDashboard();
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
    const [classes, setClasses] = useState<ClassData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: '', grade: '', schedule: '' });

    // Edit modal state
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState<ClassData | null>(null);
    const [editForm, setEditForm] = useState({ name: '', grade: '', schedule: '' });
    const [saving, setSaving] = useState(false);
    const [editError, setEditError] = useState<string | null>(null);

    // Assign teacher state
    const [teachers, setTeachers] = useState<{ id: string; name: string; email: string }[]>([]);
    const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
    const [assigning, setAssigning] = useState(false);

    // Color palette for class cards
    const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-pink-500", "bg-indigo-500"];

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const data = await api.get('/classes');
            setClasses(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load classes');
        } finally {
            setLoading(false);
        }
    };

    const fetchTeachers = async () => {
        try {
            const data = await api.get('/users?role=TEACHER');
            setTeachers(data);
        } catch (err) {
            console.error('Failed to load teachers');
        }
    };

    useEffect(() => {
        fetchClasses();
        fetchTeachers();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.grade) return;

        setCreating(true);
        try {
            await api.post('/classes', formData);
            setCreateModalOpen(false);
            setFormData({ name: '', grade: '', schedule: '' });
            fetchClasses(); // Refresh list
        } catch (err: any) {
            setFormError(err.message || 'Failed to create class');
        } finally {
            setCreating(false);
        }
    };

    // Open edit modal
    const openEditModal = (cls: ClassData) => {
        setEditingClass(cls);
        setEditForm({ name: cls.name, grade: cls.grade, schedule: cls.schedule || '' });
        setEditError(null);
        setEditModalOpen(true);
    };

    // Save edited class
    const handleSaveEdit = async () => {
        if (!editingClass?.id) return;
        setSaving(true);
        setEditError(null);
        try {
            await api.patch(`/classes/${editingClass.id}`, editForm);
            setEditModalOpen(false);
            setEditingClass(null);
            fetchClasses();
        } catch (err: any) {
            setEditError(err.message || 'Failed to update class');
        } finally {
            setSaving(false);
        }
    };

    // Delete class
    const handleDeleteClass = async (id: string) => {
        if (!confirm('Are you sure you want to delete this class? This will also remove all students and assignments associated with it.')) return;
        try {
            await api.delete(`/classes/${id}`);
            fetchClasses();
        } catch (err: any) {
            alert(err.message || 'Failed to delete class');
        }
    };

    // Open assign modal
    const openAssignModal = (classId: string) => {
        setSelectedClassId(classId);
        setSelectedTeacherId(null);
        setAssignModalOpen(true);
    };

    // Assign teacher to class
    const handleAssignTeacher = async () => {
        if (!selectedClassId || !selectedTeacherId) return;
        setAssigning(true);
        try {
            await api.patch(`/classes/${selectedClassId}`, { teacherId: selectedTeacherId });
            setAssignModalOpen(false);
            setSelectedClassId(null);
            setSelectedTeacherId(null);
            fetchClasses();
        } catch (err: any) {
            alert(err.message || 'Failed to assign teacher');
        } finally {
            setAssigning(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-display">
                        {userRole === 'Admin' ? 'Manage Classes' : 'My Classes'}
                    </h1>
                    <p className="text-slate-500 text-base mt-2">
                        {userRole === 'Admin'
                            ? 'Oversee all classes and assign teachers.'
                            : 'Manage your active classes and curriculum progress.'}
                    </p>
                </div>
                <button
                    onClick={() => setCreateModalOpen(true)}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    <span>Create New Class</span>
                </button>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400">search</span>
                    </div>
                    <input
                        className="w-full h-12 pl-12 pr-4 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                        placeholder="Search classes..."
                        type="text"
                    />
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 h-12 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-all shadow-sm">
                        <span className="material-symbols-outlined text-slate-500">filter_list</span>
                        <span>Filter</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 h-12 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-all shadow-sm">
                        <span className="material-symbols-outlined text-slate-500">sort</span>
                        <span>Sort</span>
                    </button>
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

            {!loading && !error && classes.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
                    <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">school</span>
                    <h3 className="text-lg font-bold text-slate-700">No Classes Yet</h3>
                    <p className="text-slate-500 mt-1">Create your first class to get started!</p>
                </div>
            )}

            {/* Class Grid */}
            {!loading && !error && classes.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map((cls, index) => (
                        <div key={cls.id} className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-2 h-full ${colors[index % colors.length]}`}></div>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cls.grade}</span>
                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">{cls.name}</h3>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openEditModal(cls)}
                                        className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClass(cls.id)}
                                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center text-sm text-slate-500 mb-1">
                                    <span className="material-symbols-outlined text-[18px] mr-2">person</span>
                                    <span className="font-medium mr-1">{cls.teacher?.name || 'Unassigned'}</span>
                                </div>
                                <div className="flex items-center text-sm text-slate-500">
                                    <span className="material-symbols-outlined text-[18px] mr-2">groups</span>
                                    <span className="font-medium">{cls._count?.students || 0} Students</span>
                                </div>
                                {cls.schedule && (
                                    <div className="flex items-center text-sm text-slate-500">
                                        <span className="material-symbols-outlined text-[18px] mr-2">schedule</span>
                                        <span className="font-medium">{cls.schedule}</span>
                                    </div>
                                )}
                            </div>

                            {/* Admin View: Actions */}
                            {userRole === 'Admin' && (
                                <div className="mt-6 pt-4 border-t border-slate-100">
                                    <button
                                        onClick={() => { setSelectedClassId(cls.id); setAssignModalOpen(true); }}
                                        className="w-full flex justify-center items-center gap-2 py-2 rounded-lg border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 hover:text-primary transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">person_add</span>
                                        {cls.teacher ? 'Reassign Teacher' : 'Assign Teacher'}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Assign Teacher Modal */}
            {assignModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900">
                                {classes.find(c => c.id === selectedClassId)?.teacher ? 'Reassign' : 'Assign'} Teacher
                            </h3>
                            <button onClick={() => setAssignModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <p className="text-sm text-slate-500">
                                Select a teacher for <strong>{classes.find(c => c.id === selectedClassId)?.name || 'this class'}</strong>
                            </p>
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                {teachers.length === 0 ? (
                                    <p className="text-sm text-slate-400 text-center py-4">No teachers available. Invite teachers first.</p>
                                ) : (
                                    teachers.map((teacher) => (
                                        <button
                                            key={teacher.id}
                                            onClick={() => setSelectedTeacherId(teacher.id)}
                                            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left group ${selectedTeacherId === teacher.id
                                                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                                                    : 'border-slate-200 hover:border-primary/50 hover:bg-primary/5'
                                                }`}
                                        >
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${selectedTeacherId === teacher.id
                                                    ? 'bg-primary text-white'
                                                    : 'bg-slate-100 text-slate-500 group-hover:bg-white'
                                                }`}>
                                                {teacher.name.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-slate-900">{teacher.name}</p>
                                                <p className="text-xs text-slate-500">{teacher.email}</p>
                                            </div>
                                            {selectedTeacherId === teacher.id && (
                                                <span className="material-symbols-outlined text-primary">check_circle</span>
                                            )}
                                        </button>
                                    ))
                                )}
                            </div>
                            <button
                                onClick={handleAssignTeacher}
                                disabled={!selectedTeacherId || assigning}
                                className={`w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors mt-4 ${(!selectedTeacherId || assigning) ? 'opacity-70 cursor-not-allowed' : ''
                                    }`}
                            >
                                {assigning ? 'Assigning...' : 'Confirm Assignment'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Class Modal */}
            {createModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Create New Class</h3>
                            <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-4">
                            {formError && (
                                <Alert type="error" message={formError} onClose={() => setFormError(null)} />
                            )}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Class Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="e.g. Mathematics 5A"
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
                                <label className="block text-sm font-bold text-slate-700 mb-1">Schedule</label>
                                <input
                                    type="text"
                                    value={formData.schedule}
                                    onChange={(e) => setFormData(prev => ({ ...prev, schedule: e.target.value }))}
                                    placeholder="e.g. Mon, Wed, Fri 9:00 AM"
                                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={creating}
                                className={`w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors mt-4 ${creating ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {creating ? 'Creating...' : 'Create Class'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Class Modal */}
            {editModalOpen && editingClass && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Edit Class</h3>
                            <button onClick={() => { setEditModalOpen(false); setEditingClass(null); }} className="text-slate-400 hover:text-slate-600">
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
                                <label className="block text-sm font-bold text-slate-700 mb-1">Class Name *</label>
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
                                <label className="block text-sm font-bold text-slate-700 mb-1">Schedule</label>
                                <input
                                    type="text"
                                    value={editForm.schedule}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, schedule: e.target.value }))}
                                    placeholder="e.g. Mon, Wed, Fri 9:00 AM"
                                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
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
