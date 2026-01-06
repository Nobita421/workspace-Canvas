import { useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { Thread } from '@/lib/types';
import { mapThreadToDB } from '@/lib/utils';

interface UseKeyboardShortcutsProps {
    user: User | null;
    threads: Thread[];
    selectedIds: Set<string>;
    currentPlaygroundId: string;
    setThreads: React.Dispatch<React.SetStateAction<Thread[]>>;
    setSelectedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
    setConnectSourceId: React.Dispatch<React.SetStateAction<string | null>>;
    setContextMenu: React.Dispatch<React.SetStateAction<{ x: number; y: number; canvasX: number; canvasY: number } | null>>;
    setShowProfile: React.Dispatch<React.SetStateAction<boolean>>;
    setShowNotifications: React.Dispatch<React.SetStateAction<boolean>>;
    setIsHistoryOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPlaygroundMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onError?: (message: string) => void;
}

interface KeyboardShortcutsReturn {
    duplicateSelected: () => void;
    deleteSelected: () => void;
    escapeAction: () => void;
}

export function useKeyboardShortcuts({
    user,
    threads,
    selectedIds,
    currentPlaygroundId,
    setThreads,
    setSelectedIds,
    setConnectSourceId,
    setContextMenu,
    setShowProfile,
    setShowNotifications,
    setIsHistoryOpen,
    setIsPlaygroundMenuOpen,
    onError,
}: UseKeyboardShortcutsProps): KeyboardShortcutsReturn {
    
    const duplicateSelected = useCallback(() => {
        if (selectedIds.size === 0 || !user) return;
        
        const newThreads: Thread[] = [];
        selectedIds.forEach(id => {
            const t = threads.find(x => x.id === id);
            if (t) {
                const newDoc: Thread = {
                    ...t,
                    id: crypto.randomUUID(),
                    x: t.x + 20,
                    y: t.y + 20,
                    createdAt: new Date().toISOString(),
                    playgroundId: currentPlaygroundId
                };
                newThreads.push(newDoc);
                
                // Supabase insert
                const dbPayload = mapThreadToDB(newDoc, currentPlaygroundId, user.id);
                
                fetch('/api/threads', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user.id,
                        playgroundId: currentPlaygroundId,
                        thread: dbPayload
                    })
                }).then(res => {
                    if (!res.ok) throw new Error('Failed');
                }).catch(err => {
                    console.error('Error duplicating thread:', err);
                    onError?.('Failed to duplicate item');
                });
            }
        });
        setThreads(prev => [...prev, ...newThreads]);
    }, [selectedIds, threads, user, currentPlaygroundId, setThreads, onError]);

    const deleteSelected = useCallback(() => {
        if (selectedIds.size === 0 || !user) return;
        
        const idsToDelete = Array.from(selectedIds);
        setThreads(prev => prev.filter(t => !selectedIds.has(t.id) || t.locked));
        setSelectedIds(new Set());

        // Supabase delete
        Promise.all(idsToDelete.map(id => 
            fetch(`/api/threads?threadId=${id}&userId=${user.id}&playgroundId=${currentPlaygroundId}`, {
                method: 'DELETE'
            })
        )).then(results => {
            if (results.some(r => !r.ok)) throw new Error('Some deletes failed');
        }).catch(err => {
            console.error('Error deleting threads:', err);
            onError?.('Failed to delete items');
        });
    }, [selectedIds, setThreads, setSelectedIds, onError, user, currentPlaygroundId]);

    const escapeAction = useCallback(() => {
        setSelectedIds(new Set());
        setConnectSourceId(null);
        setContextMenu(null);
        setShowProfile(false);
        setShowNotifications(false);
        setIsHistoryOpen(false);
        setIsPlaygroundMenuOpen(false);
    }, [
        setSelectedIds,
        setConnectSourceId,
        setContextMenu,
        setShowProfile,
        setShowNotifications,
        setIsHistoryOpen,
        setIsPlaygroundMenuOpen
    ]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if user is typing in an input
            const activeElement = document.activeElement as HTMLElement;
            const tagName = activeElement?.tagName;
            if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
                return;
            }

            // Ctrl/Cmd + D: Duplicate
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                duplicateSelected();
                return;
            }

            // Delete: Remove selected
            if (e.key === 'Delete' && selectedIds.size > 0) {
                deleteSelected();
                return;
            }

            // Escape: Clear selection and close modals
            if (e.key === 'Escape') {
                escapeAction();
                return;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIds, duplicateSelected, deleteSelected, escapeAction]);

    return {
        duplicateSelected,
        deleteSelected,
        escapeAction,
    };
}
