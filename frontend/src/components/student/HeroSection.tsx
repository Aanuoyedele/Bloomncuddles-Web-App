"use client";

import Link from "next/link";

interface HeroSectionProps {
    studentName: string;
    funThingsCount?: number;
}

export default function HeroSection({ studentName, funThingsCount = 5 }: HeroSectionProps) {
    const firstName = studentName.split(' ')[0];

    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-primary to-primary-light p-8 md:p-10">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/4" />
            <div className="absolute top-1/2 right-1/4 w-6 h-6 bg-yellow-300 rounded-full animate-pulse" />
            <div className="absolute bottom-1/4 right-1/3 w-4 h-4 bg-pink-300 rounded-full animate-bounce" />

            {/* Star decorations */}
            <div className="absolute top-8 right-20 text-2xl animate-spin-slow">⭐</div>
            <div className="absolute bottom-8 right-32 text-xl">✨</div>

            {/* Content */}
            <div className="relative z-10 max-w-2xl">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    Hi there, {firstName}! 👋
                </h1>
                <p className="text-white/80 text-lg mb-6">
                    You have <span className="font-bold text-yellow-300">{funThingsCount} fun things</span> waiting for you today.
                </p>
                <Link
                    href="/student/assignments"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                    Continue Learning
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </Link>
            </div>
        </div>
    );
}
