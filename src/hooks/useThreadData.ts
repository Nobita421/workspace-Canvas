import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Thread } from '@/lib/types';
import { mapThreadFromDB, mapThreadToDB, mapCommentFromDB, mapCommentToDB } from '@/lib/utils';
import { User } from '@supabase/supabase-js';
import { useAuth } from '@/contexts/AuthContext';

interface UseThreadDataProps {
    user: User | null;
    userName: string;
    currentPlaygroundId: string;
    showError: (msg: string) => void;
    showSuccess: (msg: string) => void;
}

export function useThreadData({ user, userName, currentPlaygroundId, showError }: UseThreadDataProps) {
    const { session } = useAuth();
    const [threads, setThreads] = useState<Thread[]>([]);
    const threadsRef = useRef<Thread[]>([]);

    // Keep threadsRef in sync
    useEffect(() => {
        threadsRef.current = threads;
    }, [threads]);

    // Fetch Threads
    useEffect(() => {
        const fetchThreads = async () => {
            interface DBThread {
                id: string;
                [key: string]: unknown;
            }
            let threadsData: DBThread[] = [];
            try {
                const headers: HeadersInit = {};
                if (session?.access_token) {
                    headers['Authorization'] = `Bearer ${session.access_token}`;
                }
                const res = await fetch(`/api/threads?playgroundId=${currentPlaygroundId}`, { headers });
                const json = await res.json();
                if (!res.ok) throw new Error(json.error);
                threadsData = json.threads || [];
            } catch (error) {
                console.error('Error fetching threads:', error);
                showError('Failed to load workspace data. Please refresh the page.');
                return;
            }

            if (threadsData.length > 0) {
                const threadIds = threadsData.map((t) => t.id);

                const [commentsRes, reactionsRes, connectionsRes] = await Promise.all([
                    supabase.from('comments').select('*').in('thread_id', threadIds),
                    supabase.from('reactions').select('*').in('thread_id', threadIds),
                    supabase.from('connections').select('*').in('source_id', threadIds)
                ]);

                const commentsData = commentsRes.data || [];
                const reactionsData = reactionsRes.data || [];
                const connectionsData = connectionsRes.data || [];

                const mappedThreads = threadsData.map(t => {
                    const thread = mapThreadFromDB(t);

                    thread.comments = commentsData
                        .filter(c => c.thread_id === t.id)
                        .map(mapCommentFromDB);

                    const threadReactions = reactionsData.filter(r => r.thread_id === t.id);
                    const reactionCounts: Record<string, number> = {};
                    threadReactions.forEach(r => {
                        reactionCounts[r.emoji] = (reactionCounts[r.emoji] || 0) + 1;
                    });
                    thread.reactions = reactionCounts;

                    thread.connectedTo = connectionsData
                        .filter(c => c.source_id === t.id)
                        .map(c => c.target_id);

                    return thread;
                });
                setThreads(mappedThreads);
            }
        };

        void fetchThreads();

        const channel = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'threads',
                    filter: `canvas_id=eq.${currentPlaygroundId}`
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setThreads(prev => [...prev, mapThreadFromDB(payload.new)]);
                    } else if (payload.eventType === 'UPDATE') {
                        setThreads(prev => prev.map(t => t.id === payload.new.id ? { ...t, ...mapThreadFromDB(payload.new) } : t));
                    } else if (payload.eventType === 'DELETE') {
                        setThreads(prev => prev.filter(t => t.id !== payload.old.id));
                    }
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'comments'
                },
                (payload) => {
                    const newComment = payload.new;
                    setThreads(prev => prev.map(t => {
                        if (t.id === newComment.thread_id) {
                            if (newComment.author_id === user?.id) return t;
                            return {
                                ...t,
                                comments: [...(t.comments || []), mapCommentFromDB(newComment)],
                                activity: (t.activity || 0) + 1
                            };
                        }
                        return t;
                    }));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [currentPlaygroundId, user, showError, session]);

    const pendingUpdates = useRef<Record<string, NodeJS.Timeout>>({});
    const pendingData = useRef<Record<string, Partial<Thread>>>({});

    const updateThread = useCallback(async (id: string, data: Partial<Thread>) => {
        if (!user) return;
        
        // 1. Optimistic Update
        setThreads(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));

        // 2. Accumulate Data - safely access object property
        const currentPendingData = pendingData.current[id];
        pendingData.current[id] = { ...(currentPendingData || {}), ...data };

        // 3. Debounce Server Call - safely access object property
        const existingTimeout = pendingUpdates.current[id];
        if (existingTimeout) {
            clearTimeout(existingTimeout);
        }

        pendingUpdates.current[id] = setTimeout(async () => {
            const updatesToSync = pendingData.current[id];
            if (id in pendingData.current) {
                delete pendingData.current[id];
            }
            if (id in pendingUpdates.current) {
                delete pendingUpdates.current[id];
            }

            if (!updatesToSync) return;

            // Get the latest state to merge with (though we only send updates)
            // We need to map the updates to DB format
            // Note: mapThreadToDB expects a full thread object usually, but let's see if we can just map the partial
            // If mapThreadToDB requires full object, we might need to find the thread first.
            
            // Let's find the current thread from state (it has the optimistic updates applied)
            // Actually, we can't rely on 'threads' state inside setTimeout closure unless we use a ref or functional update, 
            // but we just need to send 'updatesToSync'.
            
            // We need to be careful about mapThreadToDB. It takes (thread, playgroundId, userId).
            // It returns a snake_case object.
            // We should probably map the *merged* thread to be safe, or just map the keys we know.
            // Let's look at mapThreadToDB implementation in utils.ts. 
            // Since I can't see utils.ts right now, I'll assume I need to pass a "complete enough" object or handle mapping manually.
            // However, the original code did: 
            // const updatedThread = { ...currentThread, ...data };
            // const dbPayload = mapThreadToDB(updatedThread, ...);
            
            // So I should try to reconstruct the thread.
            // But 'threads' in this closure is stale.
            // I'll use a functional state update to get the latest thread to map, OR just trust that mapThreadToDB handles partials?
            // Unlikely.
            
            // Better approach: The API expects `updates`. 
            // The original code sent `dbPayload` which was the FULL object mapped to DB format.
            // If the API handles partial updates (PATCH), we should send partials.
            // Let's check the API route... I read it earlier.
            // src/app/api/threads/route.ts likely does supabase.update(updates).
            
            // So I need to map `updatesToSync` to DB format.
            // I'll assume I can construct a "mock" thread with just the updates to pass to mapThreadToDB, 
            // or better, I'll fetch the latest thread from the ref if I maintain one, 
            // OR I'll just map the keys manually if mapThreadToDB is too strict.
            
            // Let's assume for now I can get the thread from the state setter to ensure I have the latest.
            // Wait, I can't access state in setTimeout easily without refs.
            
            // Let's use a ref for threads as well to access inside timeout?
            // Or just pass the `updatesToSync` and hope `mapThreadToDB` works on partials?
            // Let's look at the original code again:
            // const updatedThread = { ...currentThread, ...data };
            // const dbPayload = mapThreadToDB(updatedThread, currentPlaygroundId, user.id);
            
            // I will use a ref to track the latest threads state to ensure I can grab the full object.
            
            // Actually, I'll just use the `updatesToSync` and map it. 
            // But `mapThreadToDB` might need required fields.
            // Let's try to just send the updates.
            
            // To be safe, I will use the `setThreads` callback to get the latest thread, 
            // but I can't trigger a side effect (fetch) from within the setter.
            
            // Solution: `threadsRef`
            
            const currentThread = threadsRef.current.find(t => t.id === id);
            if (!currentThread) return; // Should not happen
            
            // We apply the accumulated updates to the current thread (which should already have them optimistically, 
            // but `threadsRef` needs to be kept in sync).
            
            const finalThreadState = { ...currentThread, ...updatesToSync };
            const dbPayload = mapThreadToDB(finalThreadState, currentPlaygroundId, user.id);

            try {
                const res = await fetch('/api/threads', {
                    method: 'PATCH',
                    headers: { 
                        'Content-Type': 'application/json',
                        ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {})
                    },
                    body: JSON.stringify({
                        userId: user.id,
                        playgroundId: currentPlaygroundId,
                        threadId: id,
                        updates: dbPayload
                    })
                });
                
                if (!res.ok) {
                    const json = await res.json();
                    throw new Error(json.error || 'Failed to update');
                }
            } catch (error) {
                console.error('Error updating thread:', error);
                showError('Failed to save changes. Please try again.');
            }
        }, 500); // 500ms debounce
    }, [user, currentPlaygroundId, showError, session]);

    const addComment = async (threadId: string, commentData: { text: string }) => {
        if (!user) return;
        const payload = {
            text: commentData.text,
            author: user.id,
            authorName: userName || 'Anonymous',
            createdAt: new Date().toISOString()
        };
        setThreads(prev => prev.map(t => {
            if (t.id === threadId) {
                return { ...t, comments: [...(t.comments || []), payload], activity: (t.activity || 0) + 2 };
            }
            return t;
        }));

        const comment = {
            text: commentData.text,
            author: user.id,
            createdAt: new Date().toISOString()
        };

        const dbPayload = mapCommentToDB(comment, threadId);
        const { error } = await supabase.from('comments').insert(dbPayload);
        if (error) {
            console.error('Error adding comment:', error);
            showError('Failed to add comment. Please try again.');
        }
    };

    const handleReaction = async (threadId: string, emoji: string) => {
        if (!user) return;

        setThreads(prev => prev.map(t => {
            if (t.id === threadId) {
                const current = t.reactions || {};
                return {
                    ...t,
                    reactions: { ...current, [emoji]: (current[emoji] || 0) + 1 },
                    activity: (t.activity || 0) + 1
                };
            }
            return t;
        }));

        const { error } = await supabase.from('reactions').insert({
            thread_id: threadId,
            author_id: user.id,
            emoji: emoji
        });
        if (error) {
            console.error('Error adding reaction:', error);
            showError('Failed to add reaction');
        }
    };

    const createEntity = async (type: 'card' | 'zone', x: number, y: number) => {
        if (!user) return;
        try {
            const data: Thread = {
                id: crypto.randomUUID(),
                type: type,
                x: x,
                y: y,
                author: user.id,
                authorName: userName,
                createdAt: new Date().toISOString(),
                playgroundId: currentPlaygroundId,
                title: type === 'zone' ? 'NEW ZONE' : '',
                content: '',
                sentiment: 'neutral',
                width: type === 'zone' ? 400 : undefined,
                height: type === 'zone' ? 400 : undefined,
                color: 'slate',
                locked: false,
                likes: 0,
                reactions: {},
                activity: 0,
                tags: [],
                comments: [],
                imageUrl: null,
                ticker: null
            };

            setThreads(prev => [...prev, data]);

            const dbPayload = mapThreadToDB(data, currentPlaygroundId, user.id);
            
            try {
                const res = await fetch('/api/threads', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {})
                    },
                    body: JSON.stringify({
                        userId: user.id,
                        playgroundId: currentPlaygroundId,
                        thread: dbPayload
                    })
                });
                if (!res.ok) {
                    const errorData = await res.json();
                    console.error('Server error details:', errorData);
                    throw new Error(errorData.details || errorData.error || 'Failed to create');
                }
            } catch (error) {
                console.error('Error creating entity:', error);
                showError('Failed to create item. Please try again.');
            }
        } catch (e) { 
            console.error("Error creating entity", e);
            showError('An unexpected error occurred');
        }
    };

    const handleQuickSpawn = async (sourceId: string, direction: 'top' | 'bottom' | 'left' | 'right') => {
        if (!user) return;
        const source = threads.find(t => t.id === sourceId);
        if (!source) return;

        const SPACING = 350;
        let newX = source.x;
        let newY = source.y;

        if (direction === 'right') newX += SPACING;
        if (direction === 'left') newX -= SPACING;
        if (direction === 'bottom') newY += SPACING / 1.5;
        if (direction === 'top') newY -= SPACING / 1.5;

        const newCard: Thread = {
            id: crypto.randomUUID(),
            type: 'card',
            title: '',
            content: '',
            x: newX,
            y: newY,
            author: user.id,
            authorName: userName,
            createdAt: new Date().toISOString(),
            sentiment: source.sentiment,
            isNewSpawn: true,
            connectedTo: [sourceId],
            playgroundId: currentPlaygroundId
        };
        setThreads(prev => [...prev, newCard]);
        
        const dbPayload = mapThreadToDB(newCard, currentPlaygroundId, user.id);
        
        try {
            const res = await fetch('/api/threads', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {})
                },
                body: JSON.stringify({
                    userId: user.id,
                    playgroundId: currentPlaygroundId,
                    thread: dbPayload
                })
            });
            if (!res.ok) {
                const errorData = await res.json();
                console.error('Server error details:', errorData);
                throw new Error(errorData.details || errorData.error || 'Failed to create');
            }
        } catch (error) {
            console.error('Error spawning thread:', error);
            showError('Failed to create connected card');
        }
        
        return newCard.id;
    };

    return {
        threads,
        setThreads,
        updateThread,
        addComment,
        handleReaction,
        createEntity,
        handleQuickSpawn
    };
}
