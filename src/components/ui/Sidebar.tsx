import React, { useMemo } from 'react';
import { Thread } from '@/lib/types';
import {
    History as HistoryIcon,
    PanelLeftClose,
    Clock,
    ArrowRight,
    Trash2
} from 'lucide-react';

interface SidebarProps {
    historyIds: string[];
    threads: Thread[];
    darkMode: boolean;
    onClose: () => void;
    onNavigate: (item: Thread) => void;
    onClear: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ historyIds, threads, darkMode, onClose, onNavigate, onClear }) => {
    const historyItems = useMemo(() => {
        return historyIds
            .map(id => threads.find(t => t.id === id))
            .filter((t): t is Thread => !!t);
    }, [historyIds, threads]);

    return (
        <div className={`fixed top-0 left-0 h-full w-64 z-50 flex flex-col border-r shadow-2xl transition-colors duration-300 ${darkMode ? 'bg-slate-900/95 border-slate-800 text-slate-200' : 'bg-white/95 border-slate-200 text-slate-800'} backdrop-blur-md`}>
            <div className={`p-4 border-b flex justify-between items-center ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="flex items-center gap-2">
                    <HistoryIcon size={16} className="text-indigo-500" />
                    <h3 className="font-bold text-sm">Session History</h3>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded"><PanelLeftClose size={16} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {historyItems.length === 0 ? (
                    <div className="p-4 text-center text-xs opacity-50 italic">
                        Interact with cards to track your history.
                    </div>
                ) : (
                    historyItems.map((item, i) => {
                        const sentimentColor = item.sentiment === 'bullish' ? 'bg-emerald-500' : item.sentiment === 'bearish' ? 'bg-rose-500' : 'bg-indigo-500';
                        return (
                            <div
                                key={i}
                                onClick={() => { onNavigate(item); }}
                                className={`group p-2.5 rounded-lg cursor-pointer flex items-center justify-between transition-all ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className={`w-2 h-2 rounded-full shrink-0 ${sentimentColor}`} />
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="text-xs font-medium truncate">{item.title || 'Untitled Thesis'}</span>
                                        <span className="text-[9px] opacity-50 flex items-center gap-1"><Clock size={8} /> {item.type === 'zone' ? 'Zone' : 'Card'}</span>
                                    </div>
                                </div>
                                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 text-indigo-500" />
                            </div>
                        )
                    })
                )}
            </div>

            <div className={`p-3 border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <button
                    onClick={onClear}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'}`}
                >
                    <Trash2 size={12} /> Clear History
                </button>
            </div>
        </div>
    );
};
