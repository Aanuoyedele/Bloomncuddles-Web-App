"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface Book {
    id: string;
    title: string;
    author: string | null;
    description: string | null;
    subject: string | null;
    level: string | null;
    fileUrl: string;
    coverUrl: string | null;
    isAssigned: boolean;
    myRequest: {
        id: string;
        status: string;
        createdAt: string;
    } | null;
}

export default function StudentLibraryPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('all');
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [requesting, setRequesting] = useState(false);

    useEffect(() => {
        fetchBooks();
    }, [searchQuery, subjectFilter]);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            let url = '/student/library?';
            if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;
            if (subjectFilter !== 'all') url += `subject=${subjectFilter}`;
            const data = await api.get(url);
            setBooks(data);
        } catch (err) {
            console.error('Failed to fetch books:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRequest = async (bookId: string) => {
        setRequesting(true);
        try {
            await api.post(`/student/library/request/${bookId}`, {});
            fetchBooks();
            setSelectedBook(null);
        } catch (err: any) {
            alert(err.message || 'Failed to request book');
        } finally {
            setRequesting(false);
        }
    };

    const subjects = ['all', 'Science', 'Math', 'Fiction', 'English'];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Reading Library 📚</h1>
                <p className="text-slate-500">Browse and request books from your school library</p>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400">search</span>
                    </div>
                    <input
                        className="w-full h-12 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        placeholder="Search books..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                    {subjects.map((s) => (
                        <button
                            key={s}
                            onClick={() => setSubjectFilter(s)}
                            className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${subjectFilter === s
                                ? 'bg-primary text-white'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                }`}
                        >
                            {s === 'all' ? 'All' : s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Loading */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : books.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                    <span className="text-5xl mb-4 block">📖</span>
                    <p className="text-slate-500">No books found</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {books.map((book) => (
                        <div
                            key={book.id}
                            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer border border-slate-100"
                            onClick={() => setSelectedBook(book)}
                        >
                            <div className="relative aspect-[3/4] bg-slate-100 flex items-center justify-center">
                                {book.coverUrl ? (
                                    <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-5xl text-slate-300">menu_book</span>
                                    </div>
                                )}
                                {book.isAssigned && (
                                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                        Assigned
                                    </div>
                                )}
                                {book.myRequest && (
                                    <div className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full ${book.myRequest.status === 'APPROVED' ? 'bg-green-500 text-white' :
                                        book.myRequest.status === 'DENIED' ? 'bg-red-500 text-white' :
                                            'bg-yellow-500 text-white'
                                        }`}>
                                        {book.myRequest.status}
                                    </div>
                                )}
                            </div>
                            <div className="p-3">
                                <h3 className="font-bold text-slate-900 text-sm line-clamp-2">{book.title}</h3>
                                {book.author && (
                                    <p className="text-slate-500 text-xs mt-1">{book.author}</p>
                                )}
                                {book.subject && (
                                    <span className="inline-block mt-2 px-2 py-1 bg-slate-100 rounded text-xs text-slate-600 font-bold">
                                        {book.subject}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Book Detail Modal */}
            {selectedBook && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedBook(null)}>
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-4 mb-4">
                            <div className="w-24 h-32 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden">
                                {selectedBook.coverUrl ? (
                                    <img src={selectedBook.coverUrl} alt={selectedBook.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-3xl text-slate-300">menu_book</span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">{selectedBook.title}</h2>
                                {selectedBook.author && (
                                    <p className="text-slate-500">by {selectedBook.author}</p>
                                )}
                                <div className="flex gap-2 mt-2">
                                    {selectedBook.subject && (
                                        <span className="px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-600">{selectedBook.subject}</span>
                                    )}
                                    {selectedBook.level && (
                                        <span className="px-2 py-1 bg-primary/10 rounded text-xs font-bold text-primary">{selectedBook.level}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {selectedBook.description && (
                            <p className="text-slate-600 text-sm mb-6">{selectedBook.description}</p>
                        )}

                        <div className="flex gap-3">
                            {selectedBook.isAssigned || (selectedBook.myRequest?.status === 'APPROVED') ? (
                                <a
                                    href={selectedBook.fileUrl}
                                    target="_blank"
                                    className="flex-1 py-3 bg-primary text-white rounded-xl font-bold text-center hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined">open_in_new</span>
                                    Read Book
                                </a>
                            ) : selectedBook.myRequest ? (
                                <div className="flex-1 py-3 bg-yellow-100 text-yellow-700 rounded-xl font-bold text-center">
                                    Request {selectedBook.myRequest.status.toLowerCase()}
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleRequest(selectedBook.id)}
                                    disabled={requesting}
                                    className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                                >
                                    {requesting ? 'Requesting...' : 'Request Book'}
                                </button>
                            )}
                            <button
                                onClick={() => setSelectedBook(null)}
                                className="py-3 px-6 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
