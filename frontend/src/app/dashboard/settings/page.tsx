export default function SettingsPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-display">School Settings</h1>
                <p className="text-slate-500 text-base mt-2">Manage your school profile, branding, and academic details.</p>
            </div>

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
                            <input type="text" defaultValue="Bloom High School" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 bg-slate-50 font-medium" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">School Email</label>
                            <input type="email" defaultValue="admin@bloomhigh.edu" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 bg-slate-50 font-medium" />
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-sm font-bold text-slate-700">Address</label>
                            <input type="text" defaultValue="123 Education Lane, Learning City, ST 12345" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 bg-slate-50 font-medium" />
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
                            <div className="w-32 h-32 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
                                <div className="text-center">
                                    <span className="material-symbols-outlined text-3xl text-slate-400">cloud_upload</span>
                                    <p className="text-xs text-slate-500 font-bold mt-1">Upload Logo</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Primary Color</label>
                                <div className="flex gap-2 items-center">
                                    <input type="color" defaultValue="#ec4899" className="h-10 w-16 p-0 border-0 rounded" />
                                    <span className="text-sm font-medium text-slate-500">Pick the main brand color</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Theme Mode</label>
                                <select className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 bg-slate-50 font-medium">
                                    <option>Light</option>
                                    <option>Dark</option>
                                    <option>System</option>
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
                            <select className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 bg-slate-50 font-medium">
                                <option>2024 - 2025</option>
                                <option>2025 - 2026</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Term / Semester</label>
                            <select className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 bg-slate-50 font-medium">
                                <option>Term 1 (Autumn)</option>
                                <option>Term 2 (Spring)</option>
                                <option>Term 3 (Summer)</option>
                            </select>
                        </div>
                    </div>
                </section>

                <div className="flex justify-end pt-4">
                    <button className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
