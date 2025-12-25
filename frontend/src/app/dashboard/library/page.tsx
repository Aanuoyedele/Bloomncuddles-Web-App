"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface Book {
    id: string;
    title: string;
    author?: string;
    description?: string;
    subject?: string;
    level?: string;
    fileUrl: string;
    coverUrl?: string;
}

interface ClassItem {
    id: string;
    name: string;
}

interface Student {
    id: string;
    name: string;
}

export default function LibraryPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('all');
    const [levelFilter, setLevelFilter] = useState('all');

    // Upload modal
    const [showUpload, setShowUpload] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadForm, setUploadForm] = useState({
        title: '', author: '', description: '', subject: '', level: '',
        fileUrl: '', coverUrl: ''
    });

    // Preview modal
    const [previewBook, setPreviewBook] = useState<Book | null>(null);

    // Assign modal
    const [assignBook, setAssignBook] = useState<Book | null>(null);
    const [assigning, setAssigning] = useState(false);
    const [assignSuccess, setAssignSuccess] = useState(false);
    const [assignTarget, setAssignTarget] = useState<'grade' | 'class' | 'students'>('class');
    const [selectedGrade, setSelectedGrade] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [students, setStudents] = useState<Student[]>([]);

    const grades = ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'];
    const subjects = ['Science', 'Math', 'Fiction', 'History', 'Nature', 'English'];
    const levels = ['Lvl 1', 'Lvl 2', 'Lvl 3'];

    const fetchBooks = async (reset = false) => {
        try {
            setLoading(true);
            const currentPage = reset ? 1 : page;
            const params = new URLSearchParams();
            params.append('page', currentPage.toString());
            params.append('limit', '8');
            if (searchQuery) params.append('search', searchQuery);
            if (subjectFilter !== 'all') params.append('subject', subjectFilter);
            if (levelFilter !== 'all') params.append('level', levelFilter);

            const data = await api.get(`/library?${params.toString()}`);
            if (reset) {
                setBooks(data.books);
                setPage(1);
            } else {
                setBooks(prev => currentPage === 1 ? data.books : [...prev, ...data.books]);
            }
            setTotal(data.total);
        } catch (err) {
            console.error('Failed to fetch books:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchClasses = async () => {
        try {
            const data = await api.get('/classes');
            setClasses(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchStudents = async (classId: string) => {
        try {
            const data = await api.get(`/students?classId=${classId}`);
            setStudents(data.students || data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchBooks(true);
        fetchClasses();
    }, []);

    useEffect(() => {
        fetchBooks(true);
    }, [searchQuery, subjectFilter, levelFilter]);

    useEffect(() => {
        if (selectedClass) fetchStudents(selectedClass);
    }, [selectedClass]);

    const handleLoadMore = () => {
        setPage(prev => prev + 1);
        fetchBooks();
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'fileUrl' | 'coverUrl') => {
        const file = e.target.files?.[0];
        if (!file) return;

        const maxSize = field === 'fileUrl' ? 10 * 1024 * 1024 : 2 * 1024 * 1024;
        if (file.size > maxSize) {
            alert(`File too large. Max ${field === 'fileUrl' ? '10MB' : '2MB'}`);
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setUploadForm(prev => ({ ...prev, [field]: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = async () => {
        if (!uploadForm.title || !uploadForm.fileUrl) {
            alert('Title and file are required');
            return;
        }

        setUploading(true);
        try {
            await api.post('/library', uploadForm);
            setShowUpload(false);
            setUploadForm({ title: '', author: '', description: '', subject: '', level: '', fileUrl: '', coverUrl: '' });
            fetchBooks(true);
        } catch (err) {
            console.error('Upload failed:', err);
        } finally {
            setUploading(false);
        }
    };

    const handleAssign = async () => {
        if (!assignBook) return;

        setAssigning(true);
        try {
            await api.post('/library/assign', {
                bookId: assignBook.id,
                targetType: assignTarget,
                targetGrade: assignTarget === 'grade' ? selectedGrade : undefined,
                classId: assignTarget === 'class' ? selectedClass : undefined,
                studentIds: assignTarget === 'students' ? selectedStudents : undefined
            });

            setAssignSuccess(true);
            setTimeout(() => {
                setAssignBook(null);
                setAssignSuccess(false);
                resetAssignForm();
            }, 1500);
        } catch (err) {
            console.error('Failed to assign book:', err);
        } finally {
            setAssigning(false);
        }
    };

    const resetAssignForm = () => {
        setAssignTarget('class');
        setSelectedGrade('');
        setSelectedClass('');
        setSelectedStudents([]);
    };

    const toggleStudent = (id: string) => {
        setSelectedStudents(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-display">Reading Library</h1>
                    <p className="text-slate-500 text-base mt-2 max-w-xl">Browse and assign digital books to support your curriculum.</p>
                </div>
                <button
                    onClick={() => setShowUpload(true)}
                    className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-secondary/20 transition-all hover:-translate-y-0.5"
                >
                    <span className="material-symbols-outlined text-[20px]">upload</span>
                    <span>Upload New Book</span>
                </button>
            </div>

            {/* Search & Filters */}
            <div className="space-y-4">
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400">search</span>
                    </div>
                    <input
                        className="w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm text-base"
                        placeholder="Search by title, author, or keyword..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    <select
                        value={subjectFilter}
                        onChange={(e) => setSubjectFilter(e.target.value)}
                        className="h-10 px-4 rounded-full border border-slate-200 bg-white text-sm font-bold text-slate-700"
                    >
                        <option value="all">All Subjects</option>
                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select
                        value={levelFilter}
                        onChange={(e) => setLevelFilter(e.target.value)}
                        className="h-10 px-4 rounded-full border border-slate-200 bg-white text-sm font-bold text-slate-700"
                    >
                        <option value="all">All Levels</option>
                        {levels.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    {(subjectFilter !== 'all' || levelFilter !== 'all') && (
                        <button
                            onClick={() => { setSubjectFilter('all'); setLevelFilter('all'); }}
                            className="text-primary text-sm font-bold hover:underline whitespace-nowrap px-2"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            </div>

            {/* Loading */}
            {loading && books.length === 0 && (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            )}

            {/* Empty State */}
            {!loading && books.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
                    <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">menu_book</span>
                    <h3 className="text-lg font-bold text-slate-700">No Books Found</h3>
                    <p className="text-slate-500 mt-1">Upload your first book to get started!</p>
                </div>
            )}

            {/* Books Grid */}
            {books.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">Library Catalog</h2>
                        <span className="text-sm text-slate-500 font-medium">{total} books</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {books.map((book) => (
                            <div key={book.id} className="group flex flex-col rounded-2xl bg-white border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-100">
                                    {book.coverUrl ? (
                                        <img src={book.coverUrl} alt={book.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                                            <span className="material-symbols-outlined text-5xl text-slate-400">menu_book</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-1 flex-col p-4">
                                    <div className="mb-2 flex justify-between items-start">
                                        {book.subject && <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-wide">{book.subject}</span>}
                                        {book.level && <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{book.level}</span>}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1">{book.title}</h3>
                                    {book.author && <p className="text-xs text-slate-500 mb-3 font-medium">by {book.author}</p>}
                                    <div className="flex gap-2 mt-auto pt-3 border-t border-slate-100">
                                        <button
                                            onClick={() => setPreviewBook(book)}
                                            className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                                        >
                                            Preview
                                        </button>
                                        <button
                                            onClick={() => setAssignBook(book)}
                                            className="flex-1 rounded-lg bg-primary py-2 text-sm font-bold text-white hover:bg-opacity-90 transition-colors"
                                        >
                                            Assign
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Load More */}
                    {books.length < total && (
                        <div className="flex justify-center py-6">
                            <button
                                onClick={handleLoadMore}
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition-all shadow-sm"
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                                ) : (
                                    <>
                                        <span>Load More Books</span>
                                        <span className="material-symbols-outlined">expand_more</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Upload Modal */}
            {showUpload && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowUpload(false)}>
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Upload New Book</h3>
                            <button onClick={() => setShowUpload(false)} className="text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Title *</label>
                                <input
                                    type="text"
                                    value={uploadForm.title}
                                    onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl"
                                    placeholder="Book title..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Author</label>
                                <input
                                    type="text"
                                    value={uploadForm.author}
                                    onChange={(e) => setUploadForm(prev => ({ ...prev, author: e.target.value }))}
                                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl"
                                    placeholder="Author name..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Subject</label>
                                    <select
                                        value={uploadForm.subject}
                                        onChange={(e) => setUploadForm(prev => ({ ...prev, subject: e.target.value }))}
                                        className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl"
                                    >
                                        <option value="">Select...</option>
                                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Level</label>
                                    <select
                                        value={uploadForm.level}
                                        onChange={(e) => setUploadForm(prev => ({ ...prev, level: e.target.value }))}
                                        className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl"
                                    >
                                        <option value="">Select...</option>
                                        {levels.map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                                <textarea
                                    value={uploadForm.description}
                                    onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                                    rows={2}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl resize-none"
                                    placeholder="Brief description..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Book File (PDF/DOCX) *</label>
                                <label className={`flex items-center justify-center w-full h-20 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${uploadForm.fileUrl ? 'border-green-400 bg-green-50' : 'border-slate-300 hover:border-primary hover:bg-primary/5'}`}>
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) => handleFileUpload(e, 'fileUrl')}
                                        className="hidden"
                                    />
                                    {uploadForm.fileUrl ? (
                                        <span className="text-green-600 font-medium flex items-center gap-2">
                                            <span className="material-symbols-outlined">check_circle</span>
                                            File uploaded
                                        </span>
                                    ) : (
                                        <span className="text-slate-500 flex items-center gap-2">
                                            <span className="material-symbols-outlined">upload_file</span>
                                            Click to upload (max 10MB)
                                        </span>
                                    )}
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Cover Image</label>
                                <div className="flex gap-4">
                                    <label className={`flex items-center justify-center w-24 h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors overflow-hidden ${uploadForm.coverUrl ? 'border-primary' : 'border-slate-300 hover:border-primary'}`}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload(e, 'coverUrl')}
                                            className="hidden"
                                        />
                                        {uploadForm.coverUrl ? (
                                            <img src={uploadForm.coverUrl} alt="Cover" className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="material-symbols-outlined text-slate-400 text-3xl">add_photo_alternate</span>
                                        )}
                                    </label>
                                    <p className="text-xs text-slate-500 flex-1">Upload a cover image for the book card. Recommended: 2:3 ratio (e.g., 200x300px). Max 2MB.</p>
                                </div>
                            </div>

                            <button
                                onClick={handleUpload}
                                disabled={uploading || !uploadForm.title || !uploadForm.fileUrl}
                                className={`w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors ${uploading || !uploadForm.title || !uploadForm.fileUrl ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {uploading ? 'Uploading...' : 'Upload Book'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {previewBook && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setPreviewBook(null)}>
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900">{previewBook.title}</h3>
                                {previewBook.author && <p className="text-slate-500">by {previewBook.author}</p>}
                            </div>
                            <button onClick={() => setPreviewBook(null)} className="text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        {previewBook.description && <p className="text-slate-600 mb-4">{previewBook.description}</p>}
                        <div className="flex gap-2 mb-6">
                            {previewBook.subject && <span className="inline-flex items-center rounded-md bg-primary/10 px-3 py-1 text-sm font-bold text-primary">{previewBook.subject}</span>}
                            {previewBook.level && <span className="inline-flex items-center rounded-md bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600">{previewBook.level}</span>}
                        </div>
                        <div className="flex gap-3">
                            <a
                                href={previewBook.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors text-center"
                            >
                                Open File
                            </a>
                            <button
                                onClick={() => { setPreviewBook(null); setAssignBook(previewBook); }}
                                className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors"
                            >
                                Assign
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Modal */}
            {assignBook && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => { setAssignBook(null); resetAssignForm(); }}>
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Assign Book</h3>
                            <button onClick={() => { setAssignBook(null); resetAssignForm(); }} className="text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {assignSuccess ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="material-symbols-outlined text-green-600 text-3xl">check</span>
                                </div>
                                <h4 className="text-lg font-bold text-slate-900">Book Assigned!</h4>
                                <p className="text-slate-500 mt-1">Students can now read {assignBook.title}</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-3 bg-slate-50 rounded-xl">
                                    <p className="font-bold text-slate-900">{assignBook.title}</p>
                                    <p className="text-xs text-slate-500">{assignBook.author} • {assignBook.subject}</p>
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
                                    <select value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)} className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl">
                                        <option value="">Choose grade...</option>
                                        {grades.map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                )}

                                {assignTarget === 'class' && (
                                    <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl">
                                        <option value="">Choose class...</option>
                                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                )}

                                {assignTarget === 'students' && (
                                    <div>
                                        <select value={selectedClass} onChange={(e) => { setSelectedClass(e.target.value); setSelectedStudents([]); }} className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl mb-2">
                                            <option value="">Choose class...</option>
                                            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                        {selectedClass && students.length > 0 && (
                                            <div className="max-h-40 overflow-y-auto bg-slate-50 rounded-xl p-2 space-y-1">
                                                {students.map(s => (
                                                    <label key={s.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-white cursor-pointer">
                                                        <input type="checkbox" checked={selectedStudents.includes(s.id)} onChange={() => toggleStudent(s.id)} className="rounded border-slate-300 text-primary" />
                                                        <span className="text-sm text-slate-700">{s.name}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <button
                                    onClick={handleAssign}
                                    disabled={assigning || (assignTarget === 'grade' && !selectedGrade) || (assignTarget === 'class' && !selectedClass) || (assignTarget === 'students' && selectedStudents.length === 0)}
                                    className={`w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors ${assigning ? 'opacity-70' : ''}`}
                                >
                                    {assigning ? 'Assigning...' : 'Assign Book'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
