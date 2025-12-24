"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function PublicGamesPage() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [guestName, setGuestName] = useState("");
    const [playingGame, setPlayingGame] = useState<number | null>(null);

    const categories = ["All", "Math", "Science", "Language", "Logic"];

    const games = [
        { id: 1, title: "Math Blaster", category: "Math", grade: "Grade 1-3", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuOTGgtHj-gNvnQy2Gv0yqXNuvAho_ywhYnQOYsB3z-HnMg_G60x5d-GzKhw89vG5TvuXj-7W6_5A5XyvX6Q4S9a2vE52sKqD435QjE-m1lC25d2Xg5nZ3JqV7K_0h9Lp5R8A6B3D1E4F2G5H7I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6", color: "bg-blue-500" },
        { id: 2, title: "Word Wizard", category: "Language", grade: "Grade 2-4", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuMqv55E_2Zq_5P6q0g1W2e3R4t5y6u7i8o9p0a1s2d3f4g5h6j7k8l9z0x1c2v3b4n5m6", color: "bg-purple-500" },
        { id: 3, title: "Science Explorer", category: "Science", grade: "Grade 3-5", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuL9k8j7h6g5f4d3s2a1q0w9e8r7t6y5u4i3o2p1", color: "bg-green-500" },
        { id: 4, title: "Logic Puzzle", category: "Logic", grade: "All Grades", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuN0m1n2b3v4c5x6z7l8k9j0h1g2f3d4s5a6", color: "bg-orange-500" },
        { id: 5, title: "Space Math", category: "Math", grade: "Grade 4-6", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuP9o8i7u6y5t4r3e2w1q0a9s8d7f6g5h4j3k2l1", color: "bg-indigo-500" },
        { id: 6, title: "Animal Kingdom", category: "Science", grade: "Grade 1-3", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuQ0w9e8r7t6y5u4i3o2p1a1s2d3f4g5h6j7k8l9", color: "bg-teal-500" },
    ];

    const filteredGames = selectedCategory === "All"
        ? games
        : games.filter(g => g.category === selectedCategory);

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Hero Section */}
            <div className="relative bg-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-secondary/10 text-secondary font-bold text-sm mb-6 animate-bounce">
                        🎮 Free for Everyone!
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 font-display tracking-tight">
                        Game <span className="text-primary">Zone</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Explore our collection of educational games designed to make learning fun.
                        No account needed—just pick a game and start playing!
                    </p>

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
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Games Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredGames.map((game) => (
                        <div key={game.id} className="group bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-100">
                            <div className={`relative h-48 rounded-2xl overflow-hidden mb-4 ${game.color} flex items-center justify-center`}>
                                {/* Abstract Geometric Pattern replacement for missing images */}
                                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"></div>
                                <span className="material-symbols-outlined text-white text-6xl drop-shadow-md transform group-hover:scale-110 transition-transform duration-300">
                                    {game.category === 'Math' ? 'calculate' :
                                        game.category === 'Science' ? 'science' :
                                            game.category === 'Language' ? 'auto_stories' : 'extension'}
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

                                <button
                                    onClick={() => setPlayingGame(game.id)}
                                    className="mt-4 w-full bg-slate-900 hover:bg-primary text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined">play_arrow</span>
                                    Play Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Guest Player Modal */}
            {playingGame && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-primary animate-gradient"></div>

                        <div className="text-center mb-8">
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-bounce">
                                <span className="material-symbols-outlined text-4xl text-primary">sports_esports</span>
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">Ready to Play?</h2>
                            <p className="text-slate-500">Enter a cool nickname to start!</p>
                        </div>

                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="SuperPlayer123"
                                className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-primary focus:bg-white text-lg font-bold text-center text-slate-900 outline-none transition-all"
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                                autoFocus
                            />

                            <button className="w-full h-14 bg-primary hover:bg-primary/90 text-white text-lg font-bold rounded-2xl shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
                                Start Game <span className="material-symbols-outlined">rocket_launch</span>
                            </button>

                            <button
                                onClick={() => setPlayingGame(null)}
                                className="w-full py-3 text-slate-400 font-bold hover:text-slate-600 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
