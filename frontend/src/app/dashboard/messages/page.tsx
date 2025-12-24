"use client";

import { useState } from "react";

export default function MessagesPage() {
    const [selectedMessage, setSelectedMessage] = useState<number | null>(1);

    const messages = [
        { id: 1, sender: "Mr. Math Teacher", subject: "Math Quiz Results", preview: "Leo did great on the fractions quiz today...", time: "10:30 AM", unread: true, avatar: "M", color: "bg-blue-500" },
        { id: 2, sender: "School Admin", subject: "Field Trip Reminder", preview: "Please returned the signed permission slip by...", time: "Yesterday", unread: false, avatar: "S", color: "bg-purple-500" },
        { id: 3, sender: "Mrs. Art Teacher", subject: "Art Supplies Needed", preview: "For next week's project we need...", time: "Oct 24", unread: false, avatar: "A", color: "bg-pink-500" },
    ];

    return (
        <div className="flex h-[calc(100vh-140px)] bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            {/* Sidebar List */}
            <div className="w-full md:w-80 border-r border-slate-200 flex flex-col">
                <div className="p-4 border-b border-slate-200">
                    <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined">edit_square</span>
                        <span>Compose New</span>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            onClick={() => setSelectedMessage(msg.id)}
                            className={`p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors ${selectedMessage === msg.id ? 'bg-primary/5 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded-full ${msg.color} flex items-center justify-center text-white text-xs font-bold`}>
                                        {msg.avatar}
                                    </div>
                                    <span className={`text-sm font-bold text-slate-900 ${msg.unread ? '' : 'font-medium'}`}>{msg.sender}</span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-bold">{msg.time}</span>
                            </div>
                            <h4 className={`text-sm text-slate-800 mb-1 ${msg.unread ? 'font-bold' : 'font-medium'}`}>{msg.subject}</h4>
                            <p className="text-xs text-slate-500 line-clamp-2">{msg.preview}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Message Content */}
            <div className="hidden md:flex flex-1 flex-col bg-slate-50/50">
                {selectedMessage ? (
                    <>
                        <div className="p-6 border-b border-slate-200 bg-white flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-500/20">
                                    M
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">Math Quiz Results</h2>
                                    <p className="text-sm text-slate-500">From <span className="font-bold text-primary">Mr. Math Teacher</span> to <span className="font-bold text-slate-700">Me</span></p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Reply">
                                    <span className="material-symbols-outlined">reply</span>
                                </button>
                                <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 p-8 overflow-y-auto">
                            <p className="text-slate-700 leading-relaxed mb-4">
                                Hello Mr. & Mrs. Smith,
                            </p>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                I wanted to share that Leo did great on the fractions quiz today! He scored a 90% and showed a strong understanding of adding mixed numbers.
                            </p>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                We will be moving on to decimals next week. If you want to practice at home, the "Math Blaster" game in the Game Zone is excellent for this.
                            </p>
                            <p className="text-slate-700 leading-relaxed mt-8">
                                Best regards,<br />
                                <strong>Mr. Thompson</strong><br />
                                <span className="text-sm text-slate-500">5th Grade Math Teacher</span>
                            </p>
                        </div>
                        <div className="p-4 border-t border-slate-200 bg-white">
                            <div className="flex gap-2">
                                <input type="text" placeholder="Type your reply..." className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors" />
                                <button className="bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                                    Send
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                        <span className="material-symbols-outlined text-6xl mb-4 text-slate-300">chat</span>
                        <p>Select a message to view</p>
                    </div>
                )}
            </div>
        </div>
    );
}
