export default function ReportsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-display">Overview</h1>
                    <p className="text-slate-500 text-base mt-2">Performance metrics for the last 30 days.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">download</span>
                        Export
                    </button>
                    <button className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-primary/90 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        New Assessment
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                {['Class: Year 5A', 'Subject: All Subjects', 'Student: All Students'].map((filter) => (
                    <button key={filter} className="flex h-9 items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 pl-4 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                        {filter}
                        <span className="material-symbols-outlined text-[20px] text-slate-400">expand_more</span>
                    </button>
                ))}
                <button className="ml-auto flex h-9 items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 pl-4 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                    <span className="material-symbols-outlined text-[18px] text-slate-500">calendar_today</span>
                    Period: Last 30 Days
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: 'Class Average', value: '82%', icon: 'school', color: 'text-primary', bg: 'bg-primary/10', trend: '+1.5%', trendType: 'up' },
                    { title: 'Completion Rate', value: '94%', icon: 'assignment_turned_in', color: 'text-blue-600', bg: 'bg-blue-100', trend: '+0.8%', trendType: 'up' },
                    { title: 'Needs Attention', value: '3 Students', icon: 'warning', color: 'text-secondary', bg: 'bg-secondary/10', trend: 'No Change', trendType: 'neutral' }
                ].map((stat, i) => (
                    <div key={i} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
                                <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
                            </div>
                            <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${stat.trendType === 'neutral' ? 'bg-slate-100 text-slate-500' : 'bg-green-50 text-green-700'}`}>
                                {stat.trendType !== 'neutral' && <span className="material-symbols-outlined text-[16px] mr-1">trending_up</span>}
                                {stat.trend}
                            </span>
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-bold">{stat.title}</p>
                            <p className="text-slate-900 text-3xl font-black tracking-tight mt-1">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col h-96">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-lg font-bold text-slate-900">Average Performance History</h4>
                        <button className="text-sm text-primary font-bold hover:underline">View Details</button>
                    </div>
                    <div className="flex-1 flex items-end gap-4 relative px-2">
                        {/* Mock Bars */}
                        {[40, 55, 45, 60, 75, 65, 80].map((h, i) => (
                            <div key={i} className="group flex flex-col items-center flex-1 gap-2 cursor-pointer h-full justify-end">
                                <div className="w-full bg-primary/10 rounded-t-lg group-hover:bg-primary/20 transition-all relative overflow-hidden" style={{ height: `${h}%` }}>
                                    <div className="absolute bottom-0 w-full bg-primary rounded-t-lg transition-all duration-500" style={{ height: '85%' }}></div>
                                </div>
                                <span className="text-xs font-bold text-slate-400">W{i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Secondary Chart */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col h-96">
                    <h4 className="text-lg font-bold text-slate-900 mb-6">Subject Breakdown</h4>
                    <div className="flex-1 flex flex-col justify-center gap-6">
                        {[
                            { label: 'Mathematics', val: 88, color: 'bg-primary', text: 'text-primary' },
                            { label: 'Science', val: 72, color: 'bg-secondary', text: 'text-secondary' },
                            { label: 'English', val: 91, color: 'bg-blue-400', text: 'text-blue-400' },
                            { label: 'History', val: 84, color: 'bg-teal-500', text: 'text-teal-500' }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col gap-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-bold text-slate-700">{item.label}</span>
                                    <span className={`font-bold ${item.text}`}>{item.val}%</span>
                                </div>
                                <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.val}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Student List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="text-xl font-bold text-slate-900">Student Progress</h4>
                    <div className="flex gap-2">
                        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"><span className="material-symbols-outlined">filter_list</span></button>
                        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"><span className="material-symbols-outlined">sort</span></button>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Attendance</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Avg. Score</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Assignments</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {[
                                { name: 'Liam Johnson', att: 98, score: 92, done: '12/12', status: 'On Track', statusColor: 'bg-green-100 text-green-700', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXmxNMqcb1YEsnBXCV1rXvGAz8xK5iz7fGUxWgZunjE0qjzj7wNRh36i6SFyh2k8gJT7Kf87R5sw1ZWW_JQjZSNGAmEiaqnikKD4rqijCRk35GDmhoE9b-gHKIVeux5QqSdLSSfFBygfvkGsOab9AmAiC6ENeQ6nNGRQHND1IoH_ZaAu89hZFIVPE0t2yoKIsRWmvjWGcrEbUKUNjJT1Nk0bTCwgXyJiQM78QBpE_mA0FA8jxzV2nNcPqN7etjTMWbuHrhLq3S37B5' },
                                { name: 'Noah Williams', att: 80, score: 65, done: '8/12', status: 'Needs Support', statusColor: 'bg-red-50 text-secondary', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdlRvWDiAap1whTxzHJ1m9X7L20xr1FKTlVkXUu4aNCpS_r_f7uizm0LN3KJ_y8BzQGdK2-283_G9G7yLUNDIvf7X2Hy9F-lCPUtJcvG6y-2pvM103FbaHbvFkHKNDjWE5Sj8nmGrBlc31aJwHuCS6gufU_JAdfwopvJPic3INU9YC8Db-E26R29qx0TgW-m5djW4V0LLJDYC-cLOoAkrKJG5Vx2MQ8cTJcvIVqeQkQCMXzyNaFQW8R4EtkL4oWwqUEU1mo7OnLeel' },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-cover bg-center" style={{ backgroundImage: `url("${row.img}")` }}></div>
                                            <span className="font-bold text-slate-900">{row.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-16 rounded-full bg-slate-100 overflow-hidden">
                                                <div className={`h-full ${row.att > 90 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${row.att}%` }}></div>
                                            </div>
                                            <span className="text-xs font-bold text-slate-600">{row.att}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-700">{row.score}%</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{row.done}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${row.statusColor}`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">more_vert</span></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
