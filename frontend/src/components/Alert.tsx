"use client";

import { useState, useEffect } from 'react';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
    type: AlertType;
    message: string;
    onClose?: () => void;
    autoClose?: number; // ms
}

const alertStyles: Record<AlertType, { bg: string; border: string; text: string; icon: string }> = {
    success: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-800',
        icon: 'check_circle'
    },
    error: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-800',
        icon: 'error'
    },
    warning: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        text: 'text-yellow-800',
        icon: 'warning'
    },
    info: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        icon: 'info'
    }
};

export default function Alert({ type, message, onClose, autoClose }: AlertProps) {
    const [visible, setVisible] = useState(true);
    const style = alertStyles[type];

    useEffect(() => {
        if (autoClose && autoClose > 0) {
            const timer = setTimeout(() => {
                setVisible(false);
                onClose?.();
            }, autoClose);
            return () => clearTimeout(timer);
        }
    }, [autoClose, onClose]);

    if (!visible) return null;

    return (
        <div className={`${style.bg} ${style.border} border rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200`}>
            <span className={`material-symbols-outlined ${style.text}`}>{style.icon}</span>
            <p className={`flex-1 font-medium ${style.text}`}>{message}</p>
            {onClose && (
                <button
                    onClick={() => { setVisible(false); onClose(); }}
                    className={`${style.text} opacity-70 hover:opacity-100 transition-opacity`}
                >
                    <span className="material-symbols-outlined text-lg">close</span>
                </button>
            )}
        </div>
    );
}
