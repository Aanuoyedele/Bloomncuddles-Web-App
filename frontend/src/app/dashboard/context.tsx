"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

type UserRole = 'Teacher' | 'Admin' | 'Parent';

interface User {
    userId: string;
    role: UserRole;
    iat: number;
    exp: number;
}

interface DashboardContextType {
    userRole: UserRole;
    setUserRole: (role: UserRole) => void;
    user: User | null;
    logout: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
    const [userRole, setUserRole] = useState<UserRole>('Owner' as any); // Default fallback, but will cycle to Teacher usually
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Hydrate from token
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode<User>(token);
                // Map backend roles (uppercase) to frontend roles (Capitalized)
                // Backend: ADMIN, TEACHER, PARENT
                // Frontend: Admin, Teacher, Parent
                const roleMap: Record<string, UserRole> = {
                    'ADMIN': 'Admin',
                    'TEACHER': 'Teacher',
                    'PARENT': 'Parent'
                };
                const mappedRole = roleMap[decoded.role] || 'Teacher';

                setUser(decoded);
                setUserRole(mappedRole);
            } catch (e) {
                console.error("Invalid token", e);
                localStorage.removeItem('token');
            }
        } else {
            // Check if we are in a protected route? 
            // For now, let layout handle redirection if needed, or just default to Teacher view for demo
            setUserRole('Teacher');
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setUserRole('Teacher');
        router.push('/login');
    };

    return (
        <DashboardContext.Provider value={{ userRole, setUserRole, user, logout }}>
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
