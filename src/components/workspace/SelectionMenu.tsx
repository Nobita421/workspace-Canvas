import React from 'react';
import { LayoutGrid, AlignStartVertical, AlignStartHorizontal, Lock, Unlock } from 'lucide-react';
import { SENTIMENTS } from '@/lib/constants';
import { Thread } from '@/lib/types';

interface SelectionMenuProps {
    selectedIds: Set<string>;
    handleAutoLayout: () => void;
    updateSelectedThreads: (data: Partial<Thread>) => void;
    alignSelection: (mode: 'horizontal' | 'vertical') => void;
    darkMode: boolean;
}

export const SelectionMenu: React.FC<SelectionMenuProps> = ({
    selectedIds,
    handleAutoLayout,
    updateSelectedThreads,
    alignSelection,
    darkMode
}) => {
    if (selectedIds.size <= 1) return null;

    return (
        <div className={`absolute top-6 left-1/2 -translate-x-1/2 rounded-full shadow-xl border px-4 py-2 flex items-center gap-3 z-50 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <span className="text-xs font-bold text-slate-500">{selectedIds.size} Selected</span>
            <div className="h-4 w-px bg-slate-300 dark:bg-slate-600"></div>
            <button onClick={handleAutoLayout} title="Auto Grid Layout" className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><LayoutGrid size={14} /></button>
            <div className="h-4 w-px bg-slate-300 dark:bg-slate-600"></div>
            <div className="flex gap-1">
                {Object.values(SENTIMENTS).map(s => (
                    <button
                        key={s.id}
                        onClick={() => updateSelectedThreads({ sentiment: s.id as 'bullish' | 'bearish' | 'neutral' | 'volatile' })}
                        className={`w-4 h-4 rounded-full border border-black/10 hover:scale-110 transition-transform ${s.dark.bg.replace('/30', '')} ${darkMode ? 'bg-opacity-80' : ''}`}
                        title={`Set all to ${s.label}`}
                    />
                ))}
            </div>
            <div className="h-4 w-px bg-slate-300 dark:bg-slate-600"></div>
            <button onClick={() => alignSelection('horizontal')} title="Align Horizontal" className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><AlignStartVertical size={14} /></button>
            <button onClick={() => alignSelection('vertical')} title="Align Vertical" className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><AlignStartHorizontal size={14} /></button>
            <div className="h-4 w-px bg-slate-300 dark:bg-slate-600"></div>
            <button onClick={() => updateSelectedThreads({ locked: true })} title="Lock All" className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><Lock size={14} /></button>
            <button onClick={() => updateSelectedThreads({ locked: false })} title="Unlock All" className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><Unlock size={14} /></button>
        </div>
    );
};
