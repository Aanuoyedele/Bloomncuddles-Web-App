"use client";

import Link from "next/link";

interface Homework {
    id: string;
    title: string;
    subject: string;
    dueDate: string;
    childName: string;
    status: 'pending' | 'submitted' | 'overdue';
}

interface UpcomingHomeworkProps {
    homework?: Homework[];
}

const subjectIcons: Record<string, { icon: string; color: string }> = {
    'Math': { icon: '🧮', color: 'bg-blue-100' },
    'Maths': { icon: '🧮', color: 'bg-blue-100' },
    'English': { icon: '📝', color: 'bg-pink-100' },
    'Science': { icon: '🔬', color: 'bg-green-100' },
    'Reading': { icon: '📚', color: 'bg-orange-100' },
    'Art': { icon: '🎨', color: 'bg-purple-100' },
    'default': { icon: '📋', color: 'bg-slate-100' },
};

export default function UpcomingHomework({ homework }: UpcomingHomeworkProps) {
    // Default data if none provided
    const defaultHomework: Homework[] = [
        { id: '1', title: 'Algebra Practice', subject: 'Math', dueDate: '2026-01-15', childName: 'Leo', status: 'pending' },
        { id: '2', title: 'The Tudors Essay', subject: 'English', dueDate: '2026-01-16', childName: 'Leo', status: 'pending' },
        { id: '3', title: 'Solar System Project', subject: 'Science', dueDate: '2026-01-18', childName: 'Mia', status: 'submitted' },
    ];

    const displayHomework = homework || defaultHomework;

    const getDaysRemaining = (dueDate: string) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diff < 0) return 'Overdue';
        if (diff === 0) return 'Due today';
        if (diff === 1) return 'Due tomorrow';
        return `${diff} days left`;
    };

    const getSubjectStyle = (subject: string) => {
        return subjectIcons[subject] || subjectIcons['default'];
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-orange-500">assignment</span>
                    Upcoming Homework
                </h2>
                <Link href="/parent/homework" className="text-primary text-sm font-bold hover:underline">
                    View All Homework →
                </Link>
            </div>

            {displayHomework.length === 0 ? (
                <div className="text-center py-8">
                    <span className="text-4xl mb-2 block">🎉</span>
                    <p className="text-slate-500">No upcoming homework!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {displayHomework.slice(0, 5).map((hw) => {
                        const style = getSubjectStyle(hw.subject);
                        const daysText = getDaysRemaining(hw.dueDate);
                        const isOverdue = daysText === 'Overdue';
                        const isDueSoon = daysText.includes('today') || daysText.includes('tomorrow');

                        return (
                            <div
                                key={hw.id}
                                className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                            >
                                {/* Subject Icon */}
                                <div className={`w-10 h-10 ${style.color} rounded-xl flex items-center justify-center text-xl`}>
                                    {style.icon}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-slate-800 text-sm truncate">{hw.title}</h3>
                                    <p className="text-xs text-slate-500">
                                        {hw.subject} • {hw.childName}
                                    </p>
                                </div>

                                {/* Status */}
                                <div className="text-right">
                                    {hw.status === 'submitted' ? (
                                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                            ✓ Submitted
                                        </span>
                                    ) : (
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${isOverdue ? 'text-red-600 bg-red-50' :
                                                isDueSoon ? 'text-orange-600 bg-orange-50' :
                                                    'text-slate-600 bg-slate-50'
                                            }`}>
                                            {daysText}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
