"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { format, formatDistanceToNow } from "date-fns";

interface Contact {
    id: string;
    name: string;
    role: string;
    avatar?: string;
    childName?: string;
    unreadCount: number;
    isOnline?: boolean;
    lastSeenAt?: string;
    isAvailableToChat?: boolean;
    lastMessage?: {
        content: string;
        createdAt: string;
    } | null;
}

interface Message {
    id: string;
    content: string;
    senderId: string;
    receiverId: string;
    type: string;
    contextId?: string;
    createdAt: string;
    isRead: boolean;
}

export default function DashboardMessagesPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loadingContacts, setLoadingContacts] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAvailableToChat, setIsAvailableToChat] = useState(true);
    const [myRole, setMyRole] = useState<string>("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch user and contacts on mount
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setCurrentUser(user);
            setMyRole(user.role || '');
        }

        const fetchContacts = async () => {
            try {
                const data = await api.get('/messages/contacts');
                setContacts(data);
            } catch (err) {
                console.error('Failed to load contacts:', err);
            } finally {
                setLoadingContacts(false);
            }
        };

        // Fetch my status
        const fetchMyStatus = async () => {
            try {
                const data = await api.get('/presence/me');
                setIsAvailableToChat(data.isAvailableToChat ?? true);
            } catch (err) {
                console.error('Failed to fetch status:', err);
            }
        };

        fetchContacts();
        fetchMyStatus();

        // Heartbeat every 30 seconds to update online status
        const heartbeatInterval = setInterval(async () => {
            try {
                await api.post('/presence/heartbeat', {});
            } catch (err) {
                console.error('Heartbeat failed:', err);
            }
        }, 30000);

        // Mark as online
        api.post('/presence/update', { isOnline: true }).catch(() => { });

        // Cleanup - mark as offline when leaving
        return () => {
            clearInterval(heartbeatInterval);
            api.post('/presence/update', { isOnline: false }).catch(() => { });
        };
    }, []);

    // Fetch messages when contact changes
    useEffect(() => {
        if (!selectedContact) return;

        const fetchMessages = async () => {
            setLoadingMessages(true);
            try {
                const data = await api.get(`/messages/${selectedContact.id}`);
                setMessages(data);

                // Update unread count locally
                setContacts(prev => prev.map(c =>
                    c.id === selectedContact.id ? { ...c, unreadCount: 0 } : c
                ));
            } catch (err) {
                console.error('Failed to load messages:', err);
            } finally {
                setLoadingMessages(false);
            }
        };

        fetchMessages();
    }, [selectedContact]);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Toggle availability to chat
    const handleToggleAvailability = async () => {
        const newValue = !isAvailableToChat;
        setIsAvailableToChat(newValue);
        try {
            await api.post('/presence/availability', { isAvailableToChat: newValue });
        } catch (err) {
            console.error('Failed to toggle availability:', err);
            setIsAvailableToChat(!newValue); // Revert
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedContact || !newMessage.trim()) return;

        const tempId = `temp-${Date.now()}`;
        const msgContent = newMessage;

        // Optimistic update
        const optimisticMsg: Message = {
            id: tempId,
            content: msgContent,
            senderId: currentUser?.id,
            receiverId: selectedContact.id,
            type: 'general',
            createdAt: new Date().toISOString(),
            isRead: false
        };

        setMessages(prev => [...prev, optimisticMsg]);
        setNewMessage("");

        try {
            const sentMsg = await api.post('/messages', {
                receiverId: selectedContact.id,
                content: msgContent,
                type: 'general'
            });

            // Replace temp message with real one
            setMessages(prev => prev.map(m => m.id === tempId ? sentMsg : m));

            // Update last message in sidebar
            setContacts(prev => prev.map(c =>
                c.id === selectedContact.id
                    ? { ...c, lastMessage: { content: msgContent, createdAt: sentMsg.createdAt } }
                    : c
            ));
        } catch (err) {
            console.error('Failed to send message:', err);
            // Remove optimistic message on error
            setMessages(prev => prev.filter(m => m.id !== tempId));
            alert('Failed to send message. Please try again.');
        }
    };

    const getInitials = (name: string) => name.charAt(0).toUpperCase();

    // Filter contacts by search
    const filteredContacts = contacts.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Get avatar color based on role
    const getAvatarColor = (role: string) => {
        if (role.includes('Parent')) return 'from-green-500 to-emerald-500';
        if (role.includes('Teacher')) return 'from-blue-500 to-indigo-500';
        if (role.includes('Admin')) return 'from-purple-500 to-violet-500';
        return 'from-slate-500 to-slate-600';
    };

    // Format last seen time
    const formatLastSeen = (lastSeen: string | undefined) => {
        if (!lastSeen) return 'Never';
        return formatDistanceToNow(new Date(lastSeen), { addSuffix: true });
    };

    // Get online status indicator
    const getStatusIndicator = (contact: Contact) => {
        if (contact.isOnline) {
            if (contact.isAvailableToChat === false) {
                return { color: 'bg-amber-400', text: 'Busy' };
            }
            return { color: 'bg-green-500', text: 'Online' };
        }
        return { color: 'bg-slate-300', text: `Last seen ${formatLastSeen(contact.lastSeenAt)}` };
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-display">Messages</h1>
                    <p className="text-slate-500 text-base mt-2">Communicate with parents, teachers, and school staff.</p>
                </div>

                {/* Availability Toggle (for teachers/admins) */}
                {(myRole === 'TEACHER' || myRole === 'ADMIN') && (
                    <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-2 border border-slate-200">
                        <span className={`w-3 h-3 rounded-full ${isAvailableToChat ? 'bg-green-500' : 'bg-amber-400'}`} />
                        <span className="text-sm font-medium text-slate-700">
                            {isAvailableToChat ? 'Available to chat' : 'Busy'}
                        </span>
                        <button
                            onClick={handleToggleAvailability}
                            className={`relative w-12 h-6 rounded-full transition-colors ${isAvailableToChat ? 'bg-green-500' : 'bg-slate-300'}`}
                        >
                            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${isAvailableToChat ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>
                )}
            </div>

            {/* Main Chat UI */}
            <div className="h-[calc(100vh-240px)] flex flex-col md:flex-row gap-6">
                {/* Sidebar - Contacts */}
                <div className="w-full md:w-80 lg:w-96 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden shrink-0">
                    <div className="p-4 border-b border-slate-100">
                        <h2 className="text-lg font-bold text-slate-900 mb-3">Conversations</h2>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
                            <input
                                type="text"
                                placeholder="Search contacts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-10 pl-10 pr-4 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto hidden-scrollbar">
                        {loadingContacts ? (
                            <div className="p-4 space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex gap-3 animate-pulse">
                                        <div className="w-12 h-12 bg-slate-100 rounded-full" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-slate-100 rounded w-2/3" />
                                            <div className="h-3 bg-slate-100 rounded w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredContacts.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">person_off</span>
                                <p>{contacts.length === 0 ? 'No contacts found' : 'No matching contacts'}</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {filteredContacts.map(contact => {
                                    const status = getStatusIndicator(contact);
                                    return (
                                        <button
                                            key={contact.id}
                                            onClick={() => setSelectedContact(contact)}
                                            className={`w-full p-4 flex gap-4 hover:bg-slate-50 transition-colors text-left ${selectedContact?.id === contact.id ? 'bg-primary/5 border-l-4 border-primary' : 'border-l-4 border-transparent'}`}
                                        >
                                            <div className="relative">
                                                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarColor(contact.role)} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                                                    {getInitials(contact.name)}
                                                </div>
                                                {/* Online status indicator */}
                                                <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 ${status.color} rounded-full border-2 border-white`} />
                                                {contact.unreadCount > 0 && (
                                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                                                        {contact.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="font-bold text-slate-900 truncate">{contact.name}</h3>
                                                    {contact.lastMessage && (
                                                        <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                                                            {format(new Date(contact.lastMessage.createdAt), 'MMM d')}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs text-primary font-medium">{contact.role}</span>
                                                    <span className="text-[10px] text-slate-400">• {status.text}</span>
                                                </div>
                                                <p className="text-sm text-slate-500 truncate">
                                                    {contact.lastMessage ? contact.lastMessage.content : 'Start a conversation'}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                    {selectedContact ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(selectedContact.role)} flex items-center justify-center text-white font-bold shadow-sm`}>
                                            {getInitials(selectedContact.name)}
                                        </div>
                                        <span className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusIndicator(selectedContact).color} rounded-full border-2 border-white`} />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-slate-900">{selectedContact.name}</h2>
                                        <p className="text-xs text-slate-500">
                                            {selectedContact.role} • {getStatusIndicator(selectedContact).text}
                                        </p>
                                    </div>
                                </div>
                                {/* Show if contact is unavailable */}
                                {selectedContact.isOnline && selectedContact.isAvailableToChat === false && (
                                    <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-xs font-medium">
                                        <span className="material-symbols-outlined text-[14px]">do_not_disturb</span>
                                        Busy - may not respond immediately
                                    </div>
                                )}
                            </div>

                            {/* Messages List */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
                                {loadingMessages ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="text-center py-20 text-slate-400">
                                        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">forum</span>
                                        <p>No messages yet. Say hello! 👋</p>
                                    </div>
                                ) : (
                                    messages.map((msg, idx) => {
                                        const isMe = msg.senderId === currentUser?.id;
                                        const showDate = idx === 0 ||
                                            new Date(msg.createdAt).toDateString() !== new Date(messages[idx - 1].createdAt).toDateString();

                                        return (
                                            <div key={msg.id}>
                                                {showDate && (
                                                    <div className="flex justify-center my-4">
                                                        <span className="bg-slate-100 text-slate-500 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                                                            {format(new Date(msg.createdAt), 'MMM d, yyyy')}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-[80%] md:max-w-[70%] group ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                                                        <div className={`
                                                            p-4 rounded-2xl shadow-sm text-sm
                                                            ${isMe
                                                                ? 'bg-primary text-white rounded-tr-sm'
                                                                : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm'
                                                            }
                                                        `}>
                                                            {msg.type !== 'general' && (
                                                                <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 block ${isMe ? 'text-white/70' : 'text-primary'}`}>
                                                                    {msg.type}
                                                                </span>
                                                            )}
                                                            <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                                        </div>
                                                        <span className="text-[10px] text-slate-400 mt-1 px-2">
                                                            {format(new Date(msg.createdAt), 'h:mm a')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-white border-t border-slate-100">
                                <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
                                    <div className="flex-1 bg-slate-50 rounded-xl relative border-2 border-transparent focus-within:border-primary/20 focus-within:bg-white transition-all">
                                        <textarea
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type your message..."
                                            className="w-full bg-transparent border-none focus:ring-0 p-3 max-h-32 min-h-[48px] resize-none text-sm"
                                            rows={1}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendMessage(e);
                                                }
                                            }}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="p-3 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                                    >
                                        <span className="material-symbols-outlined text-[20px] translate-x-0.5">send</span>
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 bg-slate-50/30">
                            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-5xl text-indigo-200">chat_bubble</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-700 mb-2">Select a Conversation</h3>
                            <p className="text-center max-w-xs text-slate-500">
                                Choose a contact from the sidebar to view message history or start a new conversation.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
