"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

const slides = [
    {
        image: "https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=800&h=800&fit=crop",
        alt: "Happy young children playing with colorful educational blocks",
        quote: "\u201cThe most intuitive tool for our pre-school classroom yet.\u201d",
        author: "Sarah J., Head Teacher",
        icon: "favorite",
        iconBg: "bg-secondary",
    },
    {
        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=800&fit=crop",
        alt: "Children learning together in a bright classroom",
        quote: "\u201cOur students are more engaged and excited to learn every day.\u201d",
        author: "Amina K., Nursery Director",
        icon: "school",
        iconBg: "bg-primary",
    },
    {
        image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&h=800&fit=crop",
        alt: "Teacher helping young students with activities",
        quote: "\u201cBloomncuddles makes balancing screen time and wellness seamless.\u201d",
        author: "David O., Early Years Educator",
        icon: "psychology",
        iconBg: "bg-primary-dark",
    },
    {
        image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=800&fit=crop",
        alt: "Group of diverse children smiling in classroom",
        quote: "\u201cFinally, a platform built with African children in mind.\u201d",
        author: "Ngozi A., School Administrator",
        icon: "public",
        iconBg: "bg-card-orange",
    },
];

export default function HeroSlider() {
    const [current, setCurrent] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const goToSlide = useCallback(
        (index: number) => {
            if (isTransitioning || index === current) return;
            setIsTransitioning(true);
            setCurrent(index);
            setTimeout(() => setIsTransitioning(false), 600);
        },
        [current, isTransitioning]
    );

    // Auto-advance every 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            goToSlide((current + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [current, goToSlide]);

    return (
        <div className="relative">
            {/* Rotated background card */}
            <div className="absolute -inset-4 bg-primary/5 rounded-[2.5rem] rotate-3"></div>

            {/* Image container */}
            <div className="relative aspect-square w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden border-8 border-white">
                {/* All images stacked, crossfade via opacity */}
                {slides.map((slide, i) => (
                    <div
                        key={i}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                    >
                        <Image
                            src={slide.image}
                            alt={slide.alt}
                            width={800}
                            height={800}
                            className="w-full h-full object-cover"
                            priority={i === 0}
                        />
                    </div>
                ))}

                {/* Quote overlay — crossfades in sync */}
                <div className="absolute bottom-6 left-6 right-6 z-20">
                    {slides.map((slide, i) => (
                        <div
                            key={i}
                            className={`absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/50 transition-all duration-700 ease-in-out ${
                                i === current
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 translate-y-4 pointer-events-none"
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className={`size-12 rounded-full ${slide.iconBg} flex items-center justify-center text-white shrink-0`}
                                >
                                    <span className="material-symbols-outlined">
                                        {slide.icon}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 italic">
                                        {slide.quote}
                                    </p>
                                    <p className="text-xs text-slate-500 font-medium">
                                        — {slide.author}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Dot indicators */}
                <div className="absolute top-5 right-5 z-20 flex gap-2">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goToSlide(i)}
                            className={`rounded-full transition-all duration-300 ${
                                i === current
                                    ? "w-6 h-2.5 bg-primary"
                                    : "w-2.5 h-2.5 bg-white/60 hover:bg-white/90"
                            }`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
