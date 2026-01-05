import React, { useState, useEffect } from 'react';

interface TickerWidgetProps {
    symbol: string;
    sentiment?: 'bullish' | 'bearish' | 'neutral' | 'volatile';
    darkMode: boolean;
}

export const TickerWidget: React.FC<TickerWidgetProps> = ({ symbol, sentiment, darkMode }) => {
    const [price, setPrice] = useState(() => 100 + Math.random() * 2000);
    const [history, setHistory] = useState(() => Array(20).fill(0).map((_, i) => 100 + i));
    const [change, setChange] = useState(0);

    useEffect(() => { 
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPrice(Math.random() * 100 + 50); 
    }, [symbol]);

    useEffect(() => {
        const interval = setInterval(() => {
            setPrice(prev => {
                const move = (Math.random() - 0.5) * (prev * 0.02);
                const newPrice = prev + move;
                setHistory(h => [...h.slice(1), newPrice]);
                return newPrice;
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const start = history[0];
        const current = history[history.length - 1];
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setChange(((current - start) / start) * 100);
    }, [history]);

    const max = Math.max(...history);
    const min = Math.min(...history);
    const range = max - min || 1;
    const points = history.map((p, i) => {
        const x = (i / (history.length - 1)) * 100;
        const y = 100 - ((p - min) / range) * 100;
        return `${x},${y}`;
    }).join(' ');

    // Use sentiment to determine colors if provided, otherwise fall back to change direction
    const getSentimentColors = () => {
        if (sentiment === 'bullish') {
            return {
                colorClass: 'text-emerald-500',
                strokeColor: '#10b981',
                bgClasses: darkMode ? 'bg-emerald-500/10 border-emerald-700' : 'bg-emerald-50 border-emerald-200'
            };
        } else if (sentiment === 'bearish') {
            return {
                colorClass: 'text-rose-500',
                strokeColor: '#f43f5e',
                bgClasses: darkMode ? 'bg-rose-500/10 border-rose-700' : 'bg-rose-50 border-rose-200'
            };
        } else if (sentiment === 'volatile') {
            return {
                colorClass: 'text-amber-500',
                strokeColor: '#f59e0b',
                bgClasses: darkMode ? 'bg-amber-500/10 border-amber-700' : 'bg-amber-50 border-amber-200'
            };
        } else if (sentiment === 'neutral') {
            return {
                colorClass: change >= 0 ? 'text-emerald-500' : 'text-rose-500',
                strokeColor: change >= 0 ? '#10b981' : '#f43f5e',
                bgClasses: darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
            };
        } else {
            // Default when no sentiment: use change direction and default styling
            return {
                colorClass: change >= 0 ? 'text-emerald-500' : 'text-rose-500',
                strokeColor: change >= 0 ? '#10b981' : '#f43f5e',
                bgClasses: darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white/50 border-slate-200'
            };
        }
    };

    const { colorClass, strokeColor, bgClasses } = getSentimentColors();

    return (
        <div className={`rounded-lg p-2 mb-2 flex items-center justify-between border ${bgClasses}`}>
            <div>
                <div className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{symbol}</div>
                <div className={`text-sm font-mono font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>${price.toFixed(2)}</div>
                <div className={`text-[10px] font-medium ${colorClass}`}>{change >= 0 ? '+' : ''}{change.toFixed(2)}%</div>
            </div>
            <div className="w-16 h-8">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polyline points={points} fill="none" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    );
};
