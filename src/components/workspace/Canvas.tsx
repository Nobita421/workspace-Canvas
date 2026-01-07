'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MousePointer2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { GRID_SIZE } from '@/lib/constants';
import { Thread } from '@/lib/types';
import { Background } from './Background';
import { ConnectionLines } from './ConnectionLines';
import { Zone } from '@/components/entities/Zone';
import { Card } from '@/components/entities/Card';
import { Toolbar } from '@/components/ui/Toolbar';
import { Sidebar } from '@/components/ui/Sidebar';
import { Profile } from '@/components/ui/Profile';
import { Notifications } from '@/components/ui/Notifications';
import { ContextMenu } from '@/components/ui/ContextMenu';
import { LaserPointer } from '@/components/ui/LaserPointer';
import { PlaygroundManager } from '@/components/ui/PlaygroundManager';
import { AuthModal } from '@/components/ui/AuthModal';
import { useRealtime } from '@/hooks/useRealtime';
import { useCanvasState } from '@/hooks/useCanvasState';
import { useSelectionBox } from '@/hooks/useSelectionBox';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useThreadData } from '@/hooks/useThreadData';
import { useWindowSize } from '@/hooks/useWindowSize';
import { useVirtualization } from '@/hooks/useVirtualization';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

// New Components
import { CanvasControls } from './CanvasControls';
import { CanvasUserMenu } from './CanvasUserMenu';
import { SelectionMenu } from './SelectionMenu';

export default function Canvas() {
    // Auth from context
    const { user, loading: authLoading, signOut } = useAuth();
    const { showSuccess, showError } = useToast();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [userName, setUserName] = useState('Trader');
    
    // UI State
    const [snapToGrid, setSnapToGrid] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sentimentFilter, setSentimentFilter] = useState<string | null>(null);
    const [darkMode, setDarkMode] = useState(false);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; canvasX: number; canvasY: number } | null>(null);
    const [presentationMode, setPresentationMode] = useState(false);
    const [searchMatchIndex, setSearchMatchIndex] = useState(0);
    const [showProfile, setShowProfile] = useState(false);
    const [focusMode, setFocusMode] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [historyIds, setHistoryIds] = useState<string[]>([]);
    const [connectSourceId, setConnectSourceId] = useState<string | null>(null);

    // Playground State
    interface Playground {
        id: string;
        name: string;
    }
    const [playgrounds, setPlaygrounds] = useState<Playground[]>([]);
    const [currentPlaygroundId, setCurrentPlaygroundId] = useState('default');
    const [isPlaygroundMenuOpen, setIsPlaygroundMenuOpen] = useState(false);

    // Thread Data Hook
    const {
        threads,
        setThreads,
        updateThread,
        addComment,
        handleReaction,
        createEntity: createEntityData,
        handleQuickSpawn: handleQuickSpawnData
    } = useThreadData({
        user,
        userName,
        currentPlaygroundId,
        showError,
        showSuccess
    });

    const windowSize = useWindowSize();

    const canvasRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Computed: Visible threads for current playground
    const visibleThreads = useMemo(() => {
        return threads.filter(t => {
            if (currentPlaygroundId === 'default') {
                return !t.playgroundId || t.playgroundId === 'default';
            }
            return t.playgroundId === currentPlaygroundId;
        });
    }, [threads, currentPlaygroundId]);

    // Custom Hooks
    const {
        viewState,
        setViewState,
        isDraggingCanvas,
        setIsDraggingCanvas,
        activeCardId,
        setDragOffset,
        localPositions,
        resizeId,
        localDimensions,
        handleDragStart: canvasDragStart,
        handleResizeStart,
        handleCanvasDrag,
        handleCardDrag,
        handleResize,
        handleDragEnd,
        navigateToThread,
    } = useCanvasState({
        snapToGrid,
        updateThread,
        visibleThreads,
    });

    const {
        selectedIds,
        setSelectedIds,
        selectionBox,
        toggleSelection,
        clearSelection,
        startSelectionBox,
        updateSelectionBox,
        endSelectionBox,
        getSelectionBoxStyle,
    } = useSelectionBox({
        visibleThreads,
        viewState,
    });

    useKeyboardShortcuts({
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
        onError: showError,
    });

    // Realtime Hook
    const { cursors, onlineUsers, broadcastCursor } = useRealtime(currentPlaygroundId, user, userName);

    // Attach wheel event with { passive: false } to allow preventDefault for zoom
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const wheelHandler = (e: WheelEvent) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const zoomSensitivity = 0.001;
                const delta = -e.deltaY * zoomSensitivity;
                setViewState(prev => {
                    const newZoom = Math.min(Math.max(0.1, prev.zoom + delta), 4);
                    return { ...prev, zoom: newZoom };
                });
            } else {
                setViewState(prev => ({ ...prev, x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
            }
        };

        container.addEventListener('wheel', wheelHandler, { passive: false });
        return () => { container.removeEventListener('wheel', wheelHandler); };
    }, [setViewState]);

    // Load saved username when user changes
    useEffect(() => {
        if (user) {
            const savedName = localStorage.getItem(`user_name_${user.id}`);
            if (savedName) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setUserName(savedName);
            } else {
                // Use display name from auth metadata or generate one
                const displayName = user.user_metadata?.display_name || 
                                   user.email?.split('@')[0] || 
                                   `Trader ${user.id.slice(0, 4)}`;
                 
                setUserName(displayName);
            }
        }
    }, [user]);

    // Fetch Playgrounds
    useEffect(() => {
        if (!user) return;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPlaygrounds([{ id: 'default', name: 'Main Playground' }]);
    }, [user]);

    // Handlers
    const handleCreatePlayground = async (name: string) => {
        const newId = crypto.randomUUID();
        setPlaygrounds(prev => [...prev, { id: newId, name }]);
        setCurrentPlaygroundId(newId);
        showSuccess(`Created "${name}"`);
    };

    const handleSaveProfile = (newName: string) => {
        if (!user) return;
        setUserName(newName);
        localStorage.setItem(`user_name_${user.id}`, newName);
        showSuccess("Profile updated!");
    };

    // Notifications
    interface Notification {
        type: string;
        message: string;
        time: string;
    }
    const notifications = useMemo(() => {
        if (!user) return [];
        const myThreads = threads.filter(t => t.author === user.id);
        const notifs: Notification[] = [];

        myThreads.forEach(t => {
            if (t.comments && t.comments.length > 0) {
                const lastComment = t.comments[t.comments.length - 1];
                if (lastComment.author !== user.id) {
                    notifs.push({
                        type: 'New Comment',
                        message: `Someone commented on "${t.title || 'Untitled'}": ${lastComment.text.slice(0, 20)}...`,
                        time: new Date(lastComment.createdAt).toLocaleTimeString()
                    });
                }
            }
            if (t.likes && t.likes > 0) {
                notifs.push({
                    type: 'New Likes',
                    message: `"${t.title || 'Untitled'}" has ${t.likes} likes.`,
                    time: 'Recent'
                });
            }
        });
        return notifs.slice(0, 10);
    }, [threads, user]);

    // Search
    const matchingThreads = useMemo(() => {
        if (!searchQuery) return [];
        const lower = searchQuery.toLowerCase();
        return visibleThreads.filter(t =>
            t.title?.toLowerCase().includes(lower) ||
            t.content?.toLowerCase().includes(lower) ||
            t.tags?.some(tag => tag.toLowerCase().includes(lower))
        );
    }, [visibleThreads, searchQuery]);

    const handleSearchKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && matchingThreads.length > 0) {
            const nextIndex = (searchMatchIndex + 1) % matchingThreads.length;
            setSearchMatchIndex(nextIndex);
            const target = matchingThreads[nextIndex];
            navigateToThread(target);
        }
    };

    const handleQuickSpawn = async (sourceId: string, direction: 'top' | 'bottom' | 'left' | 'right') => {
        const newId = await handleQuickSpawnData(sourceId, direction);
        if (newId) {
            setHistoryIds(prev => [newId, ...prev].slice(0, 50));
        }
    };

    const handleAutoLayout = () => {
        if (selectedIds.size < 2) return;
        const selectedThreads = visibleThreads.filter(t => selectedIds.has(t.id) && !t.locked);
        if (selectedThreads.length === 0) return;

        selectedThreads.sort((a, b) => (a.y - b.y) || (a.x - b.x));

        const cols = Math.ceil(Math.sqrt(selectedThreads.length));
        const startX = Math.min(...selectedThreads.map(t => t.x));
        const startY = Math.min(...selectedThreads.map(t => t.y));
        const cardW = 320;
        const cardH = 300;

        selectedThreads.forEach((t, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            updateThread(t.id, {
                x: startX + (col * cardW),
                y: startY + (row * cardH)
            });
        });
    };

    const handleShare = async (cardId: string) => {
        const mockUrl = `https://financeflow.app/t/${cardId}`;
        try {
            await navigator.clipboard.writeText(mockUrl);
            showSuccess("Link copied to clipboard!");
        } catch (e) { 
            console.error("Copy failed", e);
            showError("Failed to copy link");
        }
    };

    const createEntity = async (type: 'card' | 'zone', x?: number, y?: number) => {
        const finalX = x || -viewState.x + (window.innerWidth / 2) - 144;
        const finalY = y || -viewState.y + (window.innerHeight / 2) - 100;
        await createEntityData(type, finalX, finalY);
    };

    const updateSelectedThreads = (data: Partial<Thread>) => {
        selectedIds.forEach(id => updateThread(id, data));
    };

    const alignSelection = (mode: 'horizontal' | 'vertical') => {
        if (selectedIds.size < 2) return;
        const selectedThreads = visibleThreads.filter(t => selectedIds.has(t.id) && !t.locked);
        if (selectedThreads.length === 0) return;

        if (mode === 'horizontal') {
            const minX = Math.min(...selectedThreads.map(t => t.x));
            selectedThreads.forEach(t => updateThread(t.id, { x: minX }));
        } else { // mode === 'vertical'
            const minY = Math.min(...selectedThreads.map(t => t.y));
            selectedThreads.forEach(t => updateThread(t.id, { y: minY }));
        }
        setSelectedIds(new Set());
    };

    // Wrap drag start to pass selectedIds
    const handleDragStart = (e: React.MouseEvent | React.TouchEvent, id: string) => {
        canvasDragStart(e, id, selectedIds);
    };

    const handleCanvasMouseDown = (e: React.MouseEvent) => {
        if (contextMenu) setContextMenu(null);
        if (showProfile) setShowProfile(false);
        if (showNotifications) setShowNotifications(false);
        if (isPlaygroundMenuOpen) setIsPlaygroundMenuOpen(false);

        if (e.button === 2) {
            e.preventDefault();
            const rect = canvasRef.current?.getBoundingClientRect();
            if (rect) {
                setContextMenu({
                    x: e.clientX, y: e.clientY,
                    canvasX: (e.clientX - rect.left - viewState.x) / viewState.zoom,
                    canvasY: (e.clientY - rect.top - viewState.y) / viewState.zoom
                });
            }
            return;
        }

        if (e.target === canvasRef.current) {
            if (e.shiftKey) {
                startSelectionBox(e, canvasRef);
            } else {
                setIsDraggingCanvas(true);
                setDragOffset({ x: e.clientX, y: e.clientY });
                clearSelection();
            }
        }
    };

    const handleGlobalMouseMove = (e: React.MouseEvent) => {
        // Broadcast cursor position
        if (user) {
            const rect = canvasRef.current?.getBoundingClientRect();
            if (rect) {
                const x = (e.clientX - rect.left - viewState.x) / viewState.zoom;
                const y = (e.clientY - rect.top - viewState.y) / viewState.zoom;
                broadcastCursor(x, y);
            }
        }

        handleCanvasDrag(e);
        
        if (selectionBox && canvasRef.current) {
            updateSelectionBox(e, canvasRef);
        }
        
        handleCardDrag(e);
        handleResize(e);
    };

    const handleGlobalMouseUp = () => {
        endSelectionBox();
        handleDragEnd();
    };

    const handleConnect = async (targetId: string) => {
        if (connectSourceId && connectSourceId !== targetId) {
            const source = visibleThreads.find(t => t.id === connectSourceId);
            if (source) {
                let newConnections = source.connectedTo || [];
                if (!Array.isArray(newConnections)) newConnections = [newConnections as unknown as string];

                if (!newConnections.includes(targetId)) {
                    newConnections.push(targetId);
                    updateThread(connectSourceId, { connectedTo: newConnections });

                    const { error } = await supabase.from('connections').insert({
                        canvas_id: currentPlaygroundId,
                        source_id: connectSourceId,
                        target_id: targetId
                    });
                    if (error) {
                        console.error('Error connecting:', error);
                        showError('Failed to create connection');
                    }
                }
            }
            setConnectSourceId(null);
        } else {
            setConnectSourceId(targetId);
        }
    };

    const handleHistoryNavigate = (item: Thread) => {
        navigateToThread(item);
        setSelectedIds(new Set([item.id]));
    };

    // Rendered threads with local positions applied
    const renderThreads = useMemo(() => {
        return visibleThreads.map(t => {
            const merged = { ...t };
            if (localPositions[t.id]) {
                if (snapToGrid && activeCardId) {
                    merged.x = Math.round(localPositions[t.id].x / GRID_SIZE) * GRID_SIZE;
                    merged.y = Math.round(localPositions[t.id].y / GRID_SIZE) * GRID_SIZE;
                } else {
                    merged.x = localPositions[t.id].x;
                    merged.y = localPositions[t.id].y;
                }
            }
            if (t.id === resizeId) {
                merged.width = localDimensions.width;
                merged.height = localDimensions.height;
            }
            return merged;
        });
    }, [visibleThreads, localPositions, snapToGrid, activeCardId, resizeId, localDimensions]);

    // Virtualization
    const virtualizedThreads = useVirtualization(renderThreads, viewState, windowSize);

    const isDimmed = (thread: Thread) => {
        if (focusMode && thread.author !== user?.id) return true;
        if (thread.type === 'zone') return false;
        if (sentimentFilter && thread.sentiment !== sentimentFilter) return true;
        if (searchQuery.length > 0) {
            const lowerQ = searchQuery.toLowerCase();
            const matchTitle = thread.title?.toLowerCase().includes(lowerQ);
            const matchContent = thread.content?.toLowerCase().includes(lowerQ);
            const matchTag = thread.tags?.some(tag => tag.toLowerCase().includes(lowerQ));
            if (!matchTitle && !matchContent && !matchTag) return true;
        }
        return false;
    };

    const dimMode = !!(sentimentFilter || searchQuery.length > 0 || focusMode);
    const zones = virtualizedThreads.filter(t => t.type === 'zone');
    const cards = virtualizedThreads.filter(t => t.type !== 'zone');
    const currentPlaygroundName = playgrounds.find(p => p.id === currentPlaygroundId)?.name || 'Main Playground';
    const selectionBoxStyle = getSelectionBoxStyle();

    // Show loading state while checking auth
    if (authLoading) {
        return (
            <div className={`w-full h-screen flex items-center justify-center ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
                <div className="flex flex-col items-center gap-4">
                    <div className="p-3 bg-indigo-500 rounded-xl text-white animate-pulse">
                        <MousePointer2 size={32} />
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Loading workspace...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className={`w-full h-screen overflow-hidden font-sans relative select-none transition-colors duration-500 ${darkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'}`}
            onMouseMove={handleGlobalMouseMove}
            onMouseUp={handleGlobalMouseUp}
            onContextMenu={(e) => { e.preventDefault(); }}
        >
            <style>{`
            .animate-pulse-slow { animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
            @keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.1; } }
            .animate-dash { stroke-dasharray: 10; animation: dash 60s linear infinite; }
            @keyframes dash { to { stroke-dashoffset: 1000; } }
            `}</style>

            {presentationMode && <LaserPointer viewState={viewState} />}

            {showProfile && user && (
                <Profile
                    user={user}
                    threads={threads}
                    onClose={() => { setShowProfile(false); }}
                    darkMode={darkMode}
                    userName={userName}
                    setUserName={setUserName}
                    saveProfile={handleSaveProfile}
                />
            )}

            {showNotifications && (
                <Notifications notifications={notifications} onClose={() => { setShowNotifications(false); }} darkMode={darkMode} />
            )}

            {isHistoryOpen && (
                <Sidebar
                    historyIds={historyIds}
                    threads={visibleThreads}
                    darkMode={darkMode}
                    onClose={() => { setIsHistoryOpen(false); }}
                    onNavigate={handleHistoryNavigate}
                    onClear={() => { setHistoryIds([]); }}
                />
            )}

            {isPlaygroundMenuOpen && (
                <PlaygroundManager
                    playgrounds={playgrounds}
                    currentId={currentPlaygroundId}
                    onSelect={(id) => { setCurrentPlaygroundId(id); }}
                    onCreate={handleCreatePlayground}
                    darkMode={darkMode}
                    onClose={() => { setIsPlaygroundMenuOpen(false); }}
                />
            )}

            {/* Auth Modal */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => { setShowAuthModal(false); }}
                darkMode={darkMode}
            />

            {/* Remote Cursors */}
            <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden" style={{ transform: `translate(${viewState.x}px, ${viewState.y}px) scale(${viewState.zoom})` }}>
                {Object.values(cursors).map(cursor => (
                    <div
                        key={cursor.userId}
                        className="absolute flex flex-col items-start transition-all duration-100 ease-linear"
                        style={{ left: cursor.x, top: cursor.y }}
                    >
                        <MousePointer2
                            size={16}
                            className="text-white drop-shadow-md"
                            fill={cursor.color}
                            color={cursor.color}
                        />
                        <span
                            className="ml-4 -mt-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white shadow-sm whitespace-nowrap"
                            style={{ backgroundColor: cursor.color }}
                        >
                            {cursor.userName}
                        </span>
                    </div>
                ))}
            </div>

            <Background offset={viewState} showGrid={snapToGrid} darkMode={darkMode} />

            <div
                ref={canvasRef}
                className="absolute inset-0 cursor-default origin-center"
                onMouseDown={handleCanvasMouseDown}
                style={{
                    transform: `translate(${viewState.x}px, ${viewState.y}px) scale(${viewState.zoom})`,
                    transition: isDraggingCanvas || activeCardId || resizeId ? 'none' : 'transform 0.1s ease-out'
                }}
            >
                <ConnectionLines threads={renderThreads} zoom={viewState.zoom} dimMode={dimMode} darkMode={darkMode} updateThread={updateThread} />

                {zones.map(zone => (
                    <Zone
                        key={zone.id}
                        data={zone}
                        onDragStart={handleDragStart}
                        onResizeStart={handleResizeStart}
                        isDragging={selectedIds.has(zone.id) && activeCardId !== null}
                        isSelected={selectedIds.has(zone.id)}
                        updateThread={updateThread}
                        darkMode={darkMode}
                        toggleSelection={toggleSelection}
                    />
                ))}

                {cards.map(thread => (
                    <Card
                        key={thread.id}
                        data={thread}
                        onDragStart={handleDragStart}
                        isDragging={selectedIds.has(thread.id) && activeCardId !== null}
                        isSelected={selectedIds.has(thread.id)}
                        toggleSelection={toggleSelection}
                        updateThread={updateThread}
                        user={user}
                        connectMode={connectSourceId === thread.id}
                        setConnectMode={(id) => handleConnect(id)}
                        addComment={addComment}
                        isDimmed={isDimmed(thread)}
                        darkMode={darkMode}
                        onQuickSpawn={handleQuickSpawn}
                        onShare={handleShare}
                        creatorName={thread.authorName}
                        onReact={handleReaction}
                    />
                ))}

                {selectionBoxStyle && (
                    <div
                        className="absolute border-2 border-indigo-500 bg-indigo-500/10 pointer-events-none z-50"
                        style={selectionBoxStyle}
                    />
                )}
            </div>

            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    canvasX={contextMenu.canvasX}
                    canvasY={contextMenu.canvasY}
                    darkMode={darkMode}
                    createEntity={createEntity}
                    onClose={() => { setContextMenu(null); }}
                />
            )}

            {/* Selection Menu */}
            {!presentationMode && (
                <SelectionMenu
                    selectedIds={selectedIds}
                    handleAutoLayout={handleAutoLayout}
                    updateSelectedThreads={updateSelectedThreads}
                    alignSelection={alignSelection}
                    darkMode={darkMode}
                />
            )}

            {/* Left Controls */}
            {!presentationMode && (
                <CanvasControls
                    isHistoryOpen={isHistoryOpen}
                    setIsHistoryOpen={setIsHistoryOpen}
                    setIsPlaygroundMenuOpen={setIsPlaygroundMenuOpen}
                    currentPlaygroundName={currentPlaygroundName}
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                    snapToGrid={snapToGrid}
                    setSnapToGrid={setSnapToGrid}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    setSearchMatchIndex={setSearchMatchIndex}
                    handleSearchKeyDown={handleSearchKeyDown}
                    matchingThreads={matchingThreads}
                    searchMatchIndex={searchMatchIndex}
                    sentimentFilter={sentimentFilter}
                    setSentimentFilter={setSentimentFilter}
                    visibleThreads={visibleThreads}
                    selectedIds={selectedIds}
                    connectSourceId={connectSourceId}
                    setConnectSourceId={setConnectSourceId}
                />
            )}

            {/* Right Controls (User Menu) */}
            {!presentationMode && (
                <CanvasUserMenu
                    user={user}
                    userName={userName}
                    focusMode={focusMode}
                    setFocusMode={setFocusMode}
                    showNotifications={showNotifications}
                    setShowNotifications={setShowNotifications}
                    notifications={notifications}
                    setShowProfile={setShowProfile}
                    signOut={signOut}
                    onlineUsers={onlineUsers}
                    setShowAuthModal={setShowAuthModal}
                    darkMode={darkMode}
                />
            )}

            <Toolbar
                viewState={viewState}
                setViewState={setViewState}
                presentationMode={presentationMode}
                setPresentationMode={setPresentationMode}
                createEntity={createEntity}
                darkMode={darkMode}
            />
        </div>
    );
}
