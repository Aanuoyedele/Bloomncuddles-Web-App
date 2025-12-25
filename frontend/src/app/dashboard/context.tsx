"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

type UserRole = 'Teacher' | 'Admin' | 'Parent' | 'Student';

interface DecodedToken {
    userId?: string;
    studentId?: string;  // For student logins
    role: string;
    name?: string;
    iat: number;
    exp: number;
}

interface SchoolSettings {
    id: string;
    name: string;
    email: string | null;
    address: string | null;
    logoUrl: string | null;
    primaryColor: string | null;
    theme: string | null;
    academicYear: string | null;
    currentTerm: string | null;
}

interface DashboardContextType {
    userRole: UserRole;
    userId: string | null;
    userName: string;
    isLoading: boolean;
    logout: () => void;
    // School settings
    schoolSettings: SchoolSettings | null;
    refreshSchoolSettings: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// Helper to convert hex to HSL for CSS variable
function hexToHSL(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '222 47% 42%'; // default primary color

    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export function DashboardProvider({ children }: { children: React.ReactNode }) {
    const [userRole, setUserRole] = useState<UserRole>('Teacher');
    const [userId, setUserId] = useState<string | null>(null);
    const [userName, setUserName] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [schoolSettings, setSchoolSettings] = useState<SchoolSettings | null>(null);
    const router = useRouter();

    const fetchSchoolSettings = useCallback(async () => {
        try {
            const data = await api.get('/school/settings');
            setSchoolSettings(data);

            // Apply primary color as CSS variable
            if (data.primaryColor) {
                const hsl = hexToHSL(data.primaryColor);
                document.documentElement.style.setProperty('--primary', hsl);
            }

            // Apply theme (dark/light mode)
            if (data.theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else if (data.theme === 'light') {
                document.documentElement.classList.remove('dark');
            } else if (data.theme === 'system') {
                // Follow system preference
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
        } catch (err) {
            console.error('Failed to fetch school settings:', err);
        }
    }, []);

    useEffect(() => {
        // Hydrate from token
        const token = localStorage.getItem('token');
        if (!token) {
            // No token - redirect to login
            router.push('/login');
            return;
        }

        try {
            const decoded = jwtDecode<DecodedToken>(token);

            // Check if token is expired
            if (decoded.exp * 1000 < Date.now()) {
                localStorage.removeItem('token');
                router.push('/login');
                return;
            }

            // Map backend roles (uppercase) to frontend roles (Capitalized)
            const roleMap: Record<string, UserRole> = {
                'ADMIN': 'Admin',
                'TEACHER': 'Teacher',
                'PARENT': 'Parent',
                'STUDENT': 'Student'
            };
            const mappedRole = roleMap[decoded.role] || 'Teacher';

            setUserId(decoded.userId || decoded.studentId || null);
            setUserRole(mappedRole);
            setUserName(decoded.name || '');

            // Fetch school settings
            fetchSchoolSettings().finally(() => {
                setIsLoading(false);
            });
        } catch (e) {
            console.error("Invalid token", e);
            localStorage.removeItem('token');
            router.push('/login');
        }
    }, [router, fetchSchoolSettings]);

    const logout = () => {
        localStorage.removeItem('token');
        setUserId(null);
        setUserRole('Teacher');
        setUserName('');
        router.push('/login');
    };

    const refreshSchoolSettings = async () => {
        await fetchSchoolSettings();
    };

    return (
        <DashboardContext.Provider value={{
            userRole,
            userId,
            userName,
            isLoading,
            logout,
            schoolSettings,
            refreshSchoolSettings
        }}>
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    const context = useContext(DashboardContext);
    if (context === undefined) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
}

