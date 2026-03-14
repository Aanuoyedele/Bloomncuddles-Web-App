"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface Announcement {
    id: string;
    title: string;
    content: string;
    targetType: string;
    createdAt: string;
    author: {
        name: string;
        role: string;
    };
}

export default function CommunicationsPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        targetType: "all"
    });
    const [submitting, setSubmitting] = useState(false);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const res = await api.get("/announcements");
            setAnnouncements(res.announcements || []);
        } catch (error) {
            console.error("Failed to fetch announcements:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post("/announcements", formData);
            setFormData({ title: "", content: "", targetType: "all" });
            setIsModalOpen(false);
            fetchAnnouncements(); // Refresh list
        } catch (error) {
            console.error("Failed to create announcement:", error);
            alert("Error sending announcement. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="min-h-[calc(100vh-80px)] font-sans -mx-4 md:-mx-8 -mt-4 md:-mt-8 bg-[#F5F7F8] p-6 lg:p-10 relative">
            
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-[#1A1C20] text-3xl font-bold tracking-tight mb-1">Communications</h1>
                    <p className="text-[#88909D] text-sm font-medium">Manage and broadcast school announcements</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-[#486fa1] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#395c87] transition-colors shadow-sm"
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    New Announcement
                </button>
            </div>

            {/* List Area */}
            <div className="bg-white rounded-[24px] p-6 lg:p-8 shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-[#E9ECEF]">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A3C8B]"></div>
                    </div>
                ) : announcements.length === 0 ? (
                    <div className="text-center py-20 bg-[#F8FAFC] rounded-2xl border border-dashed border-[#CBD5E1]">
                        <div className="size-16 rounded-full bg-[#E2E8F0] text-[#64748B] flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-[32px]">campaign</span>
                        </div>
                        <h3 className="text-[#1A1C20] font-bold text-lg mb-2">No Announcements Yet</h3>
                        <p className="text-[#64748B] text-sm max-w-sm mx-auto">Create a new announcement to notify parents and teachers.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {announcements.map((ann) => (
                            <div key={ann.id} className="group border border-[#F1F5F9] hover:border-[#CBD5E1] bg-[#F8FAFC] hover:bg-white rounded-2xl p-6 transition-all shadow-sm hover:shadow-md">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-[#E0E7FF] text-[#4F46E5] flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined">campaign</span>
                                        </div>
                                        <div>
                                            <h3 className="text-[#1A1C20] font-bold text-lg leading-tight">{ann.title}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[#64748B] text-xs font-medium">{ann.author.name}</span>
                                                <span className="size-1 rounded-full bg-[#CBD5E1]"></span>
                                                <span className="text-[#64748B] text-xs font-medium">{formatDate(ann.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                                        ann.targetType === 'all' ? 'bg-[#D0C3FA] text-[#4A3C8B]' :
                                        ann.targetType === 'teachers' ? 'bg-[#8EEBBA] text-[#1E7044]' :
                                        'bg-[#A4CCFE] text-[#2B5494]'
                                    }`}>
                                        To: {ann.targetType}
                                    </span>
                                </div>
                                <p className="text-[#4A5568] text-sm leading-relaxed pl-[52px]">{ann.content}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Announcement Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-[#1A1C20]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[24px] shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-[#F1F5F9]">
                            <h2 className="text-[#1A1C20] text-xl font-bold">New Announcement</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-[#88909D] hover:bg-[#F1F5F9] p-2 rounded-full transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-4 mb-8">
                                <div>
                                    <label className="block text-sm font-bold text-[#4A5568] mb-1.5">Subject Title</label>
                                    <input 
                                        type="text" 
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A3C8B]/20 focus:border-[#4A3C8B] transition-all"
                                        placeholder="E.g., School Closure on Friday"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#4A5568] mb-1.5">Audience</label>
                                    <select 
                                        name="targetType"
                                        value={formData.targetType}
                                        onChange={handleChange}
                                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A3C8B]/20 focus:border-[#4A3C8B] transition-all"
                                    >
                                        <option value="all">Everyone (Teachers & Parents)</option>
                                        <option value="teachers">Teachers Only</option>
                                        <option value="parents">Parents Only</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#4A5568] mb-1.5">Message Content</label>
                                    <textarea 
                                        name="content"
                                        value={formData.content}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A3C8B]/20 focus:border-[#4A3C8B] transition-all resize-none"
                                        placeholder="Write your announcement message here..."
                                    ></textarea>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4 border-t border-[#F1F5F9]">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 px-4 bg-[#F1F5F9] text-[#4A5568] rounded-xl font-bold hover:bg-[#E2E8F0] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="flex-1 py-3 px-4 bg-[#486fa1] text-white rounded-xl font-bold hover:bg-[#395c87] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-[18px]">send</span>
                                            Send Notice
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
