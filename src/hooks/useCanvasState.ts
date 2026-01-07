import { useState, useRef, useCallback, RefObject } from 'react';
import { ViewState, Thread } from '@/lib/types';
import { GRID_SIZE } from '@/lib/constants';

interface UseCanvasStateProps {
    snapToGrid: boolean;
    updateThread: (id: string, data: Partial<Thread>) => void;
    visibleThreads: Thread[];
}

interface CanvasStateReturn {
    // View state
    viewState: ViewState;
    setViewState: React.Dispatch<React.SetStateAction<ViewState>>;
    
    // Canvas drag state
    isDraggingCanvas: boolean;
    setIsDraggingCanvas: React.Dispatch<React.SetStateAction<boolean>>;
    
    // Card drag state
    activeCardId: string | null;
    setActiveCardId: React.Dispatch<React.SetStateAction<string | null>>;
    dragOffset: { x: number; y: number };
    setDragOffset: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
    localPositions: Record<string, { x: number; y: number }>;
    setLocalPositions: React.Dispatch<React.SetStateAction<Record<string, { x: number; y: number }>>>;
    
    // Resize state
    resizeId: string | null;
    setResizeId: React.Dispatch<React.SetStateAction<string | null>>;
    localDimensions: { width: number; height: number };
    setLocalDimensions: React.Dispatch<React.SetStateAction<{ width: number; height: number }>>;
    resizeInitial: RefObject<{ w: number; h: number }>;
    
    // Handlers
    handleDragStart: (e: React.MouseEvent | React.TouchEvent, id: string, selectedIds: Set<string>) => void;
    handleResizeStart: (e: React.MouseEvent | React.TouchEvent, id: string) => void;
    handleCanvasDrag: (e: React.MouseEvent) => void;
    handleCardDrag: (e: React.MouseEvent) => void;
    handleResize: (e: React.MouseEvent) => void;
    handleDragEnd: () => void;
    handleWheel: (e: React.WheelEvent) => void;
    navigateToThread: (thread: Thread) => void;
}

export function useCanvasState({
    snapToGrid,
    updateThread,
    visibleThreads,
}: UseCanvasStateProps): CanvasStateReturn {
    // View state
    const [viewState, setViewState] = useState<ViewState>({ x: 0, y: 0, zoom: 1 });
    
    // Canvas drag state
    const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
    
    // Card drag state
    const [activeCardId, setActiveCardId] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [localPositions, setLocalPositions] = useState<Record<string, { x: number; y: number }>>({});
    
    // Resize state
    const [resizeId, setResizeId] = useState<string | null>(null);
    const [localDimensions, setLocalDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
    const resizeInitial = useRef({ w: 0, h: 0 });

    const handleDragStart = useCallback((
        e: React.MouseEvent | React.TouchEvent,
        id: string,
        selectedIds: Set<string>
    ) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

        setActiveCardId(id);
        setDragOffset({ x: clientX, y: clientY });

        if (selectedIds.has(id)) {
            const initialPositions: Record<string, { x: number; y: number }> = {};
            selectedIds.forEach(selectedId => {
                const thread = visibleThreads.find(t => t.id === selectedId);
                if (thread) {
                    initialPositions[selectedId] = { x: thread.x, y: thread.y };
                }
            });
            setLocalPositions(initialPositions);
        } else {
            const thread = visibleThreads.find(t => t.id === id);
            if (thread) {
                setLocalPositions({ [id]: { x: thread.x, y: thread.y } });
            }
        }
    }, [visibleThreads]);

    const handleResizeStart = useCallback((e: React.MouseEvent | React.TouchEvent, id: string) => {
        e.stopPropagation();
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

        setResizeId(id);
        setDragOffset({ x: clientX, y: clientY });
        const thread = visibleThreads.find(t => t.id === id);
        if (thread) {
            resizeInitial.current = { w: thread.width || 300, h: thread.height || 300 };
            setLocalDimensions({ width: thread.width || 300, height: thread.height || 300 });
        }
    }, [visibleThreads]);

    const handleCanvasDrag = useCallback((e: React.MouseEvent) => {
        if (!isDraggingCanvas) return;
        
        const dx = e.clientX - dragOffset.x;
        const dy = e.clientY - dragOffset.y;
        setViewState(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
        setDragOffset({ x: e.clientX, y: e.clientY });
    }, [isDraggingCanvas, dragOffset]);

    const handleCardDrag = useCallback((e: React.MouseEvent) => {
        if (!activeCardId) return;
        
        const dx = (e.clientX - dragOffset.x) / viewState.zoom;
        const dy = (e.clientY - dragOffset.y) / viewState.zoom;

        setLocalPositions(prev => {
            const next = { ...prev };
            // Using hasOwnProperty as defense against prototype pollution
            Object.keys(next).forEach(id => {
                if (Object.prototype.hasOwnProperty.call(next, id)) {
                    const current = next[id];
                    if (current) {
                        const rawX = current.x + dx;
                        const rawY = current.y + dy;
                        next[id] = { x: rawX, y: rawY };
                    }
                }
            });
            return next;
        });
        setDragOffset({ x: e.clientX, y: e.clientY });
    }, [activeCardId, dragOffset, viewState.zoom]);

    const handleResize = useCallback((e: React.MouseEvent) => {
        if (!resizeId) return;
        
        const totalDx = (e.clientX - dragOffset.x) / viewState.zoom;
        const totalDy = (e.clientY - dragOffset.y) / viewState.zoom;

        let newW = resizeInitial.current.w + totalDx;
        let newH = resizeInitial.current.h + totalDy;

        if (snapToGrid) {
            newW = Math.round(newW / GRID_SIZE) * GRID_SIZE;
            newH = Math.round(newH / GRID_SIZE) * GRID_SIZE;
        }

        setLocalDimensions({ width: Math.max(200, newW), height: Math.max(200, newH) });
    }, [resizeId, dragOffset, viewState.zoom, snapToGrid]);

    const handleDragEnd = useCallback(() => {
        if (activeCardId) {
            Object.entries(localPositions).forEach(([id, pos]) => {
                let { x, y } = pos;
                if (snapToGrid) {
                    x = Math.round(x / GRID_SIZE) * GRID_SIZE;
                    y = Math.round(y / GRID_SIZE) * GRID_SIZE;
                }
                updateThread(id, { x, y });
            });
        }

        if (resizeId) {
            updateThread(resizeId, localDimensions);
        }

        setIsDraggingCanvas(false);
        setActiveCardId(null);
        setResizeId(null);
        setLocalPositions({});
    }, [activeCardId, resizeId, localPositions, localDimensions, snapToGrid, updateThread]);

    const handleWheel = useCallback((e: React.WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const zoomSensitivity = 0.001;
            const delta = -e.deltaY * zoomSensitivity;
            const newZoom = Math.min(Math.max(0.1, viewState.zoom + delta), 4);
            setViewState(prev => ({ ...prev, zoom: newZoom }));
        } else {
            setViewState(prev => ({ ...prev, x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
        }
    }, [viewState.zoom]);

    const navigateToThread = useCallback((thread: Thread) => {
        const targetX = -thread.x * viewState.zoom + (window.innerWidth / 2) - (144 * viewState.zoom);
        const targetY = -thread.y * viewState.zoom + (window.innerHeight / 2) - (100 * viewState.zoom);
        setViewState(prev => ({ ...prev, x: targetX, y: targetY }));
    }, [viewState.zoom]);

    return {
        viewState,
        setViewState,
        isDraggingCanvas,
        setIsDraggingCanvas,
        activeCardId,
        setActiveCardId,
        dragOffset,
        setDragOffset,
        localPositions,
        setLocalPositions,
        resizeId,
        setResizeId,
        localDimensions,
        setLocalDimensions,
        resizeInitial,
        handleDragStart,
        handleResizeStart,
        handleCanvasDrag,
        handleCardDrag,
        handleResize,
        handleDragEnd,
        handleWheel,
        navigateToThread,
    };
}
