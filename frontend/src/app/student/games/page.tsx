"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface Game {
    id: string;
    title: string;
    description: string;
    subject: string;
    grade: string;
    imageUrl: string;
    gameType: string;
    assignedAt: string | null;
    dueDate: string | null;
}

export default function StudentGamesPage() {
    const router = useRouter();
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [subjectFilter, setSubjectFilter] = useState('all');

    useEffect(() => {
        fetchGames();
    }, [subjectFilter]);

    const fetchGames = async () => {
        setLoading(true);
        try {
            const data = await api.get(`/student/games${subjectFilter !== 'all' ? `?subject=${subjectFilter}` : ''}`);
            setGames(data);
        } catch (err) {
            console.error('Failed to fetch games:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePlay = (gameId: string) => {
        router.push(`/games/play/${gameId}`);
    };

    const subjects = ['all', 'Math', 'Phonics', 'English'];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Learning Games 🎮</h1>
                <p className="text-slate-500">Play fun educational games assigned by your teacher</p>
            </div>

            {/* Subject Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {subjects.map((s) => (
                    <button
                        key={s}
                        onClick={() => setSubjectFilter(s)}
                        className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${subjectFilter === s
                                ? 'bg-primary text-white'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                    >
                        {s === 'all' ? '🎮 All Games' : s === 'Math' ? '🧮 Math' : s === 'Phonics' ? '📚 Phonics' : '✏️ English'}
                    </button>
                ))}
            </div>

            {/* Loading */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : games.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                    <span className="text-5xl mb-4 block">🎮</span>
                    <p className="text-slate-500">No games available yet</p>
                    <p className="text-slate-400 text-sm mt-1">Your teacher will assign games soon!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {games.map((game) => (
                        <div key={game.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-100">
                            <div className="relative h-40 bg-slate-100 overflow-hidden">
                                <img
                                    src={game.imageUrl}
                                    alt={game.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-slate-700 text-xs font-bold">
                                    {game.subject}
                                </div>
                                {game.assignedAt && (
                                    <div className="absolute top-3 left-3 bg-primary/90 px-3 py-1 rounded-full text-white text-xs font-bold">
                                        Assigned
                                    </div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div
                                        className="bg-white/90 rounded-full p-3 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg cursor-pointer"
                                        onClick={() => handlePlay(game.id)}
                                    >
                                        <span className="material-symbols-outlined text-primary text-3xl">play_arrow</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
                                        {game.gameType.replace('_', ' ')}
                                    </span>
                                    <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-bold text-slate-500">
                                        {game.grade}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">{game.title}</h3>
                                <p className="text-slate-500 text-sm line-clamp-2 mb-4">{game.description}</p>

                                {game.dueDate && (
                                    <p className="text-xs text-orange-500 font-bold mb-3">
                                        Due: {new Date(game.dueDate).toLocaleDateString()}
                                    </p>
                                )}

                                <button
                                    onClick={() => handlePlay(game.id)}
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-colors shadow-lg shadow-green-500/20"
                                >
                                    <span className="material-symbols-outlined">play_arrow</span>
                                    Play Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
