import React from 'react';
import {
    Minimize2,
    Maximize2,
    Eye,
    EyeOff,
    Plus,
    Square
} from 'lucide-react';

interface ToolbarProps {
    viewState: { zoom: number };
    setViewState: React.Dispatch<React.SetStateAction<{ x: number; y: number; zoom: number }>>;
    presentationMode: boolean;
    setPresentationMode: (mode: boolean) => void;
    createEntity: (type: 'card' | 'zone') => void;
    darkMode: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
    viewState, setViewState, presentationMode, setPresentationMode, createEntity, darkMode
}) => {
    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 pointer-events-auto">
            <div className={`flex items-center gap-1 backdrop-blur-md px-2 py-1.5 rounded-full shadow-lg border transition-colors ${darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-slate-200'}`}>
                <button onClick={() => { setViewState(p => ({ ...p, zoom: Math.max(0.1, p.zoom - 0.2) })); }} className={`p-2 rounded-full transition-colors ${darkMode ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-100'}`}><Minimize2 size={16} /></button>
                <span className={`text-xs font-mono font-medium w-10 text-center ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{Math.round(viewState.zoom * 100)}%</span>
                <button onClick={() => { setViewState(p => ({ ...p, zoom: Math.min(4, p.zoom + 0.2) })); }} className={`p-2 rounded-full transition-colors ${darkMode ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-100'}`}><Maximize2 size={16} /></button>
            </div>

            <button
                onClick={() => { setPresentationMode(!presentationMode); }}
                className={`p-3 rounded-full shadow-lg transition-all active:scale-95 ${darkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-white text-slate-800 hover:bg-slate-50'}`}
                title={presentationMode ? "Exit Presentation" : "Presentation Mode"}
            >
                {presentationMode ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

            {!presentationMode && (
                <>
                    <button onClick={() => { createEntity('card'); }} className="group flex items-center gap-2 bg-indigo-600 text-white pl-5 pr-6 py-3 rounded-full hover:bg-indigo-500 transition-all active:scale-95 shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/50">
                        <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                        <span className="font-bold text-sm tracking-wide">New Thesis</span>
                    </button>
                    <button onClick={() => { createEntity('zone'); }} className={`p-3 rounded-full shadow-lg transition-all active:scale-95 ${darkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-white text-slate-800 hover:bg-slate-50'}`} title="New Zone">
                        <Square size={18} />
                    </button>
                </>
            )}
        </div>
    );
};
