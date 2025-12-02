import {
    TrendingUp,
    TrendingDown,
    Minus,
} from 'lucide-react';

export const GRID_SIZE = 40;

export const SENTIMENTS = {
    bullish: {
        id: 'bullish',
        label: 'Bullish',
        icon: TrendingUp,
        light: { bg: 'bg-gradient-to-br from-emerald-50 to-teal-100', border: 'border-emerald-400', text: 'text-emerald-800', ring: 'ring-emerald-400' },
        dark: { bg: 'bg-emerald-900/30', border: 'border-emerald-500/50', text: 'text-emerald-300', ring: 'ring-emerald-500' }
    },
    bearish: {
        id: 'bearish',
        label: 'Bearish',
        icon: TrendingDown,
        light: { bg: 'bg-gradient-to-br from-rose-50 to-red-100', border: 'border-rose-400', text: 'text-rose-900', ring: 'ring-rose-400' },
        dark: { bg: 'bg-rose-900/30', border: 'border-rose-500/50', text: 'text-rose-300', ring: 'ring-rose-500' }
    },
    neutral: {
        id: 'neutral',
        label: 'Neutral',
        icon: Minus,
        light: { bg: 'bg-gradient-to-br from-slate-50 to-indigo-100', border: 'border-indigo-300', text: 'text-indigo-800', ring: 'ring-indigo-300' },
        dark: { bg: 'bg-slate-800/50', border: 'border-indigo-500/50', text: 'text-indigo-300', ring: 'ring-indigo-500' }
    },
    volatile: {
        id: 'volatile',
        label: 'Volatility',
        icon: TrendingUp,
        light: { bg: 'bg-gradient-to-br from-amber-50 to-orange-100', border: 'border-amber-400', text: 'text-amber-900', ring: 'ring-amber-400' },
        dark: { bg: 'bg-amber-900/30', border: 'border-amber-500/50', text: 'text-amber-300', ring: 'ring-amber-500' }
    }
};

export const ZONE_COLORS = [
    { id: 'blue', bgLight: 'bg-blue-100/50', borderLight: 'border-blue-200', bgDark: 'bg-blue-900/20', borderDark: 'border-blue-800' },
    { id: 'purple', bgLight: 'bg-purple-100/50', borderLight: 'border-purple-200', bgDark: 'bg-purple-900/20', borderDark: 'border-purple-800' },
    { id: 'orange', bgLight: 'bg-orange-100/50', borderLight: 'border-orange-200', bgDark: 'bg-orange-900/20', borderDark: 'border-orange-800' },
    { id: 'slate', bgLight: 'bg-slate-200/50', borderLight: 'border-slate-300', bgDark: 'bg-slate-800/20', borderDark: 'border-slate-700' },
];
