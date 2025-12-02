import { useMemo } from 'react';
import { Thread } from '@/lib/types';

interface ViewState {
    x: number;
    y: number;
    zoom: number;
}

interface WindowSize {
    width: number;
    height: number;
}

const BUFFER = 800; // Generous buffer to prevent pop-in during fast pans
const DEFAULT_CARD_WIDTH = 350; // Slightly larger than typical card to be safe
const DEFAULT_CARD_HEIGHT = 400; // Accommodate expanded cards

export function useVirtualization(
    items: Thread[],
    viewState: ViewState,
    windowSize: WindowSize
) {
    return useMemo(() => {
        if (items.length === 0) return [];

        // Calculate visible viewport in canvas coordinates
        // The canvas transform is: translate(x, y) scale(zoom)
        // Screen coordinate (sx, sy) to Canvas coordinate (cx, cy):
        // cx = (sx - x) / zoom
        // cy = (sy - y) / zoom

        // We invert the transform to find the rectangle of the canvas that is currently visible on screen
        const minX = (0 - viewState.x) / viewState.zoom - BUFFER;
        const minY = (0 - viewState.y) / viewState.zoom - BUFFER;
        const maxX = (windowSize.width - viewState.x) / viewState.zoom + BUFFER;
        const maxY = (windowSize.height - viewState.y) / viewState.zoom + BUFFER;

        return items.filter(item => {
            // Use item dimensions if available, otherwise defaults
            // Zones usually have width/height. Cards might not.
            const width = item.width || DEFAULT_CARD_WIDTH;
            const height = item.height || DEFAULT_CARD_HEIGHT;

            // Check intersection
            // Item right > Viewport left && Item left < Viewport right
            // Item bottom > Viewport top && Item top < Viewport bottom
            return (
                item.x + width > minX &&
                item.x < maxX &&
                item.y + height > minY &&
                item.y < maxY
            );
        });
    }, [items, viewState, windowSize]);
}
