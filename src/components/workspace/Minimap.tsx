import React, { useMemo } from 'react';
import { Thread } from '@/lib/types';

interface MinimapProps {
    threads: Thread[];
    viewState: { x: number; y: number; zoom: number };
    darkMode: boolean;
}

export const Minimap: React.FC<MinimapProps> = ({ threads, viewState, darkMode }) => {
    const MINIMAP_SIZE = 120;
    const bounds = useMemo(() => {
        if (threads.length === 0) return { minX: -1000, maxX: 1000, minY: -1000, maxY: 1000 };
        const xs = threads.map(t => t.x);
        const ys = threads.map(t => t.y);
        threads.forEach(t => { if (t.type === 'zone') { xs.push(t.x + (t.width || 300)); ys.push(t.y + (t.height || 300)); } });
        return { minX: Math.min(...xs) - 500, maxX: Math.max(...xs) + 500, minY: Math.min(...ys) - 500, maxY: Math.max(...ys) + 500 };
    }, [threads]);

    const width = bounds.maxX - bounds.minX;
    const height = bounds.maxY - bounds.minY;
    const maxDim = Math.max(width, height);

    const viewportW = typeof window !== 'undefined' ? window.innerWidth / viewState.zoom : 1000;
    const viewportH = typeof window !== 'undefined' ? window.innerHeight / viewState.zoom : 1000;
    const viewportX = -viewState.x / viewState.zoom;
    const viewportY = -viewState.y / viewState.zoom;

    const mapX = (val: number) => ((val - bounds.minX) / maxDim) * MINIMAP_SIZE;
    const mapY = (val: number) => ((val - bounds.minY) / maxDim) * MINIMAP_SIZE;
    const mapW = (val: number) => (val / maxDim) * MINIMAP_SIZE;

    return (
        <div className={`backdrop-blur border shadow-xl rounded-lg overflow-hidden relative pointer-events-auto transition-colors duration-300 ${darkMode ? 'bg-slate-900/80 border-slate-700' : 'bg-white/90 border-slate-200'}`} style={{ width: MINIMAP_SIZE, height: MINIMAP_SIZE }}>
            {threads.map(t => {
                if (t.type === 'zone') return (<div key={t.id} className={`absolute rounded-sm opacity-30 ${darkMode ? 'bg-slate-600' : 'bg-slate-300'}`} style={{ left: mapX(t.x), top: mapY(t.y), width: mapW(t.width || 300), height: mapW(t.height || 300) }} />);
                return (<div key={t.id} className={`absolute w-1 h-1 rounded-full ${t.sentiment === 'bullish' ? 'bg-emerald-500' : t.sentiment === 'bearish' ? 'bg-rose-500' : 'bg-slate-400'}`} style={{ left: mapX(t.x), top: mapY(t.y) }} />);
            })}
            <div className={`absolute border-2 cursor-move ${darkMode ? 'border-indigo-400 bg-indigo-400/20' : 'border-indigo-500 bg-indigo-500/10'}`} style={{ left: mapX(viewportX), top: mapY(viewportY), width: (viewportW / maxDim) * MINIMAP_SIZE, height: (viewportH / maxDim) * MINIMAP_SIZE }} />
        </div>
    );
};
