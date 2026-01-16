"use client";

import Link from "next/link";

interface QuickAccessCardProps {
    title: string;
    description: string;
    href: string;
    icon: string;
    color: 'blue' | 'green' | 'orange' | 'pink';
    buttonText: string;
}

const colorClasses = {
    blue: {
        bg: 'bg-blue-50',
        iconBg: 'bg-primary',
        button: 'bg-primary hover:bg-primary-dark',
    },
    green: {
        bg: 'bg-green-50',
        iconBg: 'bg-green-500',
        button: 'bg-green-500 hover:bg-green-600',
    },
    orange: {
        bg: 'bg-orange-50',
        iconBg: 'bg-orange-500',
        button: 'bg-orange-500 hover:bg-orange-600',
    },
    pink: {
        bg: 'bg-pink-50',
        iconBg: 'bg-secondary',
        button: 'bg-secondary hover:bg-secondary-light',
    },
};

function QuickAccessCard({ title, description, href, icon, color, buttonText }: QuickAccessCardProps) {
    const colors = colorClasses[color];

    return (
        <div className={`${colors.bg} rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}>
            <div className={`${colors.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                <span className="material-symbols-outlined text-white text-3xl">{icon}</span>
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-1">{title}</h3>
            <p className="text-slate-500 text-sm mb-4 line-clamp-2">{description}</p>
            <Link
                href={href}
                className={`${colors.button} text-white px-5 py-2 rounded-full font-bold text-sm transition-all hover:shadow-md`}
            >
                {buttonText}
            </Link>
        </div>
    );
}

interface QuickAccessGridProps {
    classCount?: number;
    pendingAssignments?: number;
    gamesCount?: number;
}

export default function QuickAccessGrid({ classCount = 0, pendingAssignments = 0, gamesCount = 0 }: QuickAccessGridProps) {
    const cards: QuickAccessCardProps[] = [
        {
            title: "My Classes",
            description: "Join your teachers and classmates",
            href: "/student/classes",
            icon: "school",
            color: "blue",
            buttonText: "Go to Class",
        },
        {
            title: "Assignments",
            description: pendingAssignments > 0 ? `Check your ${pendingAssignments} to-dos` : "Check your daily to-dos",
            href: "/student/assignments",
            icon: "task_alt",
            color: "green",
            buttonText: "View All",
        },
        {
            title: "Fun Games",
            description: gamesCount > 0 ? `${gamesCount} games to play!` : "Learn while having a blast!",
            href: "/student/games",
            icon: "sports_esports",
            color: "orange",
            buttonText: "Play Now",
        },
        {
            title: "Reading Room",
            description: "Discover amazing stories",
            href: "/student/library",
            icon: "menu_book",
            color: "pink",
            buttonText: "Start Reading",
        },
    ];

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800">Where to next?</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((card) => (
                    <QuickAccessCard key={card.title} {...card} />
                ))}
            </div>
        </div>
    );
}
