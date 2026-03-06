'use client';

import React, { useEffect, useState } from 'react';

interface RequirePlanProps {
    allowed: string[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export default function RequirePlan({ allowed, children, fallback = null }: RequirePlanProps) {
    const [plan, setPlan] = useState<string>('basic');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                if (user.plan) {
                    setPlan(user.plan);
                }
            }
        } catch (e) {
            console.error('Failed to parse user from local storage', e);
        } finally {
            setLoading(false);
        }
    }, []);

    if (loading) return null;

    if (!allowed.includes(plan)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
