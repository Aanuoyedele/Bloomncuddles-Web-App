"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import Alert from "@/components/Alert";

interface User {
    name: string;
    role: string;
    email: string;
    id?: string;
    status?: string;
    lastActive?: string;
    img?: string;
}

interface Invite {
    id: string;
    email: string;
    role: string;
    used: boolean;
    expiresAt: string;
    createdAt: string;
}

export default function UserManagementPage() {
    const [activeTab, setActiveTab] = useState("Teachers");
    const [inviteModalOpen, setInviteModalOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("TEACHER");
    const [sending, setSending] = useState(false);
    const [inviteResult, setInviteResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [inviteLink, setInviteLink] = useState<string | null>(null);
    const [pendingInvites, setPendingInvites] = useState<Invite[]>([]);
    const [teachers, setTeachers] = useState<User[]>([]);
    const [loadingTeachers, setLoadingTeachers] = useState(true);

    // Edit modal state
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });
    const [saving, setSaving] = useState(false);
    const [editError, setEditError] = useState<string | null>(null);

    // Bulk import state
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [importType, setImportType] = useState<'teachers' | 'students' | 'parents'>('teachers');
    const [importFile, setImportFile] = useState<File | null>(null);
    const [importing, setImporting] = useState(false);
    const [importResult, setImportResult] = useState<{ success: number; failed: number; errors: string[] } | null>(null);

    const tabs = ["Teachers", "Invites", "Parents", "Students"];

    // Fetch teachers from backend
    const fetchTeachers = async () => {
        try {
            setLoadingTeachers(true);
            const data = await api.get('/users?role=TEACHER');
            setTeachers(data);
        } catch (err) {
            console.error('Failed to fetch teachers');
        } finally {
            setLoadingTeachers(false);
        }
    };

    // Fetch pending invites
    const fetchInvites = async () => {
        try {
            const data = await api.get('/invites');
            setPendingInvites(data);
        } catch (err) {
            console.error('Failed to fetch invites');
        }
    };

    // Revoke/delete an invite
    const handleRevokeInvite = async (inviteId: string) => {
        if (!confirm('Are you sure you want to revoke this invite?')) return;
        try {
            await api.delete(`/invites/${inviteId}`);
            fetchInvites();
        } catch (err) {
            console.error('Failed to revoke invite');
        }
    };

    // Delete a teacher
    const handleDeleteTeacher = async (userId: string) => {
        if (!confirm('Are you sure you want to remove this teacher?')) return;
        try {
            await api.delete(`/users/${userId}`);
            fetchTeachers();
        } catch (err: any) {
            alert(err.message || 'Failed to delete teacher');
        }
    };

    // Open edit modal
    const openEditModal = (user: User) => {
        setEditingUser(user);
        setEditForm({ name: user.name, email: user.email, role: user.role });
        setEditError(null);
        setEditModalOpen(true);
    };

    // Save edited user
    const handleSaveEdit = async () => {
        if (!editingUser?.id) return;

        setSaving(true);
        setEditError(null);

        try {
            await api.patch(`/users/${editingUser.id}`, editForm);
            setEditModalOpen(false);
            setEditingUser(null);
            fetchTeachers();
        } catch (err: any) {
            setEditError(err.message || 'Failed to update user');
        } finally {
            setSaving(false);
        }
    };

    // Handle bulk import
    const handleBulkImport = async () => {
        if (!importFile) return;

        setImporting(true);
        setImportResult(null);

        try {
            const csvText = await importFile.text();
            const response = await api.post(`/import/${importType}`, { csvData: csvText });
            setImportResult(response);
            // Refresh data after successful import
            if (importType === 'teachers') fetchTeachers();
        } catch (err: any) {
            setImportResult({ success: 0, failed: 1, errors: [err.message || 'Import failed'] });
        } finally {
            setImporting(false);
        }
    };

    useEffect(() => {
        fetchInvites();
        fetchTeachers();
    }, []);

    const handleSendInvite = async () => {
        if (!inviteEmail || !inviteEmail.includes('@')) {
            setInviteResult({ type: 'error', message: 'Please enter a valid email address' });
            return;
        }

        setSending(true);
        setInviteResult(null);
        setInviteLink(null);

        try {
            const data = await api.post('/invites', { email: inviteEmail, role: inviteRole });

            // Capture the invite link from response
            const generatedLink = data.inviteUrl || `http://localhost:3000/register/invite?token=${data.invite?.token}`;
            setInviteLink(generatedLink);

            setInviteResult({
                type: 'success',
                message: data.warning
                    ? 'Invite created! Copy the link below to share manually.'
                    : 'Invite sent successfully! You can also copy the link below.'
            });
            setInviteEmail('');
            fetchInvites(); // Refresh invite list
            // Don't auto-close so user can copy link
        } catch (err: any) {
            setInviteResult({ type: 'error', message: err.message || 'Failed to send invite' });
        } finally {
            setSending(false);
        }
    };

    // Filter Logic - use real teachers data
    const filteredUsers = activeTab === "Teachers"
        ? teachers
        : [];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-display">User Management</h1>
                    <p className="text-slate-500 text-base mt-2">Manage access and onboarding for teachers, parents, and students.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => { setImportModalOpen(true); setImportFile(null); setImportResult(null); }}
                        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">upload</span>
                        Bulk Import
                    </button>
                    <button
                        onClick={() => setInviteModalOpen(true)}
                        className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-primary/90 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">person_add</span>
                        Invite Teacher
                    </button>
                </div>
            </div>

            {/* Tabs & Search */}
            <div className="flex flex-col gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 justify-between p-2">
                    {/* Tabs */}
                    <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab
                                    ? 'bg-white shadow-sm text-slate-900'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-72">
                        <span className="absolute inset-y-0 left-3 flex items-center material-symbols-outlined text-slate-400">search</span>
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-t border-slate-100">
                        <thead className="bg-slate-50/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 rounded-tl-lg">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Last Active</th>
                                <th className="px-6 py-4 text-right rounded-tr-lg">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.map((user, i) => (
                                <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {user.img ? (
                                                <img src={user.img} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-slate-100" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                                    {user.name.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold text-slate-900">{user.name}</p>
                                                <p className="text-xs text-slate-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${user.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                                            user.role === 'Teacher' ? 'bg-blue-100 text-blue-700' :
                                                user.role === 'Parent' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-green-100 text-green-700'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${user.status === 'Active'
                                            ? 'bg-green-50 text-green-700 border-green-200'
                                            : 'bg-slate-100 text-slate-600 border-slate-200'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                                        {user.lastActive}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openEditModal(user)}
                                                className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">edit</span>
                                            </button>
                                            <button
                                                onClick={() => user.id && handleDeleteTeacher(user.id)}
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
                    {filteredUsers.length === 0 && (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-3xl text-slate-400">group_off</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">No users found</h3>
                            <p className="text-slate-500 mt-1">Get started by inviting a new {activeTab.slice(0, -1).toLowerCase()}.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Invites Tab Content */}
            {activeTab === 'Invites' && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Pending Invitations</h3>
                    {pendingInvites.length === 0 ? (
                        <div className="text-center py-8">
                            <span className="material-symbols-outlined text-4xl text-slate-300">mail</span>
                            <p className="text-slate-500 mt-2">No pending invites</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {pendingInvites.map(invite => (
                                <div key={invite.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl group">
                                    <div>
                                        <p className="font-bold text-slate-900">{invite.email}</p>
                                        <p className="text-xs text-slate-500">
                                            {invite.role} • {invite.used ? 'Used' : `Expires ${new Date(invite.expiresAt).toLocaleDateString()}`}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${invite.used ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {invite.used ? 'Accepted' : 'Pending'}
                                        </span>
                                        {!invite.used && (
                                            <button
                                                onClick={() => handleRevokeInvite(invite.id)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                title="Revoke invite"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Invite Modal */}
            {inviteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Invite Teacher</h3>
                            <button onClick={() => { setInviteModalOpen(false); setInviteResult(null); }} className="text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {inviteResult && (
                            <div className="mb-4">
                                <Alert type={inviteResult.type} message={inviteResult.message} onClose={() => setInviteResult(null)} />
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Email Address *</label>
                                <input
                                    type="email"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    placeholder="teacher@example.com"
                                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Role</label>
                                <select
                                    value={inviteRole}
                                    onChange={(e) => setInviteRole(e.target.value)}
                                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                >
                                    <option value="TEACHER">Teacher</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                            <button
                                onClick={handleSendInvite}
                                disabled={sending || !!inviteLink}
                                className={`w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors ${(sending || inviteLink) ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {sending ? 'Sending...' : inviteLink ? 'Invite Created!' : 'Send Invite'}
                            </button>

                            {/* Invite Link Copy Section */}
                            {inviteLink && (
                                <div className="mt-4 p-4 bg-slate-100 rounded-xl space-y-2 animate-in fade-in">
                                    <label className="block text-sm font-bold text-slate-700">Invite Link</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={inviteLink}
                                            readOnly
                                            className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 truncate"
                                        />
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(inviteLink);
                                                setInviteResult({ type: 'success', message: 'Link copied!' });
                                            }}
                                            className="px-4 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors flex items-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">content_copy</span>
                                            Copy
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-500">Share this link with the teacher to invite them.</p>
                                </div>
                            )}

                            {inviteLink && (
                                <button
                                    onClick={() => {
                                        setInviteModalOpen(false);
                                        setInviteResult(null);
                                        setInviteLink(null);
                                        setInviteEmail('');
                                    }}
                                    className="w-full border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                    Done
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {editModalOpen && editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Edit {editingUser.role}</h3>
                            <button onClick={() => { setEditModalOpen(false); setEditingUser(null); }} className="text-slate-400 hover:text-slate-600">
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
                                <label className="block text-sm font-bold text-slate-700 mb-1">Email *</label>
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Role</label>
                                <select
                                    value={editForm.role}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                >
                                    <option value="TEACHER">Teacher</option>
                                    <option value="ADMIN">Admin</option>
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

            {/* Bulk Import Modal */}
            {importModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Bulk Import Users</h3>
                            <button onClick={() => setImportModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="space-y-5">
                            {/* Import Type Selection */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Import Type</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['teachers', 'students', 'parents'] as const).map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setImportType(type)}
                                            className={`py-2 px-3 rounded-lg text-sm font-bold capitalize transition-all ${importType === type
                                                    ? 'bg-primary text-white'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* CSV Format Info */}
                            <div className="bg-slate-50 rounded-xl p-4 text-sm">
                                <p className="font-bold text-slate-700 mb-2">CSV Format for {importType}:</p>
                                {importType === 'teachers' && (
                                    <code className="text-xs text-slate-600">First Name, Last Name, Email, Subjects, Address, Phone</code>
                                )}
                                {importType === 'students' && (
                                    <code className="text-xs text-slate-600">First Name, Last Name, Class Name, Grade, Email, Phone</code>
                                )}
                                {importType === 'parents' && (
                                    <code className="text-xs text-slate-600">First Name, Last Name, Email, Child Names, Phone</code>
                                )}
                            </div>

                            {/* File Upload */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Upload CSV File</label>
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                />
                            </div>

                            {/* Import Result */}
                            {importResult && (
                                <div className={`rounded-xl p-4 ${importResult.success > 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                                    <p className="font-bold text-slate-700">
                                        {importResult.success} imported successfully, {importResult.failed} failed
                                    </p>
                                    {importResult.errors.length > 0 && (
                                        <ul className="mt-2 text-sm text-red-600 list-disc list-inside">
                                            {importResult.errors.slice(0, 5).map((err, i) => (
                                                <li key={i}>{err}</li>
                                            ))}
                                            {importResult.errors.length > 5 && (
                                                <li>...and {importResult.errors.length - 5} more errors</li>
                                            )}
                                        </ul>
                                    )}
                                </div>
                            )}

                            {/* Import Button */}
                            <button
                                onClick={handleBulkImport}
                                disabled={!importFile || importing}
                                className={`w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors ${(!importFile || importing) ? 'opacity-70 cursor-not-allowed' : ''
                                    }`}
                            >
                                {importing ? 'Importing...' : `Import ${importType}`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
