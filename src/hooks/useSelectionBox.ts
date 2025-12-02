import { useState, useCallback } from 'react';
import { Thread, ViewState } from '@/lib/types';

interface SelectionBox {
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
}

interface UseSelectionBoxProps {
    visibleThreads: Thread[];
    viewState: ViewState;
}

interface SelectionBoxReturn {
    // Selection state
    selectedIds: Set<string>;
    setSelectedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
    selectionBox: SelectionBox | null;
    setSelectionBox: React.Dispatch<React.SetStateAction<SelectionBox | null>>;
    
    // Handlers
    toggleSelection: (id: string) => void;
    clearSelection: () => void;
    selectAll: (ids: string[]) => void;
    startSelectionBox: (e: React.MouseEvent, canvasRef: React.RefObject<HTMLDivElement | null>) => void;
    updateSelectionBox: (e: React.MouseEvent, canvasRef: React.RefObject<HTMLDivElement | null>) => void;
    endSelectionBox: () => void;
    getSelectionBoxStyle: () => React.CSSProperties | null;
}

export function useSelectionBox({
    visibleThreads,
    viewState,
}: UseSelectionBoxProps): SelectionBoxReturn {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);

    const toggleSelection = useCallback((id: string) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedIds(new Set());
    }, []);

    const selectAll = useCallback((ids: string[]) => {
        setSelectedIds(new Set(ids));
    }, []);

    const startSelectionBox = useCallback((
        e: React.MouseEvent,
        canvasRef: React.RefObject<HTMLDivElement | null>
    ) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
            const x = (e.clientX - rect.left - viewState.x) / viewState.zoom;
            const y = (e.clientY - rect.top - viewState.y) / viewState.zoom;
            setSelectionBox({ startX: x, startY: y, currentX: x, currentY: y });
            
            // If not holding ctrl/meta, clear previous selection
            if (!e.ctrlKey && !e.metaKey) {
                setSelectedIds(new Set());
            }
        }
    }, [viewState]);

    const updateSelectionBox = useCallback((
        e: React.MouseEvent,
        canvasRef: React.RefObject<HTMLDivElement | null>
    ) => {
        if (!selectionBox || !canvasRef.current) return;
        
        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - viewState.x) / viewState.zoom;
        const y = (e.clientY - rect.top - viewState.y) / viewState.zoom;
        setSelectionBox(prev => prev ? ({ ...prev, currentX: x, currentY: y }) : null);
    }, [selectionBox, viewState]);

    const endSelectionBox = useCallback(() => {
        if (!selectionBox) return;

        const x1 = Math.min(selectionBox.startX, selectionBox.currentX);
        const x2 = Math.max(selectionBox.startX, selectionBox.currentX);
        const y1 = Math.min(selectionBox.startY, selectionBox.currentY);
        const y2 = Math.max(selectionBox.startY, selectionBox.currentY);

        const newlySelected = new Set(selectedIds);
        visibleThreads.forEach(t => {
            const centerX = t.x + (t.type === 'zone' ? (t.width || 300) / 2 : 144);
            const centerY = t.y + (t.type === 'zone' ? (t.height || 300) / 2 : 100);
            if (centerX >= x1 && centerX <= x2 && centerY >= y1 && centerY <= y2) {
                newlySelected.add(t.id);
            }
        });
        
        setSelectedIds(newlySelected);
        setSelectionBox(null);
    }, [selectionBox, selectedIds, visibleThreads]);

    const getSelectionBoxStyle = useCallback((): React.CSSProperties | null => {
        if (!selectionBox) return null;
        
        return {
            left: Math.min(selectionBox.startX, selectionBox.currentX),
            top: Math.min(selectionBox.startY, selectionBox.currentY),
            width: Math.abs(selectionBox.currentX - selectionBox.startX),
            height: Math.abs(selectionBox.currentY - selectionBox.startY),
        };
    }, [selectionBox]);

    return {
        selectedIds,
        setSelectedIds,
        selectionBox,
        setSelectionBox,
        toggleSelection,
        clearSelection,
        selectAll,
        startSelectionBox,
        updateSelectionBox,
        endSelectionBox,
        getSelectionBoxStyle,
    };
}
