import React from 'react';
import { Plus, Square } from 'lucide-react';

interface ContextMenuProps {
    x: number;
    y: number;
    canvasX: number;
    canvasY: number;
    darkMode: boolean;
    createEntity: (type: 'card' | 'zone', x: number, y: number) => void;
    onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, canvasX, canvasY, darkMode, createEntity, onClose }) => {
    return (
        <div
            className={`absolute z-50 rounded-lg shadow-xl border overflow-hidden py-1 min-w-[140px] ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700'}`}
            style={{ left: x, top: y }}
        >
            <button onClick={() => { createEntity('card', canvasX, canvasY); onClose(); }} className={`w-full text-left px-4 py-2 text-sm hover:${darkMode ? 'bg-slate-700' : 'bg-slate-100'} flex items-center gap-2`}>
                <Plus size={14} /> New Thread
            </button>
            <button onClick={() => { createEntity('zone', canvasX, canvasY); onClose(); }} className={`w-full text-left px-4 py-2 text-sm hover:${darkMode ? 'bg-slate-700' : 'bg-slate-100'} flex items-center gap-2`}>
                <Square size={14} /> New Zone
            </button>
        </div>
    );
};
