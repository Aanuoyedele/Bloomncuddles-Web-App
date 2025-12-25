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
}

interface ClassItem {
    id: string;
    name: string;
    grade: string;
}

interface Student {
    id: string;
    name: string;
}

export default function GamesPage() {
    const router = useRouter();
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [assignedCount, setAssignedCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('all');
    const [gradeFilter, setGradeFilter] = useState('all');

    // Modal states
    const [previewGame, setPreviewGame] = useState<Game | null>(null);
    const [assignGame, setAssignGame] = useState<Game | null>(null);
    const [assigning, setAssigning] = useState(false);
    const [assignSuccess, setAssignSuccess] = useState(false);

    // Assign form
    const [assignTarget, setAssignTarget] = useState<'grade' | 'class' | 'students'>('class');
    const [selectedGrade, setSelectedGrade] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [dueDate, setDueDate] = useState('');
    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [students, setStudents] = useState<Student[]>([]);

    // Fetch games
    const fetchGames = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (searchQuery) params.append('search', searchQuery);
            if (subjectFilter !== 'all') params.append('subject', subjectFilter);
            if (gradeFilter !== 'all') params.append('grade', gradeFilter);

            const data = await api.get(`/games?${params.toString()}`);
            setGames(data);
        } catch (err) {
            console.error('Failed to fetch games:', err);
        } finally {
            setLoading(false);
        }
    };

    // Seed games if none exist
    const seedGames = async () => {
        try {
            await api.post('/games/seed', {});
            fetchGames();
        } catch (err) {
            console.error('Failed to seed games:', err);
        }
    };

    // Fetch assigned count
    const fetchAssignedCount = async () => {
        try {
            const data = await api.get('/games/assigned-count');
            setAssignedCount(data.count);
        } catch (err) {
            console.error(err);
        }
    };

    // Fetch classes for assign modal
    const fetchClasses = async () => {
        try {
            const data = await api.get('/classes');
            setClasses(data);
        } catch (err) {
            console.error(err);
        }
    };

    // Fetch students for selected class
    const fetchStudents = async (classId: string) => {
        try {
            const data = await api.get(`/students?classId=${classId}`);
            setStudents(data.students || data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchGames();
        fetchAssignedCount();
        fetchClasses();
    }, []);

    useEffect(() => {
        fetchGames();
    }, [searchQuery, subjectFilter, gradeFilter]);

    useEffect(() => {
        if (selectedClass) {
            fetchStudents(selectedClass);
        }
    }, [selectedClass]);

    // Handle assign
    const handleAssign = async () => {
        if (!assignGame) return;

        setAssigning(true);
        try {
            await api.post('/games/assign', {
                gameId: assignGame.id,
                targetType: assignTarget,
                targetGrade: assignTarget === 'grade' ? selectedGrade : undefined,
                classId: assignTarget === 'class' ? selectedClass : undefined,
                studentIds: assignTarget === 'students' ? selectedStudents : undefined,
                dueDate: dueDate || undefined
            });

            setAssignSuccess(true);
            fetchAssignedCount();
            setTimeout(() => {
                setAssignGame(null);
                setAssignSuccess(false);
                resetAssignForm();
            }, 1500);
        } catch (err) {
            console.error('Failed to assign game:', err);
        } finally {
            setAssigning(false);
        }
    };

    const resetAssignForm = () => {
        setAssignTarget('class');
        setSelectedGrade('');
        setSelectedClass('');
        setSelectedStudents([]);
        setDueDate('');
    };

    const toggleStudent = (id: string) => {
        setSelectedStudents(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const grades = ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'];
    const subjects = ['Math', 'Phonics', 'English', 'Science'];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-display">Interactive Games Library</h1>
                    <p className="text-slate-500 text-base mt-2">Browse and assign learning activities to your students.</p>
                </div>
                <div className="hidden md:flex gap-4">
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
                        <span className="material-symbols-outlined text-primary">check_circle</span>
                        <span className="text-sm font-bold text-slate-600">{assignedCount} Assigned</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400">search</span>
                    </div>
                    <input
                        className="w-full h-12 pl-11 pr-4 bg-slate-50 border-none rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        placeholder="Search games by title, skill, or keyword..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide items-center">
                    <span className="text-sm font-bold text-slate-500 whitespace-nowrap mr-2">Subject:</span>
                    <button
                        onClick={() => setSubjectFilter('all')}
                        className={`flex h-9 shrink-0 items-center px-4 rounded-lg text-sm font-bold transition-colors ${subjectFilter === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                    >
                        All
                    </button>
                    {subjects.map(subject => (
                        <button
                            key={subject}
                            onClick={() => setSubjectFilter(subject)}
                            className={`flex h-9 shrink-0 items-center px-4 rounded-lg text-sm font-bold transition-colors ${subjectFilter === subject ? 'bg-slate-800 text-white' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                        >
                            {subject}
                        </button>
                    ))}
                    <div className="h-6 w-px bg-slate-300 mx-2"></div>
                    <span className="text-sm font-bold text-slate-500 whitespace-nowrap mr-2">Grade:</span>
                    <select
                        value={gradeFilter}
                        onChange={(e) => setGradeFilter(e.target.value)}
                        className="h-9 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm font-bold text-slate-600"
                    >
                        <option value="all">All Grades</option>
                        {grades.map(g => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            )}

            {/* Empty State / Seed Button */}
            {!loading && games.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
                    <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">sports_esports</span>
                    <h3 className="text-lg font-bold text-slate-700">No Games Found</h3>
                    <p className="text-slate-500 mt-1 mb-4">Seed the games library to get started!</p>
                    <button
                        onClick={seedGames}
                        className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
                    >
                        Seed 10 Games
                    </button>
                </div>
            )}

            {/* Games Grid */}
            {!loading && games.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {games.map((game) => (
                        <div key={game.id} className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                            <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                                    <img src={game.imageUrl} alt={game.title} className="h-full w-full object-cover" />
                                </div>
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                                    <div className="bg-white/90 rounded-full p-3 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg cursor-pointer" onClick={() => setPreviewGame(game)}>
                                        <span className="material-symbols-outlined text-primary text-3xl">play_arrow</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-1 flex-col p-5">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex gap-2">
                                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">{game.subject}</span>
                                        <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-bold text-slate-500">{game.grade}</span>
                                    </div>
                                    <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-bold text-primary capitalize">{game.gameType.replace('_', ' ')}</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1 leading-tight">{game.title}</h3>
                                <p className="text-slate-500 text-sm line-clamp-2 mb-4 font-medium">{game.description}</p>
                                <div className="mt-auto flex gap-2 pt-4 border-t border-slate-100">
                                    <button
                                        onClick={() => router.push(`/dashboard/games/play/${game.id}`)}
                                        className="flex-1 flex items-center justify-center gap-1 rounded-xl h-10 bg-green-500 hover:bg-green-600 text-white text-sm font-bold shadow-sm transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                                        Play
                                    </button>
                                    <button
                                        onClick={() => setPreviewGame(game)}
                                        className="flex items-center justify-center gap-1 rounded-xl h-10 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">info</span>
                                    </button>
                                    <button
                                        onClick={() => setAssignGame(game)}
                                        className="flex items-center justify-center gap-1 rounded-xl h-10 px-3 bg-primary hover:bg-primary/90 text-white text-sm font-bold shadow-sm transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">assignment_add</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Preview Modal */}
            {previewGame && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setPreviewGame(null)}>
                    <div className="bg-white rounded-2xl w-full max-w-lg p-0 shadow-xl animate-in fade-in zoom-in duration-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="relative h-56 bg-slate-100">
                            <img src={previewGame.imageUrl} alt={previewGame.title} className="h-full w-full object-cover" />
                            <button onClick={() => setPreviewGame(null)} className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg text-slate-600 hover:text-slate-900">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="flex gap-2 mb-3">
                                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">{previewGame.subject}</span>
                                <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-bold text-slate-500">{previewGame.grade}</span>
                                <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-bold text-primary capitalize">{previewGame.gameType.replace('_', ' ')}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">{previewGame.title}</h3>
                            <p className="text-slate-600 mb-6">{previewGame.description}</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setPreviewGame(null);
                                        router.push(`/dashboard/games/play/${previewGame.id}`);
                                    }}
                                    className="flex-1 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined">play_arrow</span>
                                    Play Now
                                </button>
                                <button
                                    onClick={() => {
                                        setPreviewGame(null);
                                        setAssignGame(previewGame);
                                    }}
                                    className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors"
                                >
                                    Assign
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Modal */}
            {assignGame && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => { setAssignGame(null); resetAssignForm(); }}>
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Assign Game</h3>
                            <button onClick={() => { setAssignGame(null); resetAssignForm(); }} className="text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {assignSuccess ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="material-symbols-outlined text-green-600 text-3xl">check</span>
                                </div>
                                <h4 className="text-lg font-bold text-slate-900">Game Assigned!</h4>
                                <p className="text-slate-500 mt-1">Students can now play {assignGame.title}</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-3">
                                    <img src={assignGame.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
                                    <div>
                                        <p className="font-bold text-slate-900">{assignGame.title}</p>
                                        <p className="text-xs text-slate-500">{assignGame.subject} • {assignGame.grade}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Assign To</label>
                                    <div className="flex gap-2">
                                        {(['grade', 'class', 'students'] as const).map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => setAssignTarget(type)}
                                                className={`flex-1 py-2 rounded-lg text-sm font-bold capitalize transition-colors ${assignTarget === type ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {assignTarget === 'grade' && (
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Select Grade</label>
                                        <select
                                            value={selectedGrade}
                                            onChange={(e) => setSelectedGrade(e.target.value)}
                                            className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl"
                                        >
                                            <option value="">Choose grade...</option>
                                            {grades.map(g => <option key={g} value={g}>{g}</option>)}
                                        </select>
                                    </div>
                                )}

                                {assignTarget === 'class' && (
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Select Class</label>
                                        <select
                                            value={selectedClass}
                                            onChange={(e) => setSelectedClass(e.target.value)}
                                            className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl"
                                        >
                                            <option value="">Choose class...</option>
                                            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                )}

                                {assignTarget === 'students' && (
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Select Class First</label>
                                        <select
                                            value={selectedClass}
                                            onChange={(e) => { setSelectedClass(e.target.value); setSelectedStudents([]); }}
                                            className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl mb-2"
                                        >
                                            <option value="">Choose class...</option>
                                            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                        {selectedClass && students.length > 0 && (
                                            <div className="max-h-40 overflow-y-auto bg-slate-50 rounded-xl p-2 space-y-1">
                                                {students.map(s => (
                                                    <label key={s.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-white cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedStudents.includes(s.id)}
                                                            onChange={() => toggleStudent(s.id)}
                                                            className="rounded border-slate-300 text-primary"
                                                        />
                                                        <span className="text-sm text-slate-700">{s.name}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Due Date (Optional)</label>
                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl"
                                    />
                                </div>

                                <button
                                    onClick={handleAssign}
                                    disabled={assigning || (assignTarget === 'grade' && !selectedGrade) || (assignTarget === 'class' && !selectedClass) || (assignTarget === 'students' && selectedStudents.length === 0)}
                                    className={`w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors ${assigning ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {assigning ? 'Assigning...' : 'Assign Game'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
