import React from 'react';
import { X } from 'lucide-react';

interface Notification {
    type: string;
    message: string;
    time: string;
}

interface NotificationsProps {
    notifications: Notification[];
    onClose: () => void;
    darkMode: boolean;
}

export const Notifications: React.FC<NotificationsProps> = ({ notifications, onClose, darkMode }) => {
    return (
        <div className={`absolute top-16 right-6 w-72 rounded-xl shadow-2xl border z-50 overflow-hidden flex flex-col max-h-96 ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'}`}>
            <div className={`p-3 border-b flex justify-between items-center ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                <h3 className="font-bold text-xs uppercase tracking-wider">Activity Feed</h3>
                <button onClick={onClose}><X size={14} /></button>
            </div>
            <div className="overflow-y-auto flex-1">
                {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs opacity-50 italic">No recent activity.</div>
                ) : (
                    notifications.map((n, i) => (
                        <div key={i} className={`p-3 text-xs border-b last:border-0 ${darkMode ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-50 hover:bg-slate-50'}`}>
                            <div className="font-bold mb-1">{n.type}</div>
                            <p className="opacity-80">{n.message}</p>
                            <div className="mt-1 text-[9px] opacity-50">{n.time}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
