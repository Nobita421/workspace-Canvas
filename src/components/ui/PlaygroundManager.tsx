import React, { useState } from 'react';
import { Briefcase, X, Check, FolderPlus, Folder } from 'lucide-react';

interface Playground {
    id: string;
    name: string;
}

interface PlaygroundManagerProps {
    playgrounds: Playground[];
    currentId: string;
    onSelect: (id: string) => void;
    onCreate: (name: string) => void;
    darkMode: boolean;
    onClose: () => void;
}

export const PlaygroundManager: React.FC<PlaygroundManagerProps> = ({ playgrounds, currentId, onSelect, onCreate, darkMode, onClose }) => {
    const [newName, setNewName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleCreate = () => {
        if (newName.trim()) {
            onCreate(newName);
            setNewName('');
            setIsCreating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={onClose}>
            <div
                className={`w-96 p-6 rounded-2xl shadow-2xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-lg flex items-center gap-2">
                        <Briefcase size={20} className="text-indigo-500" /> Switch Playground
                    </h2>
                    <button onClick={onClose}><X size={18} /></button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto mb-4 pr-2">
                    {playgrounds.map(pg => (
                        <button
                            key={pg.id}
                            onClick={() => { onSelect(pg.id); onClose(); }}
                            className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${pg.id === currentId
                                ? 'bg-indigo-500 text-white border-indigo-600'
                                : darkMode
                                    ? 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                                    : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}
                        >
                            <span className="font-medium truncate">{pg.name}</span>
                            {pg.id === currentId && <Check size={16} />}
                        </button>
                    ))}
                </div>

                {isCreating ? (
                    <div className="flex gap-2">
                        <input
                            autoFocus
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Playground Name..."
                            className={`flex-1 px-3 py-2 rounded-lg border focus:outline-none ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-300'}`}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                        />
                        <button
                            onClick={handleCreate}
                            className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600"
                        >
                            Add
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsCreating(true)}
                        className={`w-full py-3 border-2 border-dashed rounded-xl flex items-center justify-center gap-2 font-medium transition-colors ${darkMode ? 'border-slate-700 hover:border-slate-500 text-slate-400' : 'border-slate-200 hover:border-slate-400 text-slate-500'}`}
                    >
                        <FolderPlus size={18} /> Create New Playground
                    </button>
                )}
            </div>
        </div>
    );
};
