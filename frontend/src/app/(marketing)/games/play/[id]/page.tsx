"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Game content - same as dashboard version
const GAME_CONTENT: Record<string, any> = {
    'match': {
        'phonics-match': [
            { left: ['A', 'B', 'C', 'D'], right: ['Apple', 'Ball', 'Cat', 'Dog'], correctPairs: [[0, 0], [1, 1], [2, 2], [3, 3]] },
            { left: ['E', 'F', 'G', 'H'], right: ['Hat', 'Egg', 'Fish', 'Goat'], correctPairs: [[0, 1], [1, 2], [2, 3], [3, 0]] },
            { left: ['I', 'J', 'K', 'L'], right: ['Lion', 'Ice', 'Jam', 'Kite'], correctPairs: [[0, 1], [1, 2], [2, 3], [3, 0]] },
            { left: ['M', 'N', 'O', 'P'], right: ['Pig', 'Moon', 'Nest', 'Orange'], correctPairs: [[0, 1], [1, 2], [2, 3], [3, 0]] },
            { left: ['Q', 'R', 'S', 'T'], right: ['Tiger', 'Queen', 'Rain', 'Sun'], correctPairs: [[0, 1], [1, 2], [2, 3], [3, 0]] },
        ],
        'number-bonds': [
            { left: ['3 + 7', '5 + 5', '2 + 8', '4 + 6'], right: ['10', '10', '10', '10'], correctPairs: [[0, 0], [1, 1], [2, 2], [3, 3]] },
            { left: ['1 + 9', '6 + 4', '8 + 2', '0 + 10'], right: ['10', '10', '10', '10'], correctPairs: [[0, 0], [1, 1], [2, 2], [3, 3]] },
            { left: ['1 + 4', '2 + 3', '0 + 5', '5 + 0'], right: ['5', '5', '5', '5'], correctPairs: [[0, 0], [1, 1], [2, 2], [3, 3]] },
            { left: ['10 + 10', '15 + 5', '12 + 8', '11 + 9'], right: ['20', '20', '20', '20'], correctPairs: [[0, 0], [1, 1], [2, 2], [3, 3]] },
            { left: ['7 + 8', '6 + 9', '10 + 5', '11 + 4'], right: ['15', '15', '15', '15'], correctPairs: [[0, 0], [1, 1], [2, 2], [3, 3]] },
        ],
        'rhyme-time': [
            { left: ['Cat', 'Dog', 'Sun', 'Tree'], right: ['Bee', 'Hat', 'Fog', 'Run'], correctPairs: [[0, 1], [1, 2], [2, 3], [3, 0]] },
            { left: ['Moon', 'Star', 'Light', 'Day'], right: ['Car', 'Night', 'Spoon', 'Play'], correctPairs: [[0, 2], [1, 0], [2, 1], [3, 3]] },
            { left: ['Cake', 'Bowl', 'King', 'Bear'], right: ['Ring', 'Lake', 'Hair', 'Roll'], correctPairs: [[0, 1], [1, 3], [2, 0], [3, 2]] },
            { left: ['Fish', 'Book', 'Bell', 'Frog'], right: ['Log', 'Dish', 'Look', 'Shell'], correctPairs: [[0, 1], [1, 2], [2, 3], [3, 0]] },
            { left: ['Snake', 'Boat', 'Train', 'Clock'], right: ['Rain', 'Bake', 'Rock', 'Coat'], correctPairs: [[0, 1], [1, 3], [2, 0], [3, 2]] },
        ],
    },
    'quiz': {
        'sight-words-race': [
            { question: 'Which word says "THE"?', options: ['THE', 'HET', 'TEH', 'ETH'], correctIndex: 0 },
            { question: 'Which word says "AND"?', options: ['DNA', 'NAD', 'AND', 'DAN'], correctIndex: 2 },
            { question: 'Which word says "IS"?', options: ['SI', 'IS', 'II', 'SS'], correctIndex: 1 },
            { question: 'Which word says "YOU"?', options: ['OYU', 'UOY', 'YUO', 'YOU'], correctIndex: 3 },
            { question: 'Which word says "CAN"?', options: ['CAN', 'NAC', 'ANC', 'NCA'], correctIndex: 0 },
            { question: 'Which word says "WAS"?', options: ['SAW', 'WAS', 'AWS', 'SWA'], correctIndex: 1 },
            { question: 'Which word says "SAID"?', options: ['DAIS', 'AIDS', 'SAID', 'SIAD'], correctIndex: 2 },
            { question: 'Which word says "THEY"?', options: ['THEY', 'YETH', 'HETY', 'ETHY'], correctIndex: 0 },
            { question: 'Which word says "HAVE"?', options: ['VHAE', 'HAVE', 'EVAH', 'EAVH'], correctIndex: 1 },
            { question: 'Which word says "FROM"?', options: ['MORF', 'ROFM', 'FROM', 'FOMR'], correctIndex: 2 },
            { question: 'Which word says "WHAT"?', options: ['TAHW', 'WHAT', 'WATH', 'HAWT'], correctIndex: 1 },
            { question: 'Which word says "LIKE"?', options: ['LIKE', 'KILE', 'LIEK', 'EKIL'], correctIndex: 0 },
            { question: 'Which word says "COME"?', options: ['MOCE', 'EMOC', 'COME', 'COEM'], correctIndex: 2 },
            { question: 'Which word says "SOME"?', options: ['EMOS', 'SOME', 'MOSE', 'ESOM'], correctIndex: 1 },
            { question: 'Which word says "LOOK"?', options: ['KOOL', 'LKOO', 'OLOK', 'LOOK'], correctIndex: 3 },
            { question: 'Which word says "MAKE"?', options: ['MAKE', 'EKAM', 'MAEK', 'AKEM'], correctIndex: 0 },
            { question: 'Which word says "GOOD"?', options: ['DOOG', 'OGOD', 'GOOD', 'GODO'], correctIndex: 2 },
            { question: 'Which word says "PLAY"?', options: ['YALP', 'PLAY', 'PAYL', 'LYAP'], correctIndex: 1 },
            { question: 'Which word says "HELP"?', options: ['PLEH', 'LPEH', 'HEPL', 'HELP'], correctIndex: 3 },
            { question: 'Which word says "JUMP"?', options: ['JUMP', 'PMUJ', 'JMUP', 'UPJM'], correctIndex: 0 },
        ],
        'simple-subtraction': [
            { question: '5 - 2 = ?', options: ['2', '3', '4', '5'], correctIndex: 1 },
            { question: '10 - 4 = ?', options: ['4', '5', '6', '7'], correctIndex: 2 },
            { question: '8 - 3 = ?', options: ['3', '4', '5', '6'], correctIndex: 2 },
            { question: '7 - 7 = ?', options: ['0', '1', '7', '14'], correctIndex: 0 },
            { question: '9 - 5 = ?', options: ['3', '4', '5', '14'], correctIndex: 1 },
            { question: '6 - 2 = ?', options: ['2', '3', '4', '5'], correctIndex: 2 },
            { question: '10 - 7 = ?', options: ['1', '2', '3', '4'], correctIndex: 2 },
            { question: '12 - 5 = ?', options: ['5', '6', '7', '8'], correctIndex: 2 },
            { question: '15 - 8 = ?', options: ['6', '7', '8', '9'], correctIndex: 1 },
            { question: '20 - 10 = ?', options: ['5', '10', '15', '20'], correctIndex: 1 },
            { question: '11 - 6 = ?', options: ['4', '5', '6', '7'], correctIndex: 1 },
            { question: '14 - 9 = ?', options: ['3', '4', '5', '6'], correctIndex: 2 },
            { question: '18 - 9 = ?', options: ['7', '8', '9', '10'], correctIndex: 2 },
            { question: '16 - 8 = ?', options: ['6', '7', '8', '9'], correctIndex: 2 },
            { question: '13 - 7 = ?', options: ['4', '5', '6', '7'], correctIndex: 2 },
            { question: '19 - 11 = ?', options: ['6', '7', '8', '9'], correctIndex: 2 },
            { question: '17 - 9 = ?', options: ['6', '7', '8', '9'], correctIndex: 2 },
            { question: '20 - 15 = ?', options: ['3', '4', '5', '6'], correctIndex: 2 },
            { question: '15 - 6 = ?', options: ['7', '8', '9', '10'], correctIndex: 2 },
            { question: '12 - 8 = ?', options: ['2', '3', '4', '5'], correctIndex: 2 },
        ],
    },
    'spelling': {
        'word-builder': [
            { word: 'CAT', hint: 'A furry pet that says meow', letters: ['C', 'A', 'T'] },
            { word: 'DOG', hint: 'A pet that barks', letters: ['D', 'O', 'G'] },
            { word: 'SUN', hint: 'It shines in the sky', letters: ['S', 'U', 'N'] },
            { word: 'BED', hint: 'Where you sleep', letters: ['B', 'E', 'D'] },
            { word: 'HAT', hint: 'You wear it on your head', letters: ['H', 'A', 'T'] },
            { word: 'PIG', hint: 'A pink farm animal', letters: ['P', 'I', 'G'] },
            { word: 'CUP', hint: 'You drink from it', letters: ['C', 'U', 'P'] },
            { word: 'BUS', hint: 'A vehicle that takes many people', letters: ['B', 'U', 'S'] },
            { word: 'PEN', hint: 'You write with it', letters: ['P', 'E', 'N'] },
            { word: 'BAG', hint: 'You carry things in it', letters: ['B', 'A', 'G'] },
            { word: 'MAP', hint: 'Shows you where to go', letters: ['M', 'A', 'P'] },
            { word: 'JAM', hint: 'Sweet spread for bread', letters: ['J', 'A', 'M'] },
            { word: 'NET', hint: 'Used to catch fish', letters: ['N', 'E', 'T'] },
            { word: 'BOX', hint: 'You put things inside it', letters: ['B', 'O', 'X'] },
            { word: 'FOX', hint: 'A clever orange animal', letters: ['F', 'O', 'X'] },
            { word: 'JUG', hint: 'Holds water or juice', letters: ['J', 'U', 'G'] },
            { word: 'LOG', hint: 'A piece of wood', letters: ['L', 'O', 'G'] },
            { word: 'MOP', hint: 'Used to clean floors', letters: ['M', 'O', 'P'] },
            { word: 'TOP', hint: 'The highest part', letters: ['T', 'O', 'P'] },
            { word: 'VAN', hint: 'A big car for carrying things', letters: ['V', 'A', 'N'] },
        ],
    },
    'counting': {
        'counting-fun': [
            { count: 3, emoji: '🍎', options: [2, 3, 4, 5] },
            { count: 5, emoji: '⭐', options: [4, 5, 6, 7] },
            { count: 7, emoji: '🎈', options: [5, 6, 7, 8] },
            { count: 4, emoji: '🐶', options: [3, 4, 5, 6] },
            { count: 6, emoji: '🌸', options: [4, 5, 6, 7] },
            { count: 2, emoji: '🚗', options: [1, 2, 3, 4] },
            { count: 8, emoji: '🍕', options: [6, 7, 8, 9] },
            { count: 9, emoji: '🦋', options: [7, 8, 9, 10] },
            { count: 10, emoji: '🌈', options: [8, 9, 10, 11] },
            { count: 1, emoji: '🎁', options: [0, 1, 2, 3] },
            { count: 11, emoji: '🍭', options: [9, 10, 11, 12] },
            { count: 12, emoji: '🐱', options: [10, 11, 12, 13] },
            { count: 13, emoji: '🏀', options: [11, 12, 13, 14] },
            { count: 14, emoji: '🎵', options: [12, 13, 14, 15] },
            { count: 15, emoji: '🌻', options: [13, 14, 15, 16] },
            { count: 16, emoji: '🐢', options: [14, 15, 16, 17] },
            { count: 17, emoji: '🍓', options: [15, 16, 17, 18] },
            { count: 18, emoji: '🎨', options: [16, 17, 18, 19] },
            { count: 19, emoji: '🦄', options: [17, 18, 19, 20] },
            { count: 20, emoji: '🌟', options: [18, 19, 20, 21] },
        ],
    },
    'drag_drop': {
        'shape-sorter': [
            { question: 'Which shape has 4 equal sides?', options: ['Circle', 'Square', 'Triangle', 'Oval'], correctIndex: 1 },
            { question: 'Which shape is round?', options: ['Square', 'Rectangle', 'Circle', 'Triangle'], correctIndex: 2 },
            { question: 'Which shape has 3 sides?', options: ['Triangle', 'Square', 'Circle', 'Hexagon'], correctIndex: 0 },
            { question: 'Which shape has 6 sides?', options: ['Pentagon', 'Hexagon', 'Octagon', 'Square'], correctIndex: 1 },
            { question: 'Which shape has 8 sides?', options: ['Hexagon', 'Pentagon', 'Octagon', 'Circle'], correctIndex: 2 },
            { question: 'Which shape has 5 sides?', options: ['Pentagon', 'Hexagon', 'Square', 'Triangle'], correctIndex: 0 },
            { question: 'Which shape has 4 corners?', options: ['Circle', 'Triangle', 'Rectangle', 'Oval'], correctIndex: 2 },
            { question: 'Which shape has no corners?', options: ['Square', 'Triangle', 'Circle', 'Pentagon'], correctIndex: 2 },
            { question: 'Which shape looks like a ball?', options: ['Cube', 'Sphere', 'Cone', 'Cylinder'], correctIndex: 1 },
            { question: 'Which shape looks like a box?', options: ['Sphere', 'Cone', 'Cube', 'Cylinder'], correctIndex: 2 },
            { question: 'Which shape looks like an ice cream?', options: ['Cube', 'Sphere', 'Cone', 'Cylinder'], correctIndex: 2 },
            { question: 'Which shape looks like a can?', options: ['Cube', 'Sphere', 'Cone', 'Cylinder'], correctIndex: 3 },
            { question: 'A stop sign is what shape?', options: ['Circle', 'Square', 'Octagon', 'Triangle'], correctIndex: 2 },
            { question: 'A pizza slice is what shape?', options: ['Circle', 'Square', 'Triangle', 'Rectangle'], correctIndex: 2 },
            { question: 'A clock face is usually what shape?', options: ['Circle', 'Square', 'Triangle', 'Hexagon'], correctIndex: 0 },
            { question: 'A dice is what shape?', options: ['Sphere', 'Cube', 'Cylinder', 'Cone'], correctIndex: 1 },
            { question: 'An egg is closest to what shape?', options: ['Circle', 'Oval', 'Square', 'Triangle'], correctIndex: 1 },
            { question: 'A honeycomb cell is what shape?', options: ['Square', 'Pentagon', 'Hexagon', 'Circle'], correctIndex: 2 },
            { question: 'A party hat is what shape?', options: ['Cube', 'Sphere', 'Cone', 'Cylinder'], correctIndex: 2 },
            { question: 'A soccer ball is what shape?', options: ['Cube', 'Sphere', 'Cone', 'Cylinder'], correctIndex: 1 },
        ],
    },
    'logic': {
        'pattern-match': [
            { question: 'What comes next? 🔴 🔵 🔴 🔵 ?', options: ['🔴', '🔵', '🟢', '🟡'], correctIndex: 0 },
            { question: 'What comes next? 1, 2, 3, 4, ?', options: ['4', '5', '6', '7'], correctIndex: 1 },
            { question: 'What comes next? ⬆️ ⬇️ ⬆️ ⬇️ ?', options: ['⬅️', '➡️', '⬆️', '⬇️'], correctIndex: 2 },
            { question: 'What comes next? 🌙 🌙 ⭐ 🌙 🌙 ?', options: ['🌙', '⭐', '☀️', '🌈'], correctIndex: 1 },
            { question: 'What comes next? A, B, C, D, ?', options: ['D', 'E', 'F', 'G'], correctIndex: 1 },
            { question: 'What comes next? 2, 4, 6, 8, ?', options: ['9', '10', '11', '12'], correctIndex: 1 },
            { question: 'What comes next? 🐱 🐶 🐱 🐶 ?', options: ['🐰', '🐱', '🐶', '🐷'], correctIndex: 1 },
            { question: 'What comes next? 5, 10, 15, 20, ?', options: ['22', '24', '25', '30'], correctIndex: 2 },
            { question: 'What comes next? 🟩 🟩 🟦 🟩 🟩 ?', options: ['🟩', '🟦', '🟨', '🟪'], correctIndex: 1 },
            { question: 'What comes next? 1, 3, 5, 7, ?', options: ['8', '9', '10', '11'], correctIndex: 1 },
            { question: 'What comes next? ❤️ 💛 💚 ❤️ 💛 ?', options: ['❤️', '💛', '💚', '💙'], correctIndex: 2 },
            { question: 'What comes next? 10, 9, 8, 7, ?', options: ['5', '6', '7', '8'], correctIndex: 1 },
            { question: 'What comes next? 🌺 🌸 🌺 🌸 ?', options: ['🌷', '🌺', '🌸', '🌼'], correctIndex: 1 },
            { question: 'What comes next? 3, 6, 9, 12, ?', options: ['13', '14', '15', '16'], correctIndex: 2 },
            { question: 'What comes next? Z, Y, X, W, ?', options: ['U', 'V', 'X', 'Y'], correctIndex: 1 },
            { question: 'What comes next? 🔷 🔶 🔷 🔶 ?', options: ['🔴', '🔷', '🔶', '⬛'], correctIndex: 1 },
            { question: 'What comes next? 100, 90, 80, 70, ?', options: ['50', '60', '65', '75'], correctIndex: 1 },
            { question: 'What comes next? 🎈 🎈 🎁 🎈 🎈 ?', options: ['🎈', '🎁', '🎉', '🎊'], correctIndex: 1 },
            { question: 'What comes next? 1, 4, 9, 16, ?', options: ['20', '21', '25', '36'], correctIndex: 2 },
            { question: 'What comes next? 🌑 🌒 🌓 🌔 ?', options: ['🌑', '🌒', '🌕', '🌘'], correctIndex: 2 },
        ],
    },
};

// Game ID to type mapping
const GAME_TYPE_MAP: Record<string, string> = {
    'phonics-match': 'match',
    'number-bonds': 'match',
    'rhyme-time': 'match',
    'shape-sorter': 'drag_drop',
    'word-builder': 'spelling',
    'counting-fun': 'counting',
    'sight-words-race': 'quiz',
    'simple-subtraction': 'quiz',
    'pattern-match': 'logic',
};

const GAME_TITLES: Record<string, string> = {
    'phonics-match': 'Phonics Match',
    'number-bonds': 'Number Bonds',
    'rhyme-time': 'Rhyme Time',
    'shape-sorter': 'Shape Sorter',
    'word-builder': 'Word Builder',
    'counting-fun': 'Counting Fun 1-20',
    'sight-words-race': 'Sight Words Race',
    'simple-subtraction': 'Simple Subtraction',
    'pattern-match': 'Pattern Match',
};

export default function PublicGamePlayerPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const gameId = resolvedParams.id;
    const gameType = GAME_TYPE_MAP[gameId] || 'quiz';
    const gameTitle = GAME_TITLES[gameId] || 'Game';

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

    // Shuffle function
    const shuffleArray = <T,>(array: T[]): T[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const getQuestions = () => {
        const typeContent = GAME_CONTENT[gameType];
        if (!typeContent) return [];
        return typeContent[gameId] || [];
    };

    // Initialize shuffled questions
    useEffect(() => {
        const allQuestions = getQuestions();
        setShuffledQuestions(shuffleArray(allQuestions));
    }, [gameId]);

    const questions = shuffledQuestions.length > 0 ? shuffledQuestions : getQuestions();
    const currentQ = questions[currentQuestion];

    // Handle quiz answer
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

    // Handle counting answer
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

    // Handle spelling
    useEffect(() => {
        if (gameType === 'spelling' && currentQ?.letters) {
            setSpellingInput([]);
            const shuffled = [...currentQ.letters].sort(() => Math.random() - 0.5);
            setShuffledLetters(shuffled);
        }
    }, [currentQuestion, gameType]);

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

    // Handle match game
    const handleMatchClick = (side: 'left' | 'right', index: number) => {
        if (side === 'left') {
            setSelectedLeft(index);
        } else if (selectedLeft !== null) {
            const isMatch = currentQ.correctPairs.some(
                (cp: [number, number]) => cp[0] === selectedLeft && cp[1] === index
            );

            if (isMatch) {
                setMatchedPairs(prev => [...prev, [selectedLeft, index]]);
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
        setShuffledQuestions(shuffleArray(getQuestions()));
        setCurrentQuestion(0);
        setScore(0);
        setGameComplete(false);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setMatchedPairs([]);
        setSpellingInput([]);
    };

    if (!currentQ) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
                <div className="text-center">
                    <span className="material-symbols-outlined text-5xl text-slate-300">error</span>
                    <p className="text-slate-600 mt-2">Game not found</p>
                    <Link href="/games" className="mt-4 inline-block px-6 py-2 bg-primary text-white rounded-xl font-bold">
                        Back to Games
                    </Link>
                </div>
            </div>
        );
    }

    // Game Complete Screen
    if (gameComplete) {
        const percentage = Math.round((score / questions.length) * 100);
        const stars = percentage >= 80 ? 3 : percentage >= 60 ? 2 : percentage >= 40 ? 1 : 0;

        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-white to-secondary/10 p-4">
                <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="text-6xl mb-4">🎉</div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Great Job!</h1>
                    <p className="text-slate-500 mb-6">You completed {gameTitle}</p>

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
                        <Link href="/games" className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center">
                            More Games
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Render game based on type
    const renderGame = () => {
        if (['quiz', 'drag_drop', 'logic'].includes(gameType)) {
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
                                className={`p-6 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 shadow-lg ${showFeedback
                                        ? idx === currentQ.correctIndex
                                            ? 'bg-green-500 text-white scale-105'
                                            : selectedAnswer === idx
                                                ? 'bg-red-500 text-white'
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

        if (gameType === 'counting') {
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
                                className={`py-6 rounded-2xl text-3xl font-bold transition-all shadow-lg ${showFeedback
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

        if (gameType === 'spelling') {
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
                                                : 'bg-red-100 border-red-500 text-red-700'
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

        if (gameType === 'match') {
            return (
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
                        <p className="text-lg text-slate-600">Match the items!</p>
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
                                            : 'bg-white border-2 border-slate-200 text-slate-900 hover:border-secondary'
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

        return null;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 p-4 md:p-8">
            <div className="max-w-3xl mx-auto mb-8">
                <div className="flex items-center justify-between mb-4">
                    <Link href="/games" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium">
                        <span className="material-symbols-outlined">arrow_back</span>
                        Exit Game
                    </Link>
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                        <span className="material-symbols-outlined text-yellow-500">star</span>
                        <span className="font-bold text-slate-900">{score}</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <h1 className="text-xl font-bold text-slate-900">{gameTitle}</h1>
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
                <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
                    <div className="text-9xl animate-bounce">
                        {isCorrect ? '✅' : '❌'}
                    </div>
                </div>
            )}
        </div>
    );
}
