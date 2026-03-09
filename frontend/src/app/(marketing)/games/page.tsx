"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// The same games data used in the dashboard with proper cover images
const GAMES = [
    { id: 'phonics-match', title: 'Phonics Match', description: 'Match letters with their sounds!', category: 'Phonics', grade: 'Primary 1', imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400' },
    { id: 'number-bonds', title: 'Number Bonds', description: 'Find number pairs that make 10!', category: 'Math', grade: 'Primary 1', imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400' },
    { id: 'rhyme-time', title: 'Rhyme Time', description: 'Find words that rhyme!', category: 'Phonics', grade: 'Primary 1', imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400' },
    { id: 'shape-sorter', title: 'Shape Sorter', description: 'Identify 2D and 3D shapes!', category: 'Math', grade: 'Primary 2', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
    { id: 'word-builder', title: 'Word Builder', description: 'Build words by arranging letters!', category: 'Phonics', grade: 'Primary 2', imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400' },
    { id: 'counting-fun', title: 'Counting Fun 1-20', description: 'Count objects and select the number!', category: 'Math', grade: 'Primary 1', imageUrl: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400' },
    { id: 'sight-words-race', title: 'Sight Words Race', description: 'Recognize sight words quickly!', category: 'Phonics', grade: 'Primary 2', imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400' },
    { id: 'simple-subtraction', title: 'Simple Subtraction', description: 'Practice subtraction problems!', category: 'Math', grade: 'Primary 2', imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400' },
    { id: 'pattern-match', title: 'Pattern Match', description: 'Complete the pattern sequence!', category: 'Math', grade: 'Primary 3', imageUrl: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=400' },
];


export default function PublicGamesPage() {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = ["All", "Math", "Phonics"];

    const filteredGames = selectedCategory === "All"
        ? GAMES
        : GAMES.filter(g => g.category === selectedCategory);

    const handlePlay = (gameId: string) => {
        router.push(`/games/play/${gameId}`);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Hero Section */}
            <div className="relative bg-[#1d1144] overflow-hidden pt-20">
                <div className="absolute inset-0 opacity-10 mix-blend-plus-lighter" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 69px, #94a3b8 69px, #94a3b8 70px), repeating-linear-gradient(90deg, transparent, transparent 69px, #94a3b8 69px, #94a3b8 70px)', backgroundSize: '70px 70px' }} />
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-secondary/10 text-secondary font-bold text-sm mb-6 animate-bounce">
                        🎮 Free for Everyone!
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-display tracking-tight">
                        Game <span className="text-[#b7e1ef]">Zone</span>
                    </h1>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed">
                        Interactive phonics and math games for Primary 1-3 students.
                        <span className="font-bold text-[#b7e1ef]"> 20 questions per game!</span>
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
                            <span className="text-xl">🎯</span>
                            <span className="font-bold text-slate-700">9 Games</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
                            <span className="text-xl">🔄</span>
                            <span className="font-bold text-slate-700">Randomized Questions</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
                            <span className="text-xl">⭐</span>
                            <span className="font-bold text-slate-700">Star Ratings</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-[15px] py-[15px] rounded-[6px] font-bold text-sm transition-all transform hover:scale-105 ${selectedCategory === cat
                                    ? 'bg-white text-[#1d1144] shadow-lg shadow-white/20'
                                    : 'bg-white/10 text-white backdrop-blur-sm border border-white/20 hover:bg-white/20'
                                    }`}
                            >
                                {cat === 'Math' ? '🧮 Math' : cat === 'Phonics' ? '📚 Phonics' : '🎮 All Games'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Games Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredGames.map((game) => (
                        <div key={game.id} className="group bg-white rounded-[32px] overflow-hidden shadow-2xl hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full border border-slate-100">
                            <div className="relative h-48 bg-slate-100 overflow-hidden w-full">
                                <img
                                    src={game.imageUrl}
                                    alt={game.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div className="absolute top-4 right-4 flex gap-2 z-20">
                                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[#1d1144] text-xs font-bold shadow-sm">
                                        {game.grade}
                                    </div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <button 
                                        className="size-16 bg-white rounded-full flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 group/btn" 
                                        onClick={() => handlePlay(game.id)}
                                    >
                                        <span className="material-symbols-outlined text-[#0f2854] text-3xl ml-1 group-hover/btn:text-primary transition-colors">play_arrow</span>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="p-8 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">{game.category}</p>
                                        <h3 className="text-2xl font-extrabold text-slate-900 leading-tight group-hover:text-primary transition-colors">{game.title}</h3>
                                    </div>
                                </div>
                                <p className="text-slate-500 text-[15px] leading-relaxed mb-8 flex-grow">{game.description}</p>

                                <button
                                    onClick={() => handlePlay(game.id)}
                                    className="w-full bg-[#0f2854] hover:bg-opacity-90 text-white font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-navy/20 group/btn mt-auto px-[15px] py-[15px] rounded-[6px]"
                                >
                                    <span className="material-symbols-outlined group-hover/btn:translate-x-1 transition-transform">sports_esports</span>
                                    Play Interactive Game
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="bg-primary py-16 px-4">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">Want More Features?</h2>
                    <p className="text-xl opacity-90 mb-8">
                        Sign up to track student progress, assign games to classes, and access teacher dashboards!
                    </p>
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-2 bg-white text-primary font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all px-[15px] py-[15px] rounded-[6px]"
                    >
                        <span>Get Started Free</span>
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
