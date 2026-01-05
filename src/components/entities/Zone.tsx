import React, { useState } from 'react';
import { Thread } from '@/lib/types';
import { ZONE_COLORS } from '@/lib/constants';
import { Lock, Unlock } from 'lucide-react';

interface ZoneProps {
    data: Thread;
    onDragStart: (e: React.MouseEvent | React.TouchEvent, id: string) => void;
    onResizeStart: (e: React.MouseEvent | React.TouchEvent, id: string) => void;
    isDragging: boolean;
    updateThread: (id: string, data: Partial<Thread>) => void;
    darkMode: boolean;
    isSelected: boolean;
    toggleSelection: (id: string) => void;
}

export const Zone: React.FC<ZoneProps> = ({ data, onDragStart, onResizeStart, isDragging, updateThread, darkMode, isSelected, toggleSelection }) => {
    const [localTitle, setLocalTitle] = useState(data.title || '');

    const colorTheme = ZONE_COLORS.find(c => c.id === (data.color || 'slate')) || ZONE_COLORS[3];

    return (
        <div
            className={`absolute rounded-xl border-2 transition-shadow group flex flex-col
                ${darkMode ? colorTheme.bgDark : colorTheme.bgLight}
                ${darkMode ? colorTheme.borderDark : colorTheme.borderLight}
                ${isDragging ? 'cursor-grabbing z-10' : 'cursor-grab z-0'}
                ${isSelected ? `ring-2 ring-indigo-500 ring-offset-2 ${darkMode ? 'ring-offset-slate-900' : 'ring-offset-white'}` : ''}
            `}
            style={{ transform: `translate(${data.x}px, ${data.y}px)`, width: data.width || 300, height: data.height || 300, touchAction: 'none' }}
            onMouseDown={(e) => {
                if (['INPUT', 'TEXTAREA', 'BUTTON'].includes((e.target as HTMLElement).tagName)) return;
                if (data.locked) return;
                if ((e.target as HTMLElement).closest('.resize-handle') || (e.target as HTMLElement).closest('.zone-btn')) return;
                if (e.shiftKey) { e.stopPropagation(); toggleSelection(data.id); } else onDragStart(e, data.id);
            }}
        >
            <div className="p-3 border-b border-inherit/20 flex justify-between items-start">
                <input type="text" value={localTitle} onChange={(e) => { setLocalTitle(e.target.value); updateThread(data.id, { title: e.target.value }); }} className={`zone-input bg-transparent font-bold text-xs uppercase tracking-widest outline-none w-full ${darkMode ? 'text-slate-400 placeholder-slate-600' : 'text-slate-500 placeholder-slate-400'}`} placeholder="ZONE NAME" readOnly={data.locked} onMouseDown={(e) => e.stopPropagation()} />
                <div className="flex gap-1 zone-btn">
                    <button onClick={(e) => { e.stopPropagation(); updateThread(data.id, { locked: !data.locked }); }} className={`p-1 rounded hover:bg-black/10 transition-colors ${data.locked ? 'text-indigo-500' : 'text-slate-400 opacity-0 group-hover:opacity-100'}`}>{data.locked ? <Lock size={12} /> : <Unlock size={12} />}</button>
                    {!data.locked && <button onClick={(e) => { e.stopPropagation(); const idx = ZONE_COLORS.findIndex(c => c.id === (data.color || 'slate')); const nextColor = ZONE_COLORS[(idx + 1) % ZONE_COLORS.length].id; updateThread(data.id, { color: nextColor }); }} className={`w-3 h-3 mt-1 rounded-full opacity-50 hover:opacity-100 transition-opacity ${darkMode ? 'bg-slate-600' : 'bg-slate-400'}`} />}
                </div>
            </div>
            {!data.locked && <div className="resize-handle absolute bottom-0 right-0 w-8 h-8 cursor-nwse-resize flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20" onMouseDown={(e) => { e.stopPropagation(); onResizeStart(e, data.id); }}><div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-slate-500' : 'bg-slate-400'}`} /></div>}
        </div>
    );
};
