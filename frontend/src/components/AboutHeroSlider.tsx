"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

const slides = [
    {
        image: "https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=600&h=450&fit=crop",
        alt: "Happy children learning together",
        quote: "\u201cEvery child deserves joyful, purposeful learning.\u201d",
        author: "Bloomncuddles Team",
    },
    {
        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=450&fit=crop",
        alt: "Children in a bright classroom setting",
        quote: "\u201cTechnology should empower teachers, not replace them.\u201d",
        author: "Our Philosophy",
    },
    {
        image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&h=450&fit=crop",
        alt: "Teacher guiding young students",
        quote: "\u201cBalancing screen time with wellness is at the heart of what we do.\u201d",
        author: "Our Mission",
    },
    {
        image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=450&fit=crop",
        alt: "Diverse group of smiling children",
        quote: "\u201cBuilt for Africa, designed for every child on the planet.\u201d",
        author: "Our Vision",
    },
];

export default function AboutHeroSlider() {
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

    useEffect(() => {
        const timer = setInterval(() => {
            goToSlide((current + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [current, goToSlide]);

    return (
        <div className="relative flex-1 w-full max-w-lg">
            <div className="absolute -inset-4 bg-primary/5 rounded-[2.5rem] rotate-3"></div>
            <div className="relative aspect-[4/3] w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden border-8 border-white">
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
                            width={600}
                            height={450}
                            className="w-full h-full object-cover"
                            priority={i === 0}
                        />
                    </div>
                ))}

                {/* Quote overlay */}
                <div className="absolute bottom-4 left-4 right-4 z-20">
                    {slides.map((slide, i) => (
                        <div
                            key={i}
                            className={`absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/50 transition-all duration-700 ease-in-out ${
                                i === current
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 translate-y-4 pointer-events-none"
                            }`}
                        >
                            <p className="text-sm font-bold text-navy italic">{slide.quote}</p>
                            <p className="text-xs text-navy/50 font-medium mt-1">— {slide.author}</p>
                        </div>
                    ))}
                </div>

                {/* Dot indicators */}
                <div className="absolute top-4 right-4 z-20 flex gap-1.5">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goToSlide(i)}
                            className={`rounded-full transition-all duration-300 ${
                                i === current
                                    ? "w-5 h-2 bg-primary"
                                    : "w-2 h-2 bg-white/60 hover:bg-white/90"
                            }`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
