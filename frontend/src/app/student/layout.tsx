"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import StudentHeader from "@/components/student/StudentHeader";
import StudentFooter from "@/components/student/StudentFooter";

interface StudentUser {
    id: string;
    name: string;
    email: string;
    role: string;
    grade: string;
    className: string;
}

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<StudentUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Skip auth check for token-based access routes
        if (pathname?.startsWith('/student/access/')) {
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            router.push('/login');
            return;
        }

        const parsed = JSON.parse(userData);
        if (parsed.role !== 'STUDENT') {
            router.push('/login');
            return;
        }

        setUser(parsed);
        setLoading(false);
    }, [router, pathname]);

    // For token-based access routes, render without the layout
    if (pathname?.startsWith('/student/access/')) {
        return <>{children}</>;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-cream">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/30 border-t-primary"></div>
                    <p className="text-slate-500 font-medium">Loading your portal...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-cream">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-cream flex flex-col font-sans">
            {/* Header */}
            <StudentHeader studentName={user.name} />

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>

            {/* Footer */}
            <StudentFooter />
        </div>
    );
}
