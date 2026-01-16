"use client";

interface WeeklyProgressChartProps {
    data?: { day: string; hours: number }[];
}

export default function WeeklyProgressChart({ data }: WeeklyProgressChartProps) {
    // Default data if none provided
    const defaultData = [
        { day: 'Mon', hours: 2.5 },
        { day: 'Tue', hours: 3.2 },
        { day: 'Wed', hours: 1.8 },
        { day: 'Thu', hours: 4.0 },
        { day: 'Fri', hours: 2.1 },
        { day: 'Sat', hours: 0.5 },
        { day: 'Sun', hours: 1.2 },
    ];

    const chartData = data || defaultData;
    const maxHours = Math.max(...chartData.map(d => d.hours), 5);

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">insights</span>
                    Weekly Progress
                </h2>
                <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600">
                    <option>This Week</option>
                    <option>Last Week</option>
                    <option>This Month</option>
                </select>
            </div>

            {/* Chart */}
            <div className="flex items-end gap-3 h-40">
                {chartData.map((item, index) => {
                    const heightPercent = (item.hours / maxHours) * 100;
                    const isToday = index === new Date().getDay() - 1;

                    return (
                        <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
                            {/* Bar */}
                            <div className="w-full flex flex-col items-center justify-end" style={{ height: '120px' }}>
                                <div
                                    className={`w-full max-w-[40px] rounded-t-lg transition-all duration-500 ${isToday
                                            ? 'bg-gradient-to-t from-primary to-primary-light'
                                            : 'bg-gradient-to-t from-slate-200 to-slate-100'
                                        }`}
                                    style={{ height: `${Math.max(heightPercent, 5)}%` }}
                                />
                            </div>
                            {/* Label */}
                            <span className={`text-xs font-medium ${isToday ? 'text-primary' : 'text-slate-400'}`}>
                                {item.day}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Summary */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                    <p className="text-slate-500 text-sm">Total Learning Time</p>
                    <p className="text-2xl font-bold text-slate-800">
                        {chartData.reduce((sum, d) => sum + d.hours, 0).toFixed(1)} hrs
                    </p>
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm font-bold">
                    <span className="material-symbols-outlined text-[16px]">trending_up</span>
                    +12% vs last week
                </div>
            </div>
        </div>
    );
}
