"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface StudentData {
    id: string;
    name: string;
    grade: string;
    className: string;
    teacherName: string;
    schoolName: string;
}

interface DashboardStats {
    pendingAssignments: number;
    totalAssignments: number;
    averageScore: number | null;
    gamesAvailable: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function StudentAccessPage({ params }: { params: Promise<{ token: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const token = resolvedParams.token;

    const [student, setStudent] = useState<StudentData | null>(null);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'home' | 'assignments' | 'games' | 'library' | 'grades'>('home');

    useEffect(() => {
        const validateToken = async () => {
            try {
                const res = await fetch(`${API_BASE}/student/access/${token}`);
                if (!res.ok) {
                    throw new Error('Invalid access link');
                }
                const data = await res.json();
                setStudent(data);

                // Fetch dashboard stats
                const dashRes = await fetch(`${API_BASE}/student/access/${token}/dashboard`);
                if (dashRes.ok) {
                    const dashData = await dashRes.json();
                    setStats(dashData.stats);
                }
            } catch (err: any) {
                setError(err.message || 'Failed to validate access');
            } finally {
                setLoading(false);
            }
        };

        validateToken();
    }, [token]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading your portal...</p>
                </div>
            </div>
        );
    }

    if (error || !student) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-red-500 text-4xl">error</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Invalid Link</h1>
                    <p className="text-slate-600 mb-6">
                        This access link is invalid or has expired. Please ask your teacher for a new link.
                    </p>
                    <Link href="/" className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors">
                        Go to Homepage
                    </Link>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'home', label: 'Home', icon: 'home' },
        { id: 'assignments', label: 'Homework', icon: 'assignment' },
        { id: 'games', label: 'Games', icon: 'sports_esports' },
        { id: 'library', label: 'Books', icon: 'menu_book' },
        { id: 'grades', label: 'Grades', icon: 'grade' },
    ] as const;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-primary text-white">
                <div className="max-w-5xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <span className="text-2xl font-bold">{student.name.charAt(0)}</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">Hi, {student.name}! 👋</h1>
                                <p className="text-white/80 text-sm">{student.className} • {student.grade}</p>
                            </div>
                        </div>
                        <div className="hidden sm:block text-right">
                            <p className="text-white/80 text-sm">{student.schoolName}</p>
                            <p className="text-white/60 text-xs">Teacher: {student.teacherName}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="max-w-5xl mx-auto px-4">
                    <div className="flex gap-2 overflow-x-auto pb-4">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${activeTab === tab.id
                                    ? 'bg-white text-primary shadow-lg'
                                    : 'bg-white/20 text-white hover:bg-white/30'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 py-8">
                {activeTab === 'home' && (
                    <HomeTab token={token} student={student} stats={stats} />
                )}
                {activeTab === 'assignments' && (
                    <AssignmentsTab token={token} />
                )}
                {activeTab === 'games' && (
                    <GamesTab token={token} />
                )}
                {activeTab === 'library' && (
                    <LibraryTab token={token} />
                )}
                {activeTab === 'grades' && (
                    <GradesTab token={token} />
                )}
            </div>
        </div>
    );
}

// ==================== TAB COMPONENTS ====================

function HomeTab({ token, student, stats }: { token: string; student: StudentData; stats: DashboardStats | null }) {
    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-orange-100">
                            <span className="material-symbols-outlined text-orange-500 text-sm">assignment</span>
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{stats?.pendingAssignments || 0}</p>
                    <p className="text-slate-500 text-xs">Pending Homework</p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-green-100">
                            <span className="material-symbols-outlined text-green-500 text-sm">grade</span>
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">
                        {stats?.averageScore !== null ? `${stats?.averageScore}%` : '--'}
                    </p>
                    <p className="text-slate-500 text-xs">Average Score</p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-purple-100">
                            <span className="material-symbols-outlined text-purple-500 text-sm">sports_esports</span>
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{stats?.gamesAvailable || 0}</p>
                    <p className="text-slate-500 text-xs">Games to Play</p>
                </div>
                <div className="bg-primary rounded-2xl p-5 shadow-lg text-white">
                    <p className="text-2xl font-bold">{stats?.totalAssignments || 0}</p>
                    <p className="text-white/80 text-xs">Total Work</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-orange-500">assignment</span>
                        Homework Status
                    </h3>
                    {(stats?.pendingAssignments || 0) > 0 ? (
                        <div className="text-center py-4">
                            <p className="text-4xl mb-2">📝</p>
                            <p className="font-bold text-slate-700 mb-2">
                                You have {stats?.pendingAssignments} homework to do!
                            </p>
                            <p className="text-slate-500 text-sm">Click the Homework tab to see them</p>
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-4xl mb-2">🎉</p>
                            <p className="font-bold text-slate-700">All done! Great job!</p>
                        </div>
                    )}
                </div>

                <div className="bg-secondary rounded-2xl p-6 shadow-lg text-white">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined">sports_esports</span>
                        Let's Play! 🎮
                    </h3>
                    <p className="text-white/80 mb-4">
                        Have fun learning with educational games!
                    </p>
                    <div className="flex gap-2 text-3xl">
                        <span>🧩</span>
                        <span>📚</span>
                        <span>🔢</span>
                        <span>✏️</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AssignmentsTab({ token }: { token: string }) {
    const [assignments, setAssignments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const res = await fetch(`${API_BASE}/student/access/${token}/assignments`);
                const data = await res.json();
                setAssignments(data);
            } catch (err) {
                console.error('Failed to fetch assignments:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAssignments();
    }, [token]);

    if (loading) {
        return <div className="text-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div></div>;
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">My Homework 📝</h2>
            {assignments.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                    <span className="text-5xl">🎉</span>
                    <p className="text-slate-500 mt-4">No homework right now!</p>
                </div>
            ) : (
                assignments.map((a: any) => (
                    <div key={a.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="font-bold text-slate-900">{a.title}</h3>
                                {a.description && <p className="text-slate-600 text-sm mt-1">{a.description}</p>}
                                <p className="text-slate-500 text-xs mt-2">Due: {new Date(a.dueDate).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${a.mySubmission?.status === 'GRADED' ? 'bg-green-100 text-green-600' :
                                a.mySubmission?.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-600' :
                                    'bg-orange-100 text-orange-600'
                                }`}>
                                {a.mySubmission?.status || 'PENDING'}
                            </span>
                        </div>
                        {a.mySubmission?.score !== null && (
                            <div className="mt-3 pt-3 border-t border-slate-100">
                                <span className="font-bold text-green-600">Score: {a.mySubmission.score}%</span>
                                {a.mySubmission.feedback && (
                                    <p className="text-slate-600 text-sm mt-1">{a.mySubmission.feedback}</p>
                                )}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

function GamesTab({ token }: { token: string }) {
    const router = useRouter();
    const [games, setGames] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const res = await fetch(`${API_BASE}/student/access/${token}/games`);
                const data = await res.json();
                setGames(data);
            } catch (err) {
                console.error('Failed to fetch games:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchGames();
    }, [token]);

    if (loading) {
        return <div className="text-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div></div>;
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Learning Games 🎮</h2>
            {games.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                    <span className="text-5xl">🎮</span>
                    <p className="text-slate-500 mt-4">No games available yet!</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {games.map((g: any) => (
                        <div key={g.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-all">
                            <div className="h-28 bg-slate-100 overflow-hidden">
                                <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-slate-900 text-sm">{g.title}</h3>
                                <p className="text-slate-500 text-xs mt-1">{g.subject}</p>
                                <button
                                    onClick={() => router.push(`/games/play/${g.id}`)}
                                    className="mt-3 w-full py-2 bg-green-500 text-white rounded-xl font-bold text-sm hover:bg-green-600 transition-colors flex items-center justify-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-sm">play_arrow</span>
                                    Play
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function LibraryTab({ token }: { token: string }) {
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await fetch(`${API_BASE}/student/access/${token}/library`);
                const data = await res.json();
                setBooks(data);
            } catch (err) {
                console.error('Failed to fetch books:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, [token]);

    if (loading) {
        return <div className="text-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div></div>;
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Reading Books 📚</h2>
            {books.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                    <span className="text-5xl">📖</span>
                    <p className="text-slate-500 mt-4">No books available yet!</p>
                </div>
            ) : (
                <div className="grid grid-cols-3 lg:grid-cols-5 gap-4">
                    {books.map((b: any) => (
                        <div key={b.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100">
                            <div className="aspect-[3/4] bg-slate-100">
                                {b.coverUrl ? (
                                    <img src={b.coverUrl} alt={b.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-3xl text-slate-300">menu_book</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-2">
                                <h3 className="font-bold text-slate-900 text-xs line-clamp-2">{b.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function GradesTab({ token }: { token: string }) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const res = await fetch(`${API_BASE}/student/access/${token}/grades`);
                const result = await res.json();
                setData(result);
            } catch (err) {
                console.error('Failed to fetch grades:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchGrades();
    }, [token]);

    if (loading) {
        return <div className="text-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div></div>;
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">My Grades 📊</h2>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-center">
                    <p className="text-2xl font-bold text-slate-900">{data?.stats?.total || 0}</p>
                    <p className="text-slate-500 text-xs">Total</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-center">
                    <p className="text-2xl font-bold text-green-600">{data?.stats?.graded || 0}</p>
                    <p className="text-slate-500 text-xs">Graded</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-center">
                    <p className="text-2xl font-bold text-blue-600">{data?.stats?.submitted || 0}</p>
                    <p className="text-slate-500 text-xs">Submitted</p>
                </div>
                <div className="bg-primary rounded-xl p-4 shadow-lg text-white text-center">
                    <p className="text-2xl font-bold">{data?.stats?.averageScore !== null ? `${data?.stats?.averageScore}%` : '--'}</p>
                    <p className="text-white/80 text-xs">Average</p>
                </div>
            </div>

            {/* Submissions List */}
            {data?.submissions?.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                    <span className="text-5xl">📝</span>
                    <p className="text-slate-500 mt-4">No grades yet!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {data?.submissions?.map((s: any) => (
                        <div key={s.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-slate-900">{s.assignment.title}</h3>
                                <p className="text-slate-500 text-xs">{s.assignment.class.name}</p>
                            </div>
                            {s.status === 'GRADED' && s.score !== null ? (
                                <div className={`px-4 py-2 rounded-xl font-bold ${s.score >= 70 ? 'bg-green-100 text-green-600' :
                                    s.score >= 50 ? 'bg-yellow-100 text-yellow-600' :
                                        'bg-red-100 text-red-600'
                                    }`}>
                                    {s.score}%
                                </div>
                            ) : (
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                                    {s.status}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
