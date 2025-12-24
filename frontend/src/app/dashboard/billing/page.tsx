export default function BillingPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-display">Billing & Subscription</h1>
                <p className="text-slate-500 text-base mt-2">Manage your subscription plan and payment history.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Current Plan */}
                <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-slate-300 text-sm font-bold uppercase tracking-wider">Current Plan</p>
                                <h2 className="text-3xl font-bold mt-1">Premium Schools</h2>
                            </div>
                            <span className="bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-white">Active</span>
                        </div>
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-green-400">check_circle</span>
                                <span className="font-medium text-slate-100">Unlimited Students & Teachers</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-green-400">check_circle</span>
                                <span className="font-medium text-slate-100">Advanced Analytics & Reports</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-green-400">check_circle</span>
                                <span className="font-medium text-slate-100">Priority Support 24/7</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-2xl font-bold">$299<span className="text-sm text-slate-400 font-medium">/month</span></p>
                                <p className="text-sm text-slate-400 mt-1">Renews on Jan 15, 2025</p>
                            </div>
                            <button className="bg-white text-slate-900 px-6 py-2.5 rounded-xl font-bold hover:bg-slate-100 transition-colors">Manage Plan</button>
                        </div>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Payment Method</h3>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-8 bg-slate-100 rounded border border-slate-200 flex items-center justify-center">
                                <span className="text-xs font-bold text-slate-500">VISA</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">•••• 4242</p>
                                <p className="text-xs text-slate-500">Expires 12/28</p>
                            </div>
                        </div>
                        <div className="text-sm text-slate-500">
                            <p>Billing Address:</p>
                            <p className="font-medium text-slate-700">123 Education Lane, NY</p>
                        </div>
                    </div>
                    <button className="w-full mt-4 border border-slate-200 text-slate-700 font-bold py-2.5 rounded-xl hover:bg-slate-50 transition-colors">Update Card</button>
                </div>
            </div>

            {/* Invoice History */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900">Invoice History</h3>
                    <button className="text-sm text-primary font-bold hover:underline">Download All</button>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Invoice ID</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {[
                            { id: 'INV-2024-001', date: 'Dec 15, 2024', amount: '$299.00', status: 'Paid' },
                            { id: 'INV-2024-002', date: 'Nov 15, 2024', amount: '$299.00', status: 'Paid' },
                            { id: 'INV-2024-003', date: 'Oct 15, 2024', amount: '$299.00', status: 'Paid' },
                        ].map((inv, i) => (
                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">{inv.id}</td>
                                <td className="px-6 py-4 text-sm text-slate-500">{inv.date}</td>
                                <td className="px-6 py-4 font-bold text-slate-700">{inv.amount}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                        {inv.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 text-slate-400 hover:text-slate-700 transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">download</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
