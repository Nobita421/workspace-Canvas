export interface Comment {
    text: string;
    author: string;
    authorName?: string;
    createdAt: string;
}

export interface Thread {
    id: string;
    type: 'card' | 'zone';
    x: number;
    y: number;
    width?: number;
    height?: number;
    title?: string;
    content?: string;
    color?: string;
    sentiment?: 'bullish' | 'bearish' | 'neutral' | 'volatile';
    locked?: boolean;
    author: string;
    authorName?: string;
    createdAt?: string;
    connectedTo?: string[];
    connectionLabels?: Record<string, string>;
    reactions?: Record<string, number>;
    comments?: Comment[];
    tags?: string[];
    imageUrl?: string | null;
    ticker?: string | null;
    activity?: number;
    playgroundId?: string;
    likes?: number;
    isNewSpawn?: boolean;
    zIndex?: number;
    metadata?: Record<string, unknown>;
}

export interface ViewState {
    x: number;
    y: number;
    zoom: number;
}
