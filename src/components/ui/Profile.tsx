import React, { useState, useMemo } from 'react';
import { Thread } from '@/lib/types';
import { Check, Edit2, X } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface ProfileProps {
    user: User | null;
    threads: Thread[];
    onClose: () => void;
    darkMode: boolean;
    userName: string;
    setUserName: (name: string) => void;
    saveProfile: (name: string) => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, threads, onClose, darkMode, userName, saveProfile }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(userName);

    // Calculate member since date once during initial render
    const memberSince = useMemo(() => {
        if (!user?.created_at) return new Date().toLocaleDateString();
        return new Date(user.created_at).toLocaleDateString();
    }, [user]);

    const userThreads = threads.filter(t => t.author === user?.id);
    const bullishCount = userThreads.filter(t => t.sentiment === 'bullish').length;
    const bearishCount = userThreads.filter(t => t.sentiment === 'bearish').length;

    const handleSaveName = () => {
        saveProfile(tempName);
        setIsEditing(false);
    };

    if (!user) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={() => { onClose(); }}>
            <div
                className={`w-80 p-6 rounded-2xl shadow-2xl border ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                onClick={e => { e.stopPropagation(); }}
            >
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${darkMode ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-600'}`}>
                            {user.id.slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                {isEditing ? (
                                    <div className="flex items-center gap-1">
                                        <input
                                            value={tempName}
                                            onChange={(e) => { setTempName(e.target.value); }}
                                            className={`text-lg font-bold w-32 bg-transparent border-b focus:outline-none ${darkMode ? 'border-slate-500' : 'border-slate-300'}`}
                                            autoFocus
                                        />
                                        <button onClick={() => { handleSaveName(); }} className="text-emerald-500"><Check size={14} /></button>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="font-bold text-lg">{userName}</h2>
                                        <button onClick={() => { setIsEditing(true); }} className="text-slate-400 hover:text-indigo-500"><Edit2 size={12} /></button>
                                    </>
                                )}
                            </div>
                            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>ID: {user.id.slice(0, 8)}...</p>
                        </div>
                    </div>
                    <button onClick={onClose} className={`p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors`}><X size={16} /></button>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className={`p-3 rounded-xl border text-center ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                        <div className="text-2xl font-bold">{userThreads.length}</div>
                        <div className="text-[10px] uppercase tracking-wider opacity-60">Total Thesis</div>
                    </div>
                    <div className={`p-3 rounded-xl border text-center ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                        <div className="text-2xl font-bold">{userThreads.reduce((acc, t) => acc + (t.likes || 0), 0)}</div>
                        <div className="text-[10px] uppercase tracking-wider opacity-60">Total Likes</div>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex justify-between text-xs mb-1 font-medium">
                        <span className="text-emerald-500">Bullish {bullishCount}</span>
                        <span className="text-rose-500">Bearish {bearishCount}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
                        <div style={{ width: `${(bullishCount / (bullishCount + bearishCount || 1)) * 100}%` }} className="h-full bg-emerald-500" />
                        <div style={{ width: `${(bearishCount / (bullishCount + bearishCount || 1)) * 100}%` }} className="h-full bg-rose-500" />
                    </div>
                </div>

                <div className={`text-xs text-center pt-4 border-t ${darkMode ? 'border-slate-700 text-slate-500' : 'border-slate-100 text-slate-400'}`}>
                    Member since {memberSince}
                </div>
            </div>
        </div>
    );
}
