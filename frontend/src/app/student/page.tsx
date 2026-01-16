"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import HeroSection from "@/components/student/HeroSection";
import QuickAccessGrid from "@/components/student/QuickAccessGrid";
import PickedForYou from "@/components/student/PickedForYou";
import StudentProgress from "@/components/student/StudentProgress";

interface DashboardData {
    student: {
        name: string;
        grade: string;
        className: string;
        teacherName: string;
    };
    stats: {
        pendingAssignments: number;
        totalAssignments: number;
        averageScore: number | null;
        gamesAvailable: number;
    };
}

export default function StudentDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await api.get('/student/dashboard');
                setData(response);
            } catch (err) {
                console.error('Failed to fetch dashboard:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/30 border-t-primary"></div>
            </div>
        );
    }

    // Calculate fun things count
    const funThingsCount = (data?.stats.pendingAssignments || 0) + (data?.stats.gamesAvailable || 0);

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <HeroSection
                studentName={data?.student.name || 'Explorer'}
                funThingsCount={funThingsCount > 0 ? funThingsCount : 5}
            />

            {/* Quick Access Grid */}
            <QuickAccessGrid
                pendingAssignments={data?.stats.pendingAssignments}
                gamesCount={data?.stats.gamesAvailable}
            />

            {/* Picked for You */}
            <PickedForYou />

            {/* Progress Section */}
            <StudentProgress />
        </div>
    );
}
