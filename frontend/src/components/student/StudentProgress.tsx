"use client";

interface Badge {
    id: string;
    name: string;
    icon: string;
    color: string;
    earned: boolean;
}

interface StudentProgressProps {
    starsEarned?: number;
    streakDays?: number;
    badges?: Badge[];
}

const defaultBadges: Badge[] = [
    { id: '1', name: 'Star Reader', icon: '📚', color: 'bg-blue-100', earned: true },
    { id: '2', name: 'Math Learner', icon: '🔢', color: 'bg-green-100', earned: true },
    { id: '3', name: 'Explorer', icon: '🚀', color: 'bg-purple-100', earned: false },
];

export default function StudentProgress({ starsEarned = 12, streakDays = 5, badges }: StudentProgressProps) {
    const displayBadges = badges || defaultBadges;

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Progress Text */}
                <div>
                    <h2 className="text-lg font-bold text-slate-800 mb-1">Your Progress</h2>
                    <p className="text-slate-500 text-sm">
                        You've collected {starsEarned} stars this week. Keep going! ⭐
                    </p>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-3">
                    {displayBadges.map((badge) => (
                        <div
                            key={badge.id}
                            className={`w-12 h-12 rounded-full ${badge.color} flex items-center justify-center text-2xl relative ${badge.earned ? '' : 'opacity-40 grayscale'
                                }`}
                            title={badge.name}
                        >
                            {badge.icon}
                            {badge.earned && (
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-[10px]">✓</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Streak */}
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-full">
                    <span className="text-xl">🔥</span>
                    <span className="font-bold text-orange-600">{streakDays} day streak!</span>
                </div>
            </div>
        </div>
    );
}
