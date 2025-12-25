"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import Alert from "@/components/Alert";
import { useDashboard } from "../context";

interface SchoolSettings {
    id: string;
    name: string;
    email: string | null;
    address: string | null;
    logoUrl: string | null;
    primaryColor: string | null;
    theme: string | null;
    academicYear: string | null;
    currentTerm: string | null;
}

export default function SettingsPage() {
    const { refreshSchoolSettings } = useDashboard();
    const [settings, setSettings] = useState<SchoolSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        logoUrl: '',
        primaryColor: '#486fa1',
        theme: 'light',
        academicYear: '2024-2025',
        currentTerm: 'Term 1'
    });

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const data = await api.get('/school/settings');
            setSettings(data);
            setFormData({
                name: data.name || '',
                email: data.email || '',
                address: data.address || '',
                logoUrl: data.logoUrl || '',
                primaryColor: data.primaryColor || '#486fa1',
                theme: data.theme || 'light',
                academicYear: data.academicYear || '2024-2025',
                currentTerm: data.currentTerm || 'Term 1'
            });
        } catch (err: any) {
            setError(err.message || 'Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            await api.patch('/school/settings', formData);
            // Refresh school settings in context to update sidebar and apply theme
            await refreshSchoolSettings();
            setSuccess('Settings saved successfully! Changes applied.');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Handle logo file upload
    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file');
            return;
        }

        // Validate file size (max 500KB for base64)
        if (file.size > 500 * 1024) {
            setError('Logo must be less than 500KB');
            return;
        }

        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            setFormData(prev => ({ ...prev, logoUrl: base64 }));
        };
        reader.readAsDataURL(file);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-display">School Settings</h1>
                <p className="text-slate-500 text-base mt-2">Manage your school profile, branding, and academic details.</p>
            </div>

            {/* Alerts */}
            {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
            {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

            <div className="grid gap-6">
                {/* General Information */}
                <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">domain</span>
                        General Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">School Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => updateField('name', e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 bg-slate-50 font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">School Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => updateField('email', e.target.value)}
                                placeholder="admin@school.edu"
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 bg-slate-50 font-medium"
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-sm font-bold text-slate-700">Address</label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => updateField('address', e.target.value)}
                                placeholder="123 Education Lane, Learning City"
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 bg-slate-50 font-medium"
                            />
                        </div>
                    </div>
                </section>

                {/* Branding */}
                <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary">palette</span>
                        Branding & Appearance
                    </h2>
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex flex-col gap-3 items-center">
                            <label className="w-32 h-32 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors overflow-hidden relative">
                                {formData.logoUrl ? (
                                    <img src={formData.logoUrl} alt="School Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center">
                                        <span className="material-symbols-outlined text-3xl text-slate-400">cloud_upload</span>
                                        <p className="text-xs text-slate-500 font-bold mt-1">Upload Logo</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </label>
                            {formData.logoUrl ? (
                                <button
                                    onClick={() => setFormData(prev => ({ ...prev, logoUrl: '' }))}
                                    className="text-xs text-red-500 hover:text-red-600 font-bold"
                                >
                                    Remove Logo
                                </button>
                            ) : (
                                <p className="text-xs text-slate-400">PNG, JPG up to 500KB</p>
                            )}
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Primary Color</label>
                                <div className="flex gap-3 items-center">
                                    <input
                                        type="color"
                                        value={formData.primaryColor}
                                        onChange={(e) => updateField('primaryColor', e.target.value)}
                                        className="h-10 w-16 p-0 border-0 rounded cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={formData.primaryColor}
                                        onChange={(e) => updateField('primaryColor', e.target.value)}
                                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Theme Mode</label>
                                <select
                                    value={formData.theme}
                                    onChange={(e) => updateField('theme', e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 bg-slate-50 font-medium"
                                >
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                    <option value="system">System</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Academic Year */}
                <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-500">calendar_month</span>
                        Academic Settings
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Current Academic Year</label>
                            <select
                                value={formData.academicYear}
                                onChange={(e) => updateField('academicYear', e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 bg-slate-50 font-medium"
                            >
                                <option value="2023-2024">2023 - 2024</option>
                                <option value="2024-2025">2024 - 2025</option>
                                <option value="2025-2026">2025 - 2026</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Term / Semester</label>
                            <select
                                value={formData.currentTerm}
                                onChange={(e) => updateField('currentTerm', e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 bg-slate-50 font-medium"
                            >
                                <option value="Term 1">Term 1 (Autumn)</option>
                                <option value="Term 2">Term 2 (Spring)</option>
                                <option value="Term 3">Term 3 (Summer)</option>
                            </select>
                        </div>
                    </div>
                </section>

                <div className="flex justify-end pt-4">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 flex items-center gap-2 ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {saving ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-[20px]">save</span>
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

