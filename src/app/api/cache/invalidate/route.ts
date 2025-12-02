import { NextRequest, NextResponse } from 'next/server';
import { deleteCache, deleteCachePattern, CACHE_KEYS } from '@/lib/redis';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, playgroundId, pattern } = body;

        if (!type) {
            return NextResponse.json(
                { error: 'type is required (threads, cursors, or pattern)' },
                { status: 400 }
            );
        }

        let success = false;

        switch (type) {
            case 'threads':
                if (!playgroundId) {
                    return NextResponse.json(
                        { error: 'playgroundId is required for threads invalidation' },
                        { status: 400 }
                    );
                }
                success = await deleteCache(CACHE_KEYS.threads(playgroundId));
                break;

            case 'cursors':
                if (!playgroundId) {
                    return NextResponse.json(
                        { error: 'playgroundId is required for cursors invalidation' },
                        { status: 400 }
                    );
                }
                success = await deleteCache(CACHE_KEYS.cursors(playgroundId));
                break;

            case 'pattern':
                if (!pattern) {
                    return NextResponse.json(
                        { error: 'pattern is required for pattern invalidation' },
                        { status: 400 }
                    );
                }
                success = await deleteCachePattern(pattern);
                break;

            default:
                return NextResponse.json(
                    { error: 'Invalid type. Must be threads, cursors, or pattern' },
                    { status: 400 }
                );
        }

        return NextResponse.json({ 
            success,
            type,
            playgroundId,
            pattern,
        });
    } catch (error) {
        console.error('Cache invalidation error:', error);
        return NextResponse.json(
            { error: 'Failed to invalidate cache' },
            { status: 500 }
        );
    }
}
