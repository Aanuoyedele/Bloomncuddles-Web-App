"use client";

import Link from "next/link";
import { useRef } from "react";

interface ActivityCard {
    id: string;
    title: string;
    type: 'game' | 'story' | 'video' | 'quiz';
    imageUrl?: string;
    level?: string;
    duration?: string;
    href: string;
}

const typeStyles = {
    game: { bg: 'bg-orange-100', text: 'text-orange-600', icon: 'sports_esports' },
    story: { bg: 'bg-pink-100', text: 'text-pink-600', icon: 'auto_stories' },
    video: { bg: 'bg-purple-100', text: 'text-purple-600', icon: 'play_circle' },
    quiz: { bg: 'bg-green-100', text: 'text-green-600', icon: 'quiz' },
};

const placeholderImages = [
    'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=300&h=200&fit=crop', // Solar system
    'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=300&h=200&fit=crop', // Lion
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=300&h=200&fit=crop', // Numbers
    'https://images.unsplash.com/photo-1584824388173-05151e1ad81f?w=300&h=200&fit=crop', // Dinosaur
];

interface PickedForYouProps {
    activities?: ActivityCard[];
}

export default function PickedForYou({ activities }: PickedForYouProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Default activities if none provided
    const defaultActivities: ActivityCard[] = [
        { id: '1', title: 'Solar System Safari', type: 'game', level: '8 mins', href: '/student/games/1', imageUrl: placeholderImages[0] },
        { id: '2', title: 'The Brave Little Lion', type: 'story', level: '5 chapters', href: '/student/library/1', imageUrl: placeholderImages[1] },
        { id: '3', title: 'Number Ninja Challenge', type: 'quiz', level: 'Level 1', href: '/student/games/2', imageUrl: placeholderImages[2] },
        { id: '4', title: 'Prehistoric Pals', type: 'video', level: '6 min video', href: '/student/library/2', imageUrl: placeholderImages[3] },
    ];

    const displayActivities = activities || defaultActivities;

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Picked for You</h2>
                <Link href="/student/explore" className="text-primary font-medium text-sm hover:underline">
                    See all recommendations →
                </Link>
            </div>

            <div className="relative group">
                {/* Scroll buttons */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-600 hover:bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1/2"
                >
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-600 hover:bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity translate-x-1/2"
                >
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>

                {/* Scrollable container */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {displayActivities.map((activity) => {
                        const style = typeStyles[activity.type];
                        return (
                            <Link
                                key={activity.id}
                                href={activity.href}
                                className="flex-shrink-0 w-[200px] bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group/card"
                            >
                                {/* Image */}
                                <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                                    {activity.imageUrl ? (
                                        <img
                                            src={activity.imageUrl}
                                            alt={activity.title}
                                            className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className={`w-full h-full ${style.bg} flex items-center justify-center`}>
                                            <span className={`material-symbols-outlined text-4xl ${style.text}`}>{style.icon}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`${style.bg} ${style.text} px-2 py-0.5 rounded-full text-xs font-bold capitalize`}>
                                            {activity.type}
                                        </span>
                                        {activity.level && (
                                            <span className="text-slate-400 text-xs">{activity.level}</span>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-slate-800 text-sm line-clamp-2">{activity.title}</h3>
                                    <button className="mt-3 w-full py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-primary hover:text-white transition-colors">
                                        {activity.type === 'game' || activity.type === 'quiz' ? 'Start Game' :
                                            activity.type === 'video' ? 'Watch Video' : 'Open Book'}
                                    </button>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
