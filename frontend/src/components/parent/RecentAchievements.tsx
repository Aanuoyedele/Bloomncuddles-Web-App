"use client";

interface Achievement {
    id: string;
    title: string;
    description: string;
    childName: string;
    icon: string;
    date: string;
}

interface RecentAchievementsProps {
    achievements?: Achievement[];
}

export default function RecentAchievements({ achievements }: RecentAchievementsProps) {
    // Default achievements if none provided
    const defaultAchievements: Achievement[] = [
        { id: '1', title: 'Perfect Attendance', description: 'No absences this term', childName: 'Leo', icon: '🏆', date: '2 days ago' },
        { id: '2', title: 'Science Whiz', description: "Scored 100% on science quiz", childName: 'Leo', icon: '🔬', date: '5 days ago' },
        { id: '3', title: 'Kindness Award', description: 'Recognized for helping classmates', childName: 'Mia', icon: '❤️', date: '1 week ago' },
    ];

    const displayAchievements = achievements || defaultAchievements;

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-yellow-500">emoji_events</span>
                Recent Achievements
            </h2>

            {displayAchievements.length === 0 ? (
                <div className="text-center py-8">
                    <span className="text-4xl mb-2 block">🌟</span>
                    <p className="text-slate-500">Achievements will appear here!</p>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayAchievements.map((achievement) => (
                        <div
                            key={achievement.id}
                            className="p-4 rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 hover:shadow-md transition-all group"
                        >
                            {/* Medal Icon */}
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                {achievement.icon}
                            </div>

                            {/* Info */}
                            <h3 className="font-bold text-slate-800 text-sm">{achievement.title}</h3>
                            <p className="text-xs text-slate-500 mb-2">{achievement.description}</p>

                            {/* Footer */}
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-primary font-bold">{achievement.childName}</span>
                                <span className="text-slate-400">{achievement.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
