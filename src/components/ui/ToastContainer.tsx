'use client';

import React, { useEffect, useState } from 'react';
import { Check, X, AlertTriangle, Info, XCircle } from 'lucide-react';
import { useToast, ToastMessage, ToastType } from '@/contexts/ToastContext';

const toastConfig: Record<ToastType, {
    icon: React.ReactNode;
    bgClass: string;
    iconClass: string;
    progressClass: string;
}> = {
    success: {
        icon: <Check size={16} />,
        bgClass: 'bg-emerald-500',
        iconClass: 'text-emerald-400',
        progressClass: 'bg-emerald-400',
    },
    error: {
        icon: <XCircle size={16} />,
        bgClass: 'bg-red-500',
        iconClass: 'text-red-400',
        progressClass: 'bg-red-400',
    },
    warning: {
        icon: <AlertTriangle size={16} />,
        bgClass: 'bg-amber-500',
        iconClass: 'text-amber-400',
        progressClass: 'bg-amber-400',
    },
    info: {
        icon: <Info size={16} />,
        bgClass: 'bg-blue-500',
        iconClass: 'text-blue-400',
        progressClass: 'bg-blue-400',
    },
};

interface ToastItemProps {
    toast: ToastMessage;
    onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
    const [isExiting, setIsExiting] = useState(false);
    const [progress, setProgress] = useState(100);
    const config = toastConfig[toast.type];
    const duration = toast.duration || 4000;

    useEffect(() => {
        // Animate progress bar
        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
            setProgress(remaining);
            
            if (remaining <= 0) {
                clearInterval(interval);
            }
        }, 50);

        return () => clearInterval(interval);
    }, [duration]);

    const handleDismiss = () => {
        setIsExiting(true);
        setTimeout(() => onDismiss(toast.id), 200);
    };

    return (
        <div
            className={`
                relative overflow-hidden
                flex items-start gap-3 
                min-w-[320px] max-w-[420px]
                px-4 py-3 
                bg-slate-900 dark:bg-slate-800
                border border-slate-700
                rounded-xl shadow-2xl
                transform transition-all duration-200
                ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
            `}
            role="alert"
        >
            {/* Icon */}
            <div className={`flex-shrink-0 mt-0.5 ${config.iconClass}`}>
                {config.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium leading-snug">
                    {toast.message}
                </p>
            </div>

            {/* Close button */}
            <button
                onClick={handleDismiss}
                className="flex-shrink-0 p-1 rounded-full hover:bg-slate-700 transition-colors text-slate-400 hover:text-white"
                aria-label="Dismiss notification"
            >
                <X size={14} />
            </button>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700/50">
                <div
                    className={`h-full ${config.progressClass} transition-all duration-100 ease-linear`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}

export function ToastContainer() {
    const { toasts, dismissToast } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div 
            className="fixed top-4 right-4 z-[200] flex flex-col gap-2"
            aria-live="polite"
            aria-label="Notifications"
        >
            {toasts.map((toast) => (
                <ToastItem 
                    key={toast.id} 
                    toast={toast} 
                    onDismiss={dismissToast} 
                />
            ))}
        </div>
    );
}
