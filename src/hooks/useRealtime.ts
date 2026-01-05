import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { User, RealtimeChannel } from '@supabase/supabase-js';
import { throttle } from 'lodash';

interface Cursor {
    x: number;
    y: number;
    userId: string;
    userName: string;
    color: string;
}

interface OnlineUser {
    id: string;
    name: string;
    color: string;
    online_at: string;
    [key: string]: unknown;
}

const CURSOR_COLORS = [
    '#EF4444', // red-500
    '#F59E0B', // amber-500
    '#10B981', // emerald-500
    '#3B82F6', // blue-500
    '#8B5CF6', // violet-500
    '#EC4899', // pink-500
    '#06B6D4', // cyan-500
];

export function useRealtime(playgroundId: string, user: User | null, userName: string) {
    const [cursors, setCursors] = useState<Record<string, Cursor>>({});
    const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
    const channelRef = useRef<RealtimeChannel | null>(null);

    // Assign a random color to the current user - use useState to avoid re-generating on every render
    const [myColor] = useState(() => CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)]);

    useEffect(() => {
        if (!user || !playgroundId) return;

        const channel = supabase.channel(`room:${playgroundId}`, {
            config: {
                presence: {
                    key: user.id,
                },
            },
        });

        channelRef.current = channel;

        channel
            .on('presence', { event: 'sync' }, () => {
                const newState = channel.presenceState();
                const users: OnlineUser[] = [];
                Object.keys(newState).forEach(key => {
                    newState[key].forEach((presence) => {
                        users.push(presence as unknown as OnlineUser);
                    });
                });
                setOnlineUsers(users);
            })
            .on('broadcast', { event: 'cursor-move' }, ({ payload }) => {
                setCursors(prev => ({
                    ...prev,
                    [payload.userId]: payload
                }));
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({
                        id: user.id,
                        name: userName,
                        color: myColor,
                        online_at: new Date().toISOString(),
                    });
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [playgroundId, user, userName, myColor]);

    // Use useRef to store throttled function to avoid recreating it
    const throttledSendRef = useRef(throttle((channel: RealtimeChannel, userId: string, userName: string, color: string, x: number, y: number) => {
        channel.send({
            type: 'broadcast',
            event: 'cursor-move',
            payload: {
                userId,
                userName,
                color,
                x,
                y
            }
        });
    }, 50));

    const broadcastCursor = useCallback((x: number, y: number) => {
        if (!channelRef.current || !user) return;
        throttledSendRef.current(channelRef.current, user.id, userName, myColor, x, y);
    }, [user, userName, myColor]);

    return { cursors, onlineUsers, broadcastCursor };
}
