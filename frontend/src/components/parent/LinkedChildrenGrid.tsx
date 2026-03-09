"use client";

import Link from "next/link";
import Image from "next/image";

interface Child {
    id: string;
    name: string;
    grade: string;
    className?: string;
    avatarUrl?: string;
}

interface LinkedChildrenGridProps {
    children: Child[];
}

export default function LinkedChildrenGrid({ children }: LinkedChildrenGridProps) {
    const colors = [
        'from-blue-400 to-blue-500',
        'from-pink-400 to-pink-500',
        'from-green-400 to-green-500',
        'from-purple-400 to-purple-500',
    ];

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">family_restroom</span>
                Linked Children
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {children.map((child, index) => (
                    <Link
                        key={child.id}
                        href={`/parent/children/${child.id}`}
                        className="group relative bg-slate-50 hover:bg-white hover:shadow-lg transition-all text-center px-[15px] py-[15px] rounded-[6px]"
                    >
                        {/* Avatar */}
                        <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${colors[index % colors.length]} flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-3`}>
                            {child.avatarUrl ? (
                                <Image src={child.avatarUrl} alt={child.name} width={64} height={64} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                child.name.charAt(0).toUpperCase()
                            )}
                        </div>

                        {/* Name & Info */}
                        <h3 className="font-bold text-slate-800 text-sm">{child.name}</h3>
                        <p className="text-xs text-slate-500">{child.grade}</p>
                        {child.className && (
                            <p className="text-xs text-slate-400">{child.className}</p>
                        )}

                        {/* Hover Arrow */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-primary text-[16px]">arrow_forward</span>
                        </div>
                    </Link>
                ))}

                {/* Link Child Card */}
                <button className="border-2 border-dashed border-slate-200 hover:border-primary hover:bg-primary/5 transition-all text-center group px-[15px] py-[15px] rounded-[6px]">
                    <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 group-hover:bg-primary/10 flex items-center justify-center mb-3 transition-colors">
                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-2xl">add</span>
                    </div>
                    <p className="font-bold text-slate-600 group-hover:text-primary text-sm">Link Child</p>
                </button>
            </div>
        </div>
    );
}
