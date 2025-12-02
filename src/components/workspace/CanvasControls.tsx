import React from 'react';
import {
    TrendingUp, Grid as GridIcon, Moon, Sun, MousePointer2, Copy, Trash2,
    Search, Folder, PanelLeftOpen, PanelLeftClose, Link as LinkIcon
} from 'lucide-react';
import { Thread } from '@/lib/types';

interface CanvasControlsProps {
    isHistoryOpen: boolean;
    setIsHistoryOpen: (v: boolean) => void;
    setIsPlaygroundMenuOpen: (v: boolean) => void;
    currentPlaygroundName: string;
    darkMode: boolean;
    setDarkMode: (v: boolean) => void;
    snapToGrid: boolean;
    setSnapToGrid: (v: boolean) => void;
    searchQuery: string;
    setSearchQuery: (v: string) => void;
    setSearchMatchIndex: (v: number) => void;
    handleSearchKeyDown: (e: React.KeyboardEvent) => void;
    matchingThreads: Thread[];
    searchMatchIndex: number;
    sentimentFilter: string | null;
    setSentimentFilter: (v: string | null) => void;
    visibleThreads: Thread[];
    selectedIds: Set<string>;
    connectSourceId: string | null;
    setConnectSourceId: (v: string | null) => void;
}

export const CanvasControls: React.FC<CanvasControlsProps> = ({
    isHistoryOpen,
    setIsHistoryOpen,
    setIsPlaygroundMenuOpen,
    currentPlaygroundName,
    darkMode,
    setDarkMode,
    snapToGrid,
    setSnapToGrid,
    searchQuery,
    setSearchQuery,
    setSearchMatchIndex,
    handleSearchKeyDown,
    matchingThreads,
    searchMatchIndex,
    sentimentFilter,
    setSentimentFilter,
    visibleThreads,
    selectedIds,
    connectSourceId,
    setConnectSourceId
}) => {
    return (
        <div className="absolute top-6 left-6 pointer-events-none flex flex-col gap-4">
            <div className={`backdrop-blur-md p-4 rounded-2xl shadow-xl border w-72 pointer-events-auto transition-colors duration-300 ${darkMode ? 'bg-slate-900/80 border-slate-700' : 'bg-white/90 border-slate-200'}`}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <button
                            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                            className={`p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${isHistoryOpen ? 'bg-black/10 dark:bg-white/10' : ''}`}
                        >
                            {isHistoryOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
                        </button>

                        <div className="p-1.5 bg-indigo-500 rounded-lg text-white shrink-0"><TrendingUp size={16} /></div>
                        <button onClick={() => setIsPlaygroundMenuOpen(true)} className="flex flex-col items-start hover:bg-black/5 dark:hover:bg-white/5 px-2 py-1 rounded transition-colors">
                            <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent truncate max-w-[120px]">
                                {currentPlaygroundName}
                            </h1>
                            <span className={`text-[9px] font-medium flex items-center gap-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                v3.4 <Folder size={8} />
                            </span>
                        </button>
                    </div>
                    <div className="flex gap-1 shrink-0">
                        <button onClick={() => setDarkMode(!darkMode)} className={`p-1.5 rounded transition-colors ${darkMode ? 'text-indigo-400 bg-slate-800' : 'text-slate-400 hover:text-slate-600'}`}>{darkMode ? <Moon size={16} /> : <Sun size={16} />}</button>
                        <button onClick={() => setSnapToGrid(!snapToGrid)} className={`p-1.5 rounded transition-colors ${snapToGrid ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`} title="Snap to Grid"><GridIcon size={16} /></button>
                    </div>
                </div>

                <div className="relative mb-4">
                    <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setSearchMatchIndex(0); }}
                        onKeyDown={handleSearchKeyDown}
                        placeholder={matchingThreads.length > 0 ? `Search (${searchMatchIndex + 1}/${matchingThreads.length})` : "Search..."}
                        className={`w-full border rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500' : 'bg-slate-100/50 border-slate-200 placeholder-slate-400'}`}
                    />
                    {matchingThreads.length > 0 && (
                        <div className="absolute right-2 top-2 flex gap-1 text-slate-400">
                            <span className="text-[10px] self-center">{searchMatchIndex + 1}/{matchingThreads.length}</span>
                        </div>
                    )}
                </div>

                <div className="flex gap-2 mb-3">
                    <button onClick={() => setSentimentFilter(sentimentFilter === 'bullish' ? null : 'bullish')} className={`flex-1 border p-2 rounded-xl text-center transition-all ${sentimentFilter === 'bullish' ? 'bg-emerald-500/20 border-emerald-500 ring-2 ring-emerald-500/20' : darkMode ? 'bg-slate-800 border-slate-700 hover:border-emerald-500/50' : 'bg-white border-slate-100 hover:border-emerald-200'}`}>
                        <span className="block text-[10px] uppercase text-emerald-500 font-bold mb-0.5">Bullish</span>
                        <span className={`text-lg font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{visibleThreads.filter(t => t.sentiment === 'bullish').length}</span>
                    </button>
                    <button onClick={() => setSentimentFilter(sentimentFilter === 'bearish' ? null : 'bearish')} className={`flex-1 border p-2 rounded-xl text-center transition-all ${sentimentFilter === 'bearish' ? 'bg-rose-500/20 border-rose-500 ring-2 ring-rose-500/20' : darkMode ? 'bg-slate-800 border-slate-700 hover:border-rose-500/50' : 'bg-white border-slate-100 hover:border-rose-200'}`}>
                        <span className="block text-[10px] uppercase text-rose-500 font-bold mb-0.5">Bearish</span>
                        <span className={`text-lg font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{visibleThreads.filter(t => t.sentiment === 'bearish').length}</span>
                    </button>
                </div>

                <div className="text-[10px] text-slate-500 flex flex-col gap-1 px-1">
                    <span className="flex items-center gap-1"><MousePointer2 size={10} /> Shift+Drag to select multiple</span>
                    <span className="flex items-center gap-1"><Copy size={10} /> Ctrl+D to duplicate</span>
                    {selectedIds.size > 0 && <span className="text-red-400 flex items-center gap-1"><Trash2 size={10} /> Del to remove ({selectedIds.size})</span>}
                </div>
            </div>

            {connectSourceId && (
                <div className="bg-indigo-600 text-white px-4 py-3 rounded-xl shadow-lg shadow-indigo-500/20 text-xs font-medium animate-bounce pointer-events-auto cursor-pointer flex items-center justify-between gap-3" onClick={() => setConnectSourceId(null)}>
                    <span className="flex items-center gap-2"><LinkIcon size={12} /> Link to...</span>
                    <span className="opacity-50 text-[10px]">Cancel</span>
                </div>
            )}
        </div>
    );
};
