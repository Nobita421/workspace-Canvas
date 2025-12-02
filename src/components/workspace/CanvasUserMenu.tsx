import React from 'react';
import { Target, Bell, LogOut, TrendingUp } from 'lucide-react';

interface CanvasUserMenuProps {
    user: any;
    userName: string;
    focusMode: boolean;
    setFocusMode: (v: boolean) => void;
    showNotifications: boolean;
    setShowNotifications: (v: boolean) => void;
    notifications: any[];
    setShowProfile: (v: boolean) => void;
    signOut: () => void;
    onlineUsers: any[];
    setShowAuthModal: (v: boolean) => void;
    darkMode: boolean;
}

export const CanvasUserMenu: React.FC<CanvasUserMenuProps> = ({
    user,
    userName,
    focusMode,
    setFocusMode,
    showNotifications,
    setShowNotifications,
    notifications,
    setShowProfile,
    signOut,
    onlineUsers,
    setShowAuthModal,
    darkMode
}) => {
    return (
        <div className="absolute top-6 right-6 pointer-events-auto z-50 flex items-center gap-3">
            {user ? (
                <>
                    <button
                        onClick={() => setFocusMode(!focusMode)}
                        className={`p-2 rounded-full shadow-lg border transition-all hover:scale-105 ${focusMode ? 'bg-indigo-500 text-white border-indigo-600 ring-2 ring-indigo-300' : darkMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-white border-slate-200 text-slate-400'}`}
                        title="Toggle Focus Mode (Show only my posts)"
                    >
                        <Target size={18} />
                    </button>

                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`relative p-2 rounded-full shadow-lg border transition-all hover:scale-105 ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-white border-slate-100 text-slate-800 hover:bg-slate-50'}`}
                    >
                        <Bell size={18} />
                        {notifications.length > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>}
                    </button>

                    <button
                        onClick={() => setShowProfile(true)}
                        className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full shadow-lg border transition-all hover:scale-105 active:scale-95 ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-white border-slate-100 text-slate-800 hover:bg-slate-50'}`}
                    >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold">
                            {userName.slice(0, 1).toUpperCase()}
                        </div>
                        <span className="text-xs font-semibold max-w-[80px] truncate">{userName}</span>
                    </button>

                    <button
                        onClick={() => signOut()}
                        className={`p-2 rounded-full shadow-lg border transition-all hover:scale-105 ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-rose-400 hover:border-rose-500/50' : 'bg-white border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200'}`}
                        title="Sign Out"
                    >
                        <LogOut size={18} />
                    </button>

                    {/* Online Users */}
                    <div className="flex -space-x-2">
                        {onlineUsers.filter(u => u.id !== user.id).slice(0, 3).map(u => (
                            <div key={u.id} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: u.color, color: '#fff' }} title={u.name}>
                                {u.name?.slice(0, 1).toUpperCase()}
                            </div>
                        ))}
                        {onlineUsers.length > 4 && (
                            <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                +{onlineUsers.length - 4}
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <button
                    onClick={() => setShowAuthModal(true)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg border transition-all hover:scale-105 active:scale-95 bg-indigo-500 hover:bg-indigo-600 border-indigo-600 text-white font-medium`}
                >
                    <TrendingUp size={16} />
                    <span className="text-sm">Sign In</span>
                </button>
            )}
        </div>
    );
};
