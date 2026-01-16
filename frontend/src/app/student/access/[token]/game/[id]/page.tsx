"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

const API_BASE = 'http://localhost:4000/api';

// Game interfaces
interface Game {
    id: string;
    title: string;
    description: string;
    subject: string;
    grade: string;
    imageUrl: string;
    gameType: string;
}

// Game question types
interface MatchQuestion {
    left: string[];
    right: string[];
    correctPairs: [number, number][];
}

interface QuizQuestion {
    question: string;
    options: string[];
    correctIndex: number;
    image?: string;
}

interface SpellingQuestion {
    word: string;
    hint: string;
    image?: string;
}

interface CountingQuestion {
    count: number;
    emoji: string;
    options: number[];
}

// Game content for each game type - Shared with dashboard
const GAME_CONTENT: Record<string, any> = {
    // Phonics Match - Match letters to sounds
    'match': {
        'Phonics Match': [
            { left: ['A', 'B', 'C', 'D'], right: ['Apple', 'Ball', 'Cat', 'Dog'], correctPairs: [[0, 0], [1, 1], [2, 2], [3, 3]] },
            { left: ['E', 'F', 'G', 'H'], right: ['Hat', 'Egg', 'Fish', 'Goat'], correctPairs: [[0, 1], [1, 2], [2, 3], [3, 0]] },
            { left: ['I', 'J', 'K', 'L'], right: ['Lion', 'Ice', 'Jam', 'Kite'], correctPairs: [[0, 1], [1, 2], [2, 3], [3, 0]] },
            { left: ['M', 'N', 'O', 'P'], right: ['Pig', 'Moon', 'Nest', 'Orange'], correctPairs: [[0, 1], [1, 2], [2, 3], [3, 0]] },
            { left: ['Q', 'R', 'S', 'T'], right: ['Tiger', 'Queen', 'Rain', 'Sun'], correctPairs: [[0, 1], [1, 2], [2, 3], [3, 0]] },
        ],
        'Number Bonds': [
            { left: ['3 + 7', '5 + 5', '2 + 8', '4 + 6'], right: ['10', '10', '10', '10'], correctPairs: [[0, 0], [1, 1], [2, 2], [3, 3]] },
            { left: ['1 + 9', '6 + 4', '8 + 2', '0 + 10'], right: ['10', '10', '10', '10'], correctPairs: [[0, 0], [1, 1], [2, 2], [3, 3]] },
            { left: ['1 + 4', '2 + 3', '0 + 5', '5 + 0'], right: ['5', '5', '5', '5'], correctPairs: [[0, 0], [1, 1], [2, 2], [3, 3]] },
            { left: ['10 + 10', '15 + 5', '12 + 8', '11 + 9'], right: ['20', '20', '20', '20'], correctPairs: [[0, 0], [1, 1], [2, 2], [3, 3]] },
            { left: ['7 + 8', '6 + 9', '10 + 5', '11 + 4'], right: ['15', '15', '15', '15'], correctPairs: [[0, 0], [1, 1], [2, 2], [3, 3]] },
        ],
        'Rhyme Time': [
            { left: ['Cat', 'Dog', 'Sun', 'Tree'], right: ['Bee', 'Hat', 'Fog', 'Run'], correctPairs: [[0, 1], [1, 2], [2, 3], [3, 0]] },
            { left: ['Moon', 'Star', 'Light', 'Day'], right: ['Car', 'Night', 'Spoon', 'Play'], correctPairs: [[0, 2], [1, 0], [2, 1], [3, 3]] },
            { left: ['Cake', 'Bowl', 'King', 'Bear'], right: ['Ring', 'Lake', 'Hair', 'Roll'], correctPairs: [[0, 1], [1, 3], [2, 0], [3, 2]] },
            { left: ['Fish', 'Book', 'Bell', 'Frog'], right: ['Log', 'Dish', 'Look', 'Shell'], correctPairs: [[0, 1], [1, 2], [2, 3], [3, 0]] },
        ],
    },
    // Quiz games
    'quiz': {
        'Sight Words Race': [
            { question: 'Which word says "THE"?', options: ['THE', 'HET', 'TEH', 'ETH'], correctIndex: 0 },
            { question: 'Which word says "AND"?', options: ['DNA', 'NAD', 'AND', 'DAN'], correctIndex: 2 },
            { question: 'Which word says "IS"?', options: ['SI', 'IS', 'II', 'SS'], correctIndex: 1 },
            { question: 'Which word says "YOU"?', options: ['OYU', 'UOY', 'YUO', 'YOU'], correctIndex: 3 },
            { question: 'Which word says "CAN"?', options: ['CAN', 'NAC', 'ANC', 'NCA'], correctIndex: 0 },
        ],
        'Simple Subtraction': [
            { question: '5 - 2 = ?', options: ['2', '3', '4', '5'], correctIndex: 1 },
            { question: '10 - 4 = ?', options: ['4', '5', '6', '7'], correctIndex: 2 },
            { question: '8 - 3 = ?', options: ['3', '4', '5', '6'], correctIndex: 2 },
            { question: '7 - 7 = ?', options: ['0', '1', '7', '14'], correctIndex: 0 },
            { question: '9 - 5 = ?', options: ['3', '4', '5', '14'], correctIndex: 1 },
        ],
    },
    // Spelling games
    'spelling': {
        'Word Builder': [
            { word: 'CAT', hint: 'A furry pet that says meow', letters: ['C', 'A', 'T'] },
            { word: 'DOG', hint: 'A pet that barks', letters: ['D', 'O', 'G'] },
            { word: 'SUN', hint: 'It shines in the sky', letters: ['S', 'U', 'N'] },
            { word: 'BED', hint: 'Where you sleep', letters: ['B', 'E', 'D'] },
            { word: 'HAT', hint: 'You wear it on your head', letters: ['H', 'A', 'T'] },
        ],
    },
    // Counting games
    'counting': {
        'Counting Fun 1-20': [
            { count: 3, emoji: '🍎', options: [2, 3, 4, 5] },
            { count: 5, emoji: '⭐', options: [4, 5, 6, 7] },
            { count: 7, emoji: '🎈', options: [5, 6, 7, 8] },
            { count: 4, emoji: '🐶', options: [3, 4, 5, 6] },
            { count: 6, emoji: '🌸', options: [4, 5, 6, 7] },
        ],
    },
    // Drag and drop / shape games
    'drag_drop': {
        'Shape Sorter': [
            { question: 'Which shape has 4 equal sides?', options: ['Circle', 'Square', 'Triangle', 'Oval'], correctIndex: 1 },
            { question: 'Which shape is round?', options: ['Square', 'Rectangle', 'Circle', 'Triangle'], correctIndex: 2 },
            { question: 'Which shape has 3 sides?', options: ['Triangle', 'Square', 'Circle', 'Hexagon'], correctIndex: 0 },
            { question: 'Which shape has 6 sides?', options: ['Pentagon', 'Hexagon', 'Octagon', 'Square'], correctIndex: 1 },
            { question: 'Which shape has 8 sides?', options: ['Hexagon', 'Pentagon', 'Octagon', 'Circle'], correctIndex: 2 },
        ],
    },
    'logic': {
        'Pattern Match': [
            { question: 'What comes next? 🔴 🔵 🔴 🔵 ?', options: ['🔴', '🔵', '🟢', '🟡'], correctIndex: 0 },
            { question: 'What comes next? 1, 2, 3, 4, ?', options: ['4', '5', '6', '7'], correctIndex: 1 },
            { question: 'What comes next? ⬆️ ⬇️ ⬆️ ⬇️ ?', options: ['⬅️', '➡️', '⬆️', '⬇️'], correctIndex: 2 },
            { question: 'What comes next? 🌙 🌙 ⭐ 🌙 🌙 ?', options: ['🌙', '⭐', '☀️', '🌈'], correctIndex: 1 },
            { question: 'What comes next? A, B, C, D, ?', options: ['D', 'E', 'F', 'G'], correctIndex: 1 },
        ],
    },
};

export default function StudentGamePlayerPage({ params }: { params: Promise<{ token: string; id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const [game, setGame] = useState<Game | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [gameComplete, setGameComplete] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([]);

    // Spelling game state
    const [spellingInput, setSpellingInput] = useState<string[]>([]);
    const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);

    // Match game state
    const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
    const [matchedPairs, setMatchedPairs] = useState<[number, number][]>([]);

    const shuffleArray = <T,>(array: T[]): T[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    useEffect(() => {
        const fetchGame = async () => {
            try {
                // Fetch all games with token and find specific one
                const res = await fetch(`${API_BASE}/student/access/${resolvedParams.token}/games`);
                const games = await res.json();
                const foundGame = games.find((g: any) => g.id === resolvedParams.id);
                setGame(foundGame || null);
            } catch (err) {
                console.error('Failed to fetch game:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchGame();
    }, [resolvedParams.token, resolvedParams.id]);

    const getQuestions = () => {
        if (!game) return [];
        const gameTypeContent = GAME_CONTENT[game.gameType];
        if (!gameTypeContent) return GAME_CONTENT['quiz']['Sight Words Race'];
        return gameTypeContent[game.title] || Object.values(gameTypeContent)[0] || [];
    };

    useEffect(() => {
        if (game) {
            const allQuestions = getQuestions();
            setShuffledQuestions(shuffleArray(allQuestions));
        }
    }, [game]);

    const questions = shuffledQuestions.length > 0 ? shuffledQuestions : getQuestions();
    const currentQ = questions[currentQuestion];

    const handleQuizAnswer = (index: number) => {
        if (showFeedback) return;
        setSelectedAnswer(index);
        const correct = index === currentQ.correctIndex;
        setIsCorrect(correct);
        if (correct) setScore(prev => prev + 1);
        setShowFeedback(true);

        setTimeout(() => {
            if (currentQuestion + 1 >= questions.length) {
                setGameComplete(true);
            } else {
                setCurrentQuestion(prev => prev + 1);
                setSelectedAnswer(null);
                setShowFeedback(false);
            }
        }, 1200);
    };

    const handleCountingAnswer = (num: number) => {
        if (showFeedback) return;
        const correct = num === currentQ.count;
        setIsCorrect(correct);
        if (correct) setScore(prev => prev + 1);
        setShowFeedback(true);

        setTimeout(() => {
            if (currentQuestion + 1 >= questions.length) {
                setGameComplete(true);
            } else {
                setCurrentQuestion(prev => prev + 1);
                setShowFeedback(false);
            }
        }, 1200);
    };

    useEffect(() => {
        if (game?.gameType === 'spelling' && currentQ?.letters) {
            setSpellingInput([]);
            const shuffled = [...currentQ.letters].sort(() => Math.random() - 0.5);
            setShuffledLetters(shuffled);
        }
    }, [currentQuestion, game?.gameType]);

    const handleLetterClick = (letter: string, index: number) => {
        if (spellingInput.length >= currentQ.word.length) return;
        setSpellingInput(prev => [...prev, letter]);
        setShuffledLetters(prev => prev.filter((_, i) => i !== index));

        const newInput = [...spellingInput, letter];
        if (newInput.length === currentQ.word.length) {
            const isWordCorrect = newInput.join('') === currentQ.word;
            setIsCorrect(isWordCorrect);
            if (isWordCorrect) setScore(prev => prev + 1);
            setShowFeedback(true);

            setTimeout(() => {
                if (currentQuestion + 1 >= questions.length) {
                    setGameComplete(true);
                } else {
                    setCurrentQuestion(prev => prev + 1);
                    setShowFeedback(false);
                }
            }, 1500);
        }
    };

    const handleRemoveLetter = (index: number) => {
        const letter = spellingInput[index];
        setSpellingInput(prev => prev.filter((_, i) => i !== index));
        setShuffledLetters(prev => [...prev, letter]);
    };

    const handleMatchClick = (side: 'left' | 'right', index: number) => {
        if (side === 'left') {
            setSelectedLeft(index);
        } else if (selectedLeft !== null) {
            const pair: [number, number] = [selectedLeft, index];
            const isMatch = currentQ.correctPairs.some(
                (cp: [number, number]) => cp[0] === selectedLeft && cp[1] === index
            );

            if (isMatch) {
                setMatchedPairs(prev => [...prev, pair]);
                setScore(prev => prev + 1);
            }
            setSelectedLeft(null);

            if (matchedPairs.length + 1 >= currentQ.correctPairs.length) {
                setTimeout(() => {
                    if (currentQuestion + 1 >= questions.length) {
                        setGameComplete(true);
                    } else {
                        setCurrentQuestion(prev => prev + 1);
                        setMatchedPairs([]);
                    }
                }, 800);
            }
        }
    };

    const isLeftMatched = (index: number) => matchedPairs.some(p => p[0] === index);
    const isRightMatched = (index: number) => matchedPairs.some(p => p[1] === index);

    const resetGame = () => {
        const allQuestions = getQuestions();
        setShuffledQuestions(shuffleArray(allQuestions));
        setCurrentQuestion(0);
        setScore(0);
        setGameComplete(false);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setMatchedPairs([]);
        setSpellingInput([]);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!game) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
                <div className="text-center">
                    <span className="material-symbols-outlined text-5xl text-slate-300">error</span>
                    <p className="text-slate-600 mt-2">Game not found or loading...</p>
                    <button onClick={() => router.push(`/student/access/${resolvedParams.token}`)} className="mt-4 px-6 py-2 bg-primary text-white rounded-xl font-bold">
                        Back to Portal
                    </button>
                </div>
            </div>
        );
    }

    if (gameComplete) {
        const percentage = Math.round((score / questions.length) * 100);
        const stars = percentage >= 80 ? 3 : percentage >= 60 ? 2 : percentage >= 40 ? 1 : 0;

        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-white to-secondary/10 p-4 font-sans">
                <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center animate-in zoom-in duration-500">
                    <div className="text-6xl mb-4">🎉</div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Great Job!</h1>
                    <p className="text-slate-500 mb-6">You completed {game.title}</p>

                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 mb-6">
                        <p className="text-5xl font-bold text-primary">{score}/{questions.length}</p>
                        <p className="text-slate-600 mt-1">Correct Answers</p>
                        <div className="flex justify-center gap-2 mt-4">
                            {[1, 2, 3].map((s) => (
                                <span key={s} className={`text-4xl ${s <= stars ? 'animate-bounce' : 'opacity-30'}`} style={{ animationDelay: `${s * 0.1}s` }}>
                                    ⭐
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={resetGame}
                            className="flex-1 py-3 border-2 border-primary text-primary rounded-xl font-bold hover:bg-primary/5 transition-colors"
                        >
                            Play Again
                        </button>
                        <button
                            onClick={() => router.push(`/student/access/${resolvedParams.token}`)}
                            className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors"
                        >
                            Back to Portal
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const renderGame = () => {
        if (['quiz', 'drag_drop', 'logic'].includes(game.gameType)) {
            return (
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                        <p className="text-2xl font-bold text-slate-900">{currentQ.question}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {currentQ.options.map((option: string, idx: number) => (
                            <button
                                key={idx}
                                onClick={() => handleQuizAnswer(idx)}
                                disabled={showFeedback}
                                className={`p-6 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 hover:-translate-y-1 shadow-lg ${showFeedback
                                    ? idx === currentQ.correctIndex
                                        ? 'bg-green-500 text-white scale-105'
                                        : selectedAnswer === idx
                                            ? 'bg-red-500 text-white shake'
                                            : 'bg-white text-slate-600 opacity-50'
                                    : 'bg-white text-slate-900 hover:bg-primary/5 border-2 border-transparent hover:border-primary'
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            );
        }

        if (game.gameType === 'counting') {
            return (
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                        <p className="text-lg text-slate-600 mb-4">How many {currentQ.emoji} do you see?</p>
                        <div className="flex flex-wrap justify-center gap-4 text-5xl">
                            {Array.from({ length: currentQ.count }, (_, i) => (
                                <span key={i} className="animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                                    {currentQ.emoji}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        {currentQ.options.map((num: number, idx: number) => (
                            <button
                                key={idx}
                                onClick={() => handleCountingAnswer(num)}
                                disabled={showFeedback}
                                className={`py-6 rounded-2xl text-3xl font-bold transition-all transform hover:scale-105 shadow-lg ${showFeedback
                                    ? num === currentQ.count
                                        ? 'bg-green-500 text-white scale-110'
                                        : 'bg-white text-slate-400 opacity-50'
                                    : 'bg-white text-slate-900 hover:bg-primary hover:text-white'
                                    }`}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </div>
            );
        }

        if (game.gameType === 'spelling') {
            return (
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                        <p className="text-lg text-slate-600 mb-2">Spell the word:</p>
                        <p className="text-xl text-primary font-bold">{currentQ.hint}</p>
                    </div>

                    <div className="flex justify-center gap-3">
                        {Array.from({ length: currentQ.word.length }, (_, i) => (
                            <div
                                key={i}
                                onClick={() => spellingInput[i] && handleRemoveLetter(i)}
                                className={`w-16 h-16 rounded-xl border-4 flex items-center justify-center text-3xl font-bold cursor-pointer transition-all ${spellingInput[i]
                                    ? showFeedback
                                        ? isCorrect
                                            ? 'bg-green-100 border-green-500 text-green-700'
                                            : 'bg-red-100 border-red-500 text-red-700 shake'
                                        : 'bg-primary/10 border-primary text-primary'
                                    : 'bg-slate-100 border-slate-300 border-dashed'
                                    }`}
                            >
                                {spellingInput[i] || ''}
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center gap-3 flex-wrap">
                        {shuffledLetters.map((letter, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleLetterClick(letter, idx)}
                                className="w-14 h-14 rounded-xl bg-white shadow-lg border-2 border-slate-200 text-2xl font-bold text-slate-900 hover:bg-primary hover:text-white hover:border-primary transition-all transform hover:scale-110"
                            >
                                {letter}
                            </button>
                        ))}
                    </div>
                </div>
            );
        }

        if (game.gameType === 'match') {
            return (
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
                        <p className="text-lg text-slate-600">Match the items on the left with the right!</p>
                    </div>

                    <div className="flex gap-8 justify-center">
                        <div className="space-y-3">
                            {currentQ.left.map((item: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => handleMatchClick('left', idx)}
                                    disabled={isLeftMatched(idx)}
                                    className={`w-32 py-4 rounded-xl text-lg font-bold transition-all ${isLeftMatched(idx)
                                        ? 'bg-green-100 text-green-700 border-2 border-green-500'
                                        : selectedLeft === idx
                                            ? 'bg-primary text-white shadow-lg scale-105'
                                            : 'bg-white border-2 border-slate-200 text-slate-900 hover:border-primary'
                                        }`}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-3">
                            {currentQ.right.map((item: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => handleMatchClick('right', idx)}
                                    disabled={isRightMatched(idx)}
                                    className={`w-32 py-4 rounded-xl text-lg font-bold transition-all ${isRightMatched(idx)
                                        ? 'bg-green-100 text-green-700 border-2 border-green-500'
                                        : 'bg-white border-2 border-slate-200 text-slate-900 hover:border-secondary hover:bg-secondary/5'
                                        }`}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="text-center text-slate-500 py-20">
                <p>Game type "{game.gameType}" is coming soon!</p>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 p-4 md:p-8 font-sans">
            <div className="max-w-3xl mx-auto mb-8">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => router.push(`/student/access/${resolvedParams.token}`)}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                        Exit Game
                    </button>
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                        <span className="material-symbols-outlined text-yellow-500">star</span>
                        <span className="font-bold text-slate-900">{score}</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <h1 className="text-xl font-bold text-slate-900">{game.title}</h1>
                        <span className="text-sm text-slate-500">Question {currentQuestion + 1} of {questions.length}</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto">
                {renderGame()}
            </div>

            {showFeedback && (
                <div className={`fixed inset-0 flex items-center justify-center pointer-events-none z-50`}>
                    <div className={`text-9xl animate-bounce ${isCorrect ? '' : 'shake'}`}>
                        {isCorrect ? '✅' : '❌'}
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-10px); }
                    75% { transform: translateX(10px); }
                }
                .shake {
                    animation: shake 0.3s ease-in-out;
                }
            `}</style>
        </div>
    );
}
