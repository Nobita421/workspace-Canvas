import React, { useState, useEffect } from 'react';

interface LaserPointerProps {
    viewState?: { x: number; y: number; zoom: number };
}

export const LaserPointer: React.FC<LaserPointerProps> = () => {
    const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
    useEffect(() => {
        const handleMove = (e: MouseEvent) => { setTrail(prev => [...prev.slice(-15), { x: e.clientX, y: e.clientY, id: Math.random() }]); };
        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
    }, []);
    return (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
            {trail.map((p, i) => (
                <div key={p.id} className="absolute rounded-full bg-red-500 blur-sm transition-opacity" style={{ left: p.x, top: p.y, width: (i + 5), height: (i + 5), opacity: i / trail.length, transform: 'translate(-50%, -50%)' }} />
            ))}
        </div>
    );
};
