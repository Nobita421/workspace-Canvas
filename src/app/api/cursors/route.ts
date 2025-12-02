import { NextRequest, NextResponse } from 'next/server';
import { 
    updateCursorPosition, 
    getCursorPositions, 
    removeCursor,
    checkRateLimit 
} from '@/lib/redis';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const playgroundId = searchParams.get('playgroundId');

    if (!playgroundId) {
        return NextResponse.json(
            { error: 'playgroundId is required' },
            { status: 400 }
        );
    }

    const cursors = await getCursorPositions(playgroundId);
    
    return NextResponse.json({ cursors });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { playgroundId, userId, x, y, userName, color } = body;

        if (!playgroundId || !userId) {
            return NextResponse.json(
                { error: 'playgroundId and userId are required' },
                { status: 400 }
            );
        }

        // Rate limit cursor updates (max 30 per second per user)
        const rateLimit = await checkRateLimit(userId, 'cursor', 30, 1);
        
        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: 'Rate limit exceeded', resetIn: rateLimit.resetIn },
                { status: 429 }
            );
        }

        await updateCursorPosition(playgroundId, userId, {
            x,
            y,
            userName,
            color,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Cursor update error:', error);
        return NextResponse.json(
            { error: 'Failed to update cursor' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const playgroundId = searchParams.get('playgroundId');
    const userId = searchParams.get('userId');

    if (!playgroundId || !userId) {
        return NextResponse.json(
            { error: 'playgroundId and userId are required' },
            { status: 400 }
        );
    }

    await removeCursor(playgroundId, userId);
    
    return NextResponse.json({ success: true });
}
