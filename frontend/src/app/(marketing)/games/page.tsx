"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// The same games data used in the dashboard
const GAMES = [
    { id: 'phonics-match', title: 'Phonics Match', description: 'Match letters with their sounds!', category: 'Phonics', grade: 'Primary 1', color: 'bg-pink-500', icon: 'abc' },
    { id: 'number-bonds', title: 'Number Bonds', description: 'Find number pairs that make 10!', category: 'Math', grade: 'Primary 1', color: 'bg-blue-500', icon: 'calculate' },
    { id: 'rhyme-time', title: 'Rhyme Time', description: 'Find words that rhyme!', category: 'Phonics', grade: 'Primary 1', color: 'bg-purple-500', icon: 'music_note' },
    { id: 'shape-sorter', title: 'Shape Sorter', description: 'Identify 2D and 3D shapes!', category: 'Math', grade: 'Primary 2', color: 'bg-green-500', icon: 'category' },
    { id: 'word-builder', title: 'Word Builder', description: 'Build words by arranging letters!', category: 'Phonics', grade: 'Primary 2', color: 'bg-orange-500', icon: 'spellcheck' },
    { id: 'counting-fun', title: 'Counting Fun 1-20', description: 'Count objects and select the number!', category: 'Math', grade: 'Primary 1', color: 'bg-teal-500', icon: 'tag' },
    { id: 'sight-words-race', title: 'Sight Words Race', description: 'Recognize sight words quickly!', category: 'Phonics', grade: 'Primary 2', color: 'bg-indigo-500', icon: 'visibility' },
    { id: 'simple-subtraction', title: 'Simple Subtraction', description: 'Practice subtraction problems!', category: 'Math', grade: 'Primary 2', color: 'bg-red-500', icon: 'remove' },
    { id: 'pattern-match', title: 'Pattern Match', description: 'Complete the pattern sequence!', category: 'Math', grade: 'Primary 3', color: 'bg-amber-500', icon: 'extension' },
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
            <div className="relative bg-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-secondary/10 text-secondary font-bold text-sm mb-6 animate-bounce">
                        🎮 Free for Everyone!
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 font-display tracking-tight">
                        Game <span className="text-primary">Zone</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
                        Interactive phonics and math games for Primary 1-3 students.
                        <span className="font-bold text-primary"> 20 questions per game!</span>
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
                                className={`px-6 py-3 rounded-full font-bold text-sm transition-all transform hover:scale-105 ${selectedCategory === cat
                                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGames.map((game) => (
                        <div key={game.id} className="group bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-100">
                            <div className={`relative h-40 rounded-2xl overflow-hidden mb-4 ${game.color} flex items-center justify-center`}>
                                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"></div>
                                <span className="material-symbols-outlined text-white text-6xl drop-shadow-md transform group-hover:scale-110 transition-transform duration-300">
                                    {game.icon}
                                </span>
                                <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold border border-white/30">
                                    {game.grade}
                                </div>
                            </div>

                            <div className="px-2">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">{game.category}</p>
                                        <h3 className="text-xl font-bold text-slate-900 leading-tight">{game.title}</h3>
                                    </div>
                                </div>
                                <p className="text-slate-500 text-sm mb-4">{game.description}</p>

                                <button
                                    onClick={() => handlePlay(game.id)}
                                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 hover:shadow-green-500/30"
                                >
                                    <span className="material-symbols-outlined">play_arrow</span>
                                    Play Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-primary to-secondary py-16 px-4">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">Want More Features?</h2>
                    <p className="text-xl opacity-90 mb-8">
                        Sign up to track student progress, assign games to classes, and access teacher dashboards!
                    </p>
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                    >
                        <span>Get Started Free</span>
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
