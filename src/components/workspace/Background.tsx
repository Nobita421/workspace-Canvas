import React from 'react';
import { GRID_SIZE } from '@/lib/constants';

interface BackgroundProps {
    offset: { x: number; y: number };
    showGrid: boolean;
    darkMode: boolean;
}

export const Background: React.FC<BackgroundProps> = ({ offset, showGrid, darkMode }) => {
    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none -z-10 transition-colors duration-500 ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
            <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                    opacity: showGrid ? (darkMode ? 0.15 : 0.08) : (darkMode ? 0.05 : 0.03),
                    backgroundImage: `linear-gradient(${darkMode ? '#475569' : '#000'} 1px, transparent 1px), linear-gradient(90deg, ${darkMode ? '#475569' : '#000'} 1px, transparent 1px)`,
                    backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
                    transform: `translate(${offset.x % GRID_SIZE}px, ${offset.y % GRID_SIZE}px)`
                }}
            />
            <svg className="absolute w-full h-full opacity-30">
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
};
