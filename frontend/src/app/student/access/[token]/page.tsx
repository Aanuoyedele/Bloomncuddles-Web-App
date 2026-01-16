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
                if (!res.ok) throw new Error('Invalid access link');
                const data = await res.json();
                setStudent(data);

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
            <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading your portal...</p>
                </div>
            </div>
        );
    }

    if (error || !student) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
                <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-5xl">😢</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Oops! Link Not Working</h1>
                    <p className="text-slate-600 mb-6">
                        This link is invalid or has expired. Please ask your teacher or parents for a new link.
                    </p>
                    <Link href="/" className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors">
                        Go to Homepage
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans relative overflow-hidden">
            {/* Floating Decorative Icons - Left Side */}
            <div className="hidden xl:block fixed left-8 top-1/4 space-y-8 opacity-40 pointer-events-none z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-200 to-blue-300 rounded-2xl rotate-12 flex items-center justify-center text-3xl shadow-lg animate-float">
                    📚
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-200 to-amber-300 rounded-full -rotate-6 flex items-center justify-center text-2xl shadow-md ml-4 animate-float-delayed">
                    ⭐
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-green-200 to-teal-300 rounded-xl rotate-6 flex items-center justify-center text-2xl shadow-md animate-float-slow">
                    🎨
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-pink-200 to-rose-300 rounded-full rotate-12 flex items-center justify-center text-xl shadow-sm ml-6 animate-float">
                    ✏️
                </div>
            </div>

            {/* Floating Decorative Icons - Right Side */}
            <div className="hidden xl:block fixed right-8 top-1/3 space-y-8 opacity-40 pointer-events-none z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-200 to-violet-300 rounded-2xl -rotate-12 flex items-center justify-center text-2xl shadow-lg animate-float-delayed">
                    🚀
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-200 to-amber-300 rounded-full rotate-6 flex items-center justify-center text-xl shadow-md ml-4 animate-float">
                    🎯
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-200 to-blue-300 rounded-xl -rotate-6 flex items-center justify-center text-3xl shadow-md animate-float-slow">
                    🎮
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-red-200 to-pink-300 rounded-full rotate-12 flex items-center justify-center text-xl shadow-sm ml-2" style={{ animationDuration: '3s' }}>
                    💡
                </div>
            </div>

            {/* Animated Floating Bubbles */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute w-64 h-64 bg-gradient-to-br from-primary/10 to-blue-200/20 rounded-full blur-3xl -top-20 -left-20 animate-float" />
                <div className="absolute w-96 h-96 bg-gradient-to-br from-pink-200/20 to-purple-200/20 rounded-full blur-3xl top-1/4 -right-32 animate-float-delayed" />
                <div className="absolute w-72 h-72 bg-gradient-to-br from-green-200/15 to-teal-200/20 rounded-full blur-3xl bottom-1/4 left-1/4 animate-float-slow" />
                <div className="absolute w-48 h-48 bg-gradient-to-br from-orange-200/20 to-yellow-200/20 rounded-full blur-2xl bottom-20 right-1/3 animate-float" />
            </div>

            {/* SVG Wave Pattern - Top */}
            <div className="absolute top-16 left-0 right-0 pointer-events-none overflow-hidden z-0">
                <svg className="w-full h-24 opacity-30" viewBox="0 0 1440 100" preserveAspectRatio="none">
                    <path
                        fill="url(#wave-gradient-top-student)"
                        d="M0,50 C360,100 720,0 1080,50 C1260,75 1380,25 1440,50 L1440,0 L0,0 Z"
                    />
                    <defs>
                        <linearGradient id="wave-gradient-top-student" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b6cb5" />
                            <stop offset="50%" stopColor="#5b8bd5" />
                            <stop offset="100%" stopColor="#3b6cb5" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* SVG Wave Pattern - Bottom */}
            <div className="fixed bottom-12 left-0 right-0 pointer-events-none overflow-hidden z-0">
                <svg className="w-full h-32 opacity-20" viewBox="0 0 1440 150" preserveAspectRatio="none">
                    <path
                        fill="url(#wave-gradient-bottom-student)"
                        d="M0,80 C240,120 480,40 720,80 C960,120 1200,40 1440,80 L1440,150 L0,150 Z"
                    />
                    <path
                        fill="url(#wave-gradient-bottom-student-2)"
                        fillOpacity="0.5"
                        d="M0,100 C360,60 720,140 1080,100 C1260,80 1380,120 1440,100 L1440,150 L0,150 Z"
                    />
                    <defs>
                        <linearGradient id="wave-gradient-bottom-student" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#22c55e" />
                            <stop offset="50%" stopColor="#14b8a6" />
                            <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                        <linearGradient id="wave-gradient-bottom-student-2" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ec4899" />
                            <stop offset="100%" stopColor="#f97316" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Header - Explorer Portal */}
            <header className="bg-white/95 backdrop-blur-md border-b border-slate-100 fixed top-0 left-0 right-0 z-50">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm">🌸</span>
                        </div>
                        <span className="font-bold text-slate-800">Explorer Portal</span>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <button
                            onClick={() => setActiveTab('home')}
                            className={`flex items-center gap-1.5 text-sm font-medium ${activeTab === 'home' ? 'text-primary' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                            <span className="material-symbols-outlined text-[18px]">home</span>
                            Home
                        </button>
                        <button className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900">
                            <span className="material-symbols-outlined text-[18px]">stars</span>
                            My Rewards
                        </button>
                        <button className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900">
                            <span className="material-symbols-outlined text-[18px]">help</span>
                            Get Help
                        </button>
                    </nav>

                    {/* Profile */}
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        {student.name.charAt(0)}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 py-6 pt-24 pb-20 relative z-10">
                {activeTab === 'home' && <HomeTab token={token} student={student} stats={stats} setActiveTab={setActiveTab} />}
                {activeTab === 'assignments' && <AssignmentsTab token={token} setActiveTab={setActiveTab} />}
                {activeTab === 'games' && <GamesTab token={token} setActiveTab={setActiveTab} />}
                {activeTab === 'library' && <LibraryTab token={token} setActiveTab={setActiveTab} />}
                {activeTab === 'grades' && <GradesTab token={token} setActiveTab={setActiveTab} />}
            </main>

            {/* Footer */}
            <footer className="bg-white/95 backdrop-blur-md border-t border-slate-100 py-4 fixed bottom-0 left-0 right-0 z-40">
                <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <span className="text-lg">✨</span>
                        <span>Made for future leaders.</span>
                    </div>
                    <nav className="flex items-center gap-6 text-sm">
                        <Link href="/parent/login" className="text-slate-500 hover:text-primary font-medium">Parent Portal</Link>
                        <Link href="/privacy" className="text-slate-500 hover:text-primary font-medium">Privacy Policy</Link>
                        <Link href="/login" className="text-slate-500 hover:text-primary font-medium">Teachers Site</Link>
                    </nav>
                </div>
            </footer>
        </div>
    );
}

// ==================== HOME TAB ====================
function HomeTab({ token, student, stats, setActiveTab }: {
    token: string;
    student: StudentData;
    stats: DashboardStats | null;
    setActiveTab: (tab: 'home' | 'assignments' | 'games' | 'library' | 'grades') => void;
}) {
    const firstName = student.name.split(' ')[0];
    const funThings = (stats?.pendingAssignments || 0) + (stats?.gamesAvailable || 0);
    const router = useRouter();

    // Fetch real data for Picked for You
    const [pickedForYou, setPickedForYou] = useState<any[]>([]);
    const [loadingPicked, setLoadingPicked] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const recommendations: any[] = [];

                // Fetch games
                const gamesRes = await fetch(`${API_BASE}/student/access/${token}/games`);
                if (gamesRes.ok) {
                    const games = await gamesRes.json();
                    games.slice(0, 2).forEach((g: any) => {
                        recommendations.push({
                            id: `game-${g.id}`,
                            realId: g.id,
                            title: g.title,
                            type: 'game',
                            duration: 'Play Now',
                            image: '🎮',
                            action: 'Start Game'
                        });
                    });
                }



                // Fetch books (logic remains same)
                const booksRes = await fetch(`${API_BASE}/student/access/${token}/library`);
                if (booksRes.ok) {
                    const books = await booksRes.json();
                    books.slice(0, 2).forEach((b: any) => {
                        recommendations.push({
                            id: `book-${b.id}`,
                            title: b.title,
                            type: 'book',
                            duration: '5 min read',
                            image: '📚',
                            action: 'Open Book'
                        });
                    });
                }

                // If no real data, show defaults
                if (recommendations.length === 0) {
                    recommendations.push(
                        { id: 1, title: "Solar System Safari", type: "game", duration: "12 mins", image: "🚀", action: "Launch Mission" },
                        { id: 2, title: "The Brave Little Lion", type: "book", duration: "5 min read", image: "🦁", action: "Open Book" },
                        { id: 3, title: "Number Ninja Challenge", type: "game", duration: "Level 1", image: "🔢", action: "Start Game" },
                        { id: 4, title: "Prehistoric Pals", type: "video", duration: "10 min video", image: "🦖", action: "Watch Video" }
                    );
                }

                setPickedForYou(recommendations);
            } catch (err) {
                console.error('Failed to fetch recommendations:', err);
            } finally {
                setLoadingPicked(false);
            }
        };
        fetchRecommendations();
    }, [token]);

    return (
        <div className="space-y-8">
            {/* Hero Section - Blue Gradient */}
            <div className="bg-gradient-to-br from-[#3b6cb5] to-[#5b8bd5] rounded-3xl p-8 text-white relative overflow-hidden">
                {/* Decorative Rocket */}
                <div className="absolute left-6 bottom-6 text-4xl opacity-80">🚀</div>

                {/* Decorative Elements */}
                <div className="absolute top-4 right-20 w-3 h-3 bg-white/30 rounded-full"></div>
                <div className="absolute top-12 right-12 w-2 h-2 bg-white/20 rounded-full"></div>
                <div className="absolute bottom-8 right-32 w-4 h-4 bg-white/20 rounded-full"></div>

                <div className="relative z-10 text-center py-4">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Hi there, {student.name}!</h1>
                    <p className="text-white/80 mb-6">
                        You have {funThings} fun things waiting for you today.
                    </p>
                    <button
                        onClick={() => setActiveTab('assignments')}
                        className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
                    >
                        Continue Learning
                        <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-[16px]">play_arrow</span>
                        </span>
                    </button>
                </div>
            </div>

            {/* Where to next? */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Where to next?</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* My Classes */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all">
                        <div className="w-12 h-12 bg-[#e8f4fd] rounded-xl flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-[#3b6cb5] text-2xl">school</span>
                        </div>
                        <h3 className="font-bold text-slate-900 mb-1">My Classes</h3>
                        <p className="text-slate-500 text-sm mb-4">Join your teachers and friends!</p>
                        <button
                            onClick={() => setActiveTab('assignments')}
                            className="w-full py-2.5 bg-primary text-white font-bold rounded-xl text-sm hover:bg-primary-dark transition-colors"
                        >
                            Go to Class
                        </button>
                    </div>

                    {/* Assignments */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all">
                        <div className="w-12 h-12 bg-[#e6f7ed] rounded-xl flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-[#22c55e] text-2xl">task_alt</span>
                        </div>
                        <h3 className="font-bold text-slate-900 mb-1">Assignments</h3>
                        <p className="text-slate-500 text-sm mb-4">Check your daily to-do list.</p>
                        <button
                            onClick={() => setActiveTab('assignments')}
                            className="w-full py-2.5 bg-[#22c55e] text-white font-bold rounded-xl text-sm hover:bg-green-600 transition-colors"
                        >
                            View All
                        </button>
                    </div>

                    {/* Fun Games */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all relative">
                        <span className="absolute top-3 right-3 px-2 py-0.5 bg-secondary text-white text-xs font-bold rounded-full">NEW</span>
                        <div className="w-12 h-12 bg-[#fce8eb] rounded-xl flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-[#ed5667] text-2xl">sports_esports</span>
                        </div>
                        <h3 className="font-bold text-slate-900 mb-1">Fun Games</h3>
                        <p className="text-slate-500 text-sm mb-4">Learn while having a blast!</p>
                        <button
                            onClick={() => setActiveTab('games')}
                            className="w-full py-2.5 bg-[#ed5667] text-white font-bold rounded-xl text-sm hover:bg-red-500 transition-colors"
                        >
                            Play Now
                        </button>
                    </div>

                    {/* Reading Room */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all">
                        <div className="w-12 h-12 bg-[#e6f7ed] rounded-xl flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-[#14b8a6] text-2xl">menu_book</span>
                        </div>
                        <h3 className="font-bold text-slate-900 mb-1">Reading Room</h3>
                        <p className="text-slate-500 text-sm mb-4">Discover amazing stories.</p>
                        <button
                            onClick={() => setActiveTab('library')}
                            className="w-full py-2.5 bg-[#14b8a6] text-white font-bold rounded-xl text-sm hover:bg-teal-600 transition-colors"
                        >
                            Start Reading
                        </button>
                    </div>
                </div>
            </div>

            {/* Picked for You */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900">Picked for You</h2>
                    <button
                        onClick={() => setActiveTab('games')}
                        className="text-primary font-medium text-sm hover:underline"
                    >
                        See all recommendations
                    </button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
                    {pickedForYou.map((item) => (
                        <div key={item.id} className="flex-shrink-0 w-40 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
                            <div className="h-28 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center text-5xl">
                                {item.image}
                            </div>
                            <div className="p-3">
                                <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{item.title}</h3>
                                <p className="text-slate-400 text-xs mb-3 flex items-center gap-1">
                                    {item.type === 'game' && <span className="material-symbols-outlined text-[12px]">sports_esports</span>}
                                    {item.type === 'book' && <span className="material-symbols-outlined text-[12px]">menu_book</span>}
                                    {item.type === 'video' && <span className="material-symbols-outlined text-[12px]">play_circle</span>}
                                    {item.duration}
                                </p>
                                <button
                                    onClick={() => {
                                        if (item.type === 'game' && item.realId) {
                                            router.push(`/student/access/${token}/game/${item.realId}`);
                                        } else {
                                            setActiveTab(item.type === 'book' ? 'library' : 'games');
                                        }
                                    }}
                                    className="w-full py-2 bg-slate-100 text-slate-700 font-bold rounded-lg text-xs hover:bg-slate-200 transition-colors"
                                >
                                    {item.action}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Your Progress */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 mb-1">Your Progress</h2>
                        <p className="text-slate-500 text-sm">You've collected 12 stars this week! Keep going!</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Star Badge */}
                        <div className="text-center">
                            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-1">
                                <span className="text-2xl">⭐</span>
                            </div>
                            <span className="text-xs text-amber-600 font-medium">STAR GAZER</span>
                        </div>
                        {/* Fast Learner Badge */}
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                                <span className="text-2xl">🚀</span>
                            </div>
                            <span className="text-xs text-blue-600 font-medium">FAST LEARNER</span>
                        </div>
                        {/* Locked Badge */}
                        <div className="text-center opacity-50">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-1">
                                <span className="material-symbols-outlined text-slate-400">lock</span>
                            </div>
                            <span className="text-xs text-slate-400 font-medium">LOCKED</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ==================== ASSIGNMENTS TAB ====================
function AssignmentsTab({ token, setActiveTab }: { token: string; setActiveTab: (tab: 'home' | 'assignments' | 'games' | 'library' | 'grades') => void }) {
    const router = useRouter();
    const [assignments, setAssignments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'ready' | 'finished'>('ready');

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
        return <div className="text-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-4 border-primary/30 border-t-primary mx-auto"></div></div>;
    }

    const readyAssignments = assignments.filter(a => !a.mySubmission || a.mySubmission.status === 'PENDING');
    const finishedAssignments = assignments.filter(a => a.mySubmission && a.mySubmission.status !== 'PENDING');
    const displayAssignments = filter === 'ready' ? readyAssignments : finishedAssignments;

    // Subject colors
    const getSubjectStyle = (title: string) => {
        const lower = title.toLowerCase();
        if (lower.includes('math') || lower.includes('number') || lower.includes('addition'))
            return { bg: 'bg-blue-50', text: 'text-blue-600', label: 'MATHS' };
        if (lower.includes('english') || lower.includes('spelling') || lower.includes('reading'))
            return { bg: 'bg-red-50', text: 'text-red-600', label: 'ENGLISH' };
        if (lower.includes('science') || lower.includes('plant') || lower.includes('animal'))
            return { bg: 'bg-green-50', text: 'text-green-600', label: 'SCIENCE' };
        if (lower.includes('phonics') || lower.includes('sound'))
            return { bg: 'bg-purple-50', text: 'text-purple-600', label: 'PHONICS' };
        return { bg: 'bg-slate-50', text: 'text-slate-600', label: 'HOMEWORK' };
    };

    return (
        <div className="space-y-6">
            {/* Back Button + Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setActiveTab('home')}
                    className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-colors shadow-sm"
                >
                    <span className="material-symbols-outlined text-slate-600">arrow_back</span>
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Assignments</h1>
                    <p className="text-slate-500 text-sm">You have {readyAssignments.length} fun tasks waiting for you.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-slate-200">
                <button
                    onClick={() => setFilter('ready')}
                    className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-all ${filter === 'ready'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <span className="material-symbols-outlined text-[18px]">play_circle</span>
                    Ready to Start
                </button>
                <button
                    onClick={() => setFilter('finished')}
                    className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-all ${filter === 'finished'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    Finished
                </button>
            </div>

            {/* Assignment Cards */}
            {displayAssignments.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
                    <span className="text-6xl mb-4 block">🎉</span>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                        {filter === 'ready' ? 'All done!' : 'No finished assignments yet'}
                    </h3>
                    <p className="text-slate-500">
                        {filter === 'ready' ? "You've completed all your tasks!" : 'Complete some tasks to see them here!'}
                    </p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {displayAssignments.map((a: any) => {
                        const subject = getSubjectStyle(a.title);
                        const isNew = new Date(a.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000);
                        const isInProgress = a.mySubmission?.status === 'SUBMITTED';

                        return (
                            <div key={a.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-all">
                                {/* Image Header */}
                                <div className="h-32 bg-gradient-to-br from-amber-100 to-orange-100 relative p-4 flex items-end">
                                    {isNew && (
                                        <span className="absolute top-3 left-3 px-2 py-0.5 bg-secondary text-white text-xs font-bold rounded-full">NEW</span>
                                    )}
                                    {isInProgress && (
                                        <span className="absolute top-3 right-3 px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded-full">In Progress</span>
                                    )}
                                    <span className="text-5xl absolute right-4 bottom-4">📝</span>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`px-2 py-0.5 ${subject.bg} ${subject.text} text-xs font-bold rounded`}>
                                            ● {subject.label}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-lg mb-1">{a.title}</h3>
                                    <p className="text-slate-500 text-sm mb-4">
                                        Due {new Date(a.dueDate).toLocaleDateString()} • {a.description || 'Complete this assignment'}
                                    </p>
                                    <button
                                        onClick={() => router.push(`/student/access/${token}/assignment/${a.id}`)}
                                        className={`w-full py-3 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors ${isInProgress
                                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                                            : 'bg-primary text-white hover:bg-primary-dark'
                                            }`}>
                                        {isInProgress ? 'RESUME' : 'GO!'}
                                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Help Text */}
            <div className="text-center text-slate-500 text-sm flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[16px]">help</span>
                Need help with an assignment? Ask your teacher!
            </div>
        </div>
    );
}

// ==================== GAMES TAB ====================
function GamesTab({ token, setActiveTab }: { token: string; setActiveTab: (tab: 'home' | 'assignments' | 'games' | 'library' | 'grades') => void }) {
    const [games, setGames] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

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
        return <div className="text-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-4 border-primary/30 border-t-primary mx-auto"></div></div>;
    }

    return (
        <div className="space-y-6">
            {/* Back Button + Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setActiveTab('home')}
                    className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-colors shadow-sm"
                >
                    <span className="material-symbols-outlined text-slate-600">arrow_back</span>
                </button>
                <h2 className="text-2xl font-bold text-slate-900">Fun Games 🎮</h2>
            </div>

            {games.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
                    <span className="text-6xl mb-4 block">🎮</span>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No games yet!</h3>
                    <p className="text-slate-500">Your teacher will assign games soon!</p>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {games.map((game: any) => (
                        <div key={game.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-slate-100">
                            <div className="h-40 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                                <span className="text-6xl">🎮</span>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-slate-900 text-lg mb-2">{game.title}</h3>
                                <p className="text-slate-500 text-sm mb-4">{game.description}</p>
                                <button
                                    onClick={() => router.push(`/student/access/${token}/game/${game.id}`)}
                                    className="w-full py-3 bg-[#ed5667] text-white font-bold rounded-xl hover:bg-red-500 transition-colors"
                                >
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

// ==================== LIBRARY TAB ====================
function LibraryTab({ token, setActiveTab }: { token: string; setActiveTab: (tab: 'home' | 'assignments' | 'games' | 'library' | 'grades') => void }) {
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
        return <div className="text-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-4 border-primary/30 border-t-primary mx-auto"></div></div>;
    }

    return (
        <div className="space-y-6">
            {/* Back Button + Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setActiveTab('home')}
                    className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-colors shadow-sm"
                >
                    <span className="material-symbols-outlined text-slate-600">arrow_back</span>
                </button>
                <h2 className="text-2xl font-bold text-slate-900">Reading Room 📚</h2>
            </div>

            {books.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
                    <span className="text-6xl mb-4 block">📖</span>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No books yet!</h3>
                    <p className="text-slate-500">Your teacher will add books soon!</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {books.map((book: any) => (
                        <div key={book.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-slate-100 cursor-pointer">
                            <div className="aspect-[3/4] bg-gradient-to-br from-teal-100 to-green-100 flex items-center justify-center">
                                <span className="text-5xl">📕</span>
                            </div>
                            <div className="p-3">
                                <h3 className="font-bold text-slate-900 text-sm line-clamp-2">{book.title}</h3>
                                {book.author && <p className="text-slate-500 text-xs mt-1">{book.author}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ==================== GRADES TAB ====================
function GradesTab({ token, setActiveTab }: { token: string; setActiveTab: (tab: 'home' | 'assignments' | 'games' | 'library' | 'grades') => void }) {
    const [grades, setGrades] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const res = await fetch(`${API_BASE}/student/access/${token}/grades`);
                const data = await res.json();
                setGrades(data);
            } catch (err) {
                console.error('Failed to fetch grades:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchGrades();
    }, [token]);

    if (loading) {
        return <div className="text-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-4 border-primary/30 border-t-primary mx-auto"></div></div>;
    }

    return (
        <div className="space-y-6">
            {/* Back Button + Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setActiveTab('home')}
                    className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-colors shadow-sm"
                >
                    <span className="material-symbols-outlined text-slate-600">arrow_back</span>
                </button>
                <h2 className="text-2xl font-bold text-slate-900">My Grades ⭐</h2>
            </div>

            {grades.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
                    <span className="text-6xl mb-4 block">📊</span>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No grades yet!</h3>
                    <p className="text-slate-500">Complete some homework to see your grades!</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                    {grades.map((grade: any, index: number) => (
                        <div key={grade.id} className={`p-5 flex items-center justify-between ${index !== grades.length - 1 ? 'border-b border-slate-100' : ''}`}>
                            <div>
                                <h3 className="font-bold text-slate-900">{grade.assignment?.title || 'Assignment'}</h3>
                                <p className="text-slate-500 text-sm">{new Date(grade.gradedAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <span className={`text-2xl font-bold ${grade.score >= 80 ? 'text-green-600' : grade.score >= 60 ? 'text-orange-500' : 'text-red-500'}`}>
                                    {grade.score}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
