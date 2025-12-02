import { NextRequest, NextResponse } from 'next/server';
import { supabase, createAuthenticatedClient } from '@/lib/supabase';
import { 
    getCache, 
    setCache, 
    deleteCache,
    checkRateLimit,
    CACHE_TTL, 
    CACHE_KEYS 
} from '@/lib/redis';

interface CachedThreadsData {
    threads: any[];
    cachedAt: number;
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const playgroundId = searchParams.get('playgroundId') || 'default';
    const skipCache = searchParams.get('skipCache') === 'true';

    // Try to get from cache first (unless skipCache is set)
    if (!skipCache) {
        const cacheKey = CACHE_KEYS.threads(playgroundId);
        const cached = await getCache<CachedThreadsData>(cacheKey);
        
        if (cached) {
            return NextResponse.json({
                threads: cached.threads,
                fromCache: true,
                cachedAt: cached.cachedAt,
            });
        }
    }

    // Fetch from Supabase
    try {
        const authHeader = request.headers.get('Authorization');
        const supabaseClient = authHeader 
            ? createAuthenticatedClient(authHeader.replace('Bearer ', '')) 
            : supabase;

        let query = supabaseClient
            .from('threads')
            .select('*');
            
        if (playgroundId === 'default') {
            query = query.is('canvas_id', null);
        } else {
            query = query.eq('canvas_id', playgroundId);
        }

        const { data: threadsData, error: threadsError } = await query;

        if (threadsError) {
            console.error('Error fetching threads:', threadsError);
            return NextResponse.json(
                { error: 'Failed to fetch threads', details: threadsError.message, code: threadsError.code },
                { status: 500 }
            );
        }

        const threads = threadsData || [];
        
        // Cache the results
        if (threads.length > 0) {
            const cacheKey = CACHE_KEYS.threads(playgroundId);
            await setCache(cacheKey, {
                threads,
                cachedAt: Date.now(),
            }, CACHE_TTL.THREADS);
        }

        return NextResponse.json({
            threads,
            fromCache: false,
        });
    } catch (error) {
        console.error('Threads fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch threads' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, playgroundId, thread } = body;

        if (!userId || !thread) {
            return NextResponse.json(
                { error: 'userId and thread are required' },
                { status: 400 }
            );
        }

        // Rate limit thread creation (max 10 per minute per user)
        const rateLimit = await checkRateLimit(userId, 'create-thread', 10, 60);
        
        if (!rateLimit.allowed) {
            return NextResponse.json(
                { 
                    error: 'Rate limit exceeded. Please wait before creating more threads.',
                    resetIn: rateLimit.resetIn,
                    remaining: rateLimit.remaining,
                },
                { status: 429 }
            );
        }

        // Prepare thread data
        const threadData = { ...thread };
        if (playgroundId === 'default') {
            threadData.canvas_id = null;
        } else {
            threadData.canvas_id = playgroundId;
        }
        // Remove playgroundId from thread object if it exists to avoid schema error
        delete threadData.playgroundId;

        // Insert into Supabase
        const authHeader = request.headers.get('Authorization');
        const supabaseClient = authHeader 
            ? createAuthenticatedClient(authHeader.replace('Bearer ', '')) 
            : supabase;

        const { data, error } = await supabaseClient
            .from('threads')
            .insert(threadData)
            .select()
            .single();

        if (error) {
            console.error('Error creating thread:', error);
            return NextResponse.json(
                { error: 'Failed to create thread', details: error.message, code: error.code },
                { status: 500 }
            );
        }

        // Invalidate cache for this playground
        if (playgroundId) {
            await deleteCache(CACHE_KEYS.threads(playgroundId));
        }

        return NextResponse.json({
            thread: data,
            remaining: rateLimit.remaining,
        });
    } catch (error) {
        console.error('Thread creation error:', error);
        return NextResponse.json(
            { error: 'Failed to create thread' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, playgroundId, threadId, updates } = body;

        if (!userId || !threadId || !updates) {
            return NextResponse.json(
                { error: 'userId, threadId, and updates are required' },
                { status: 400 }
            );
        }

        // Rate limit updates (max 60 per minute per user - higher limit for dragging/resizing)
        const rateLimit = await checkRateLimit(userId, 'update-thread', 60, 60);
        
        if (!rateLimit.allowed) {
            return NextResponse.json(
                { 
                    error: 'Rate limit exceeded',
                    resetIn: rateLimit.resetIn,
                    remaining: rateLimit.remaining,
                },
                { status: 429 }
            );
        }

        // Handle 'default' playgroundId in updates and remove fields that shouldn't be updated
        const { id: _id, created_at: _createdAt, author_id: _authorId, ...cleanUpdates } = updates;
        
        // Filter out undefined values to prevent unintended null updates
        const updatesData: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(cleanUpdates)) {
            if (value !== undefined) {
                updatesData[key] = value;
            }
        }
        
        if (updatesData.canvas_id === 'default') {
            updatesData.canvas_id = null;
        }

        // Update in Supabase
        const authHeader = request.headers.get('Authorization');
        const supabaseClient = authHeader 
            ? createAuthenticatedClient(authHeader.replace('Bearer ', '')) 
            : supabase;

        const { data, error } = await supabaseClient
            .from('threads')
            .update(updatesData)
            .eq('id', threadId)
            .select()
            .single();

        if (error) {
            console.error('Error updating thread:', error);
            return NextResponse.json(
                { error: 'Failed to update thread', details: error.message, code: error.code },
                { status: 500 }
            );
        }

        // Invalidate cache
        if (playgroundId) {
            await deleteCache(CACHE_KEYS.threads(playgroundId));
        }

        return NextResponse.json({
            thread: data,
            remaining: rateLimit.remaining,
        });
    } catch (error) {
        console.error('Thread update error:', error);
        return NextResponse.json(
            { error: 'Failed to update thread' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const threadId = searchParams.get('threadId');
    const playgroundId = searchParams.get('playgroundId');
    const userId = searchParams.get('userId');

    if (!threadId || !userId) {
        return NextResponse.json(
            { error: 'threadId and userId are required' },
            { status: 400 }
        );
    }

    // Rate limit deletions (max 20 per minute per user)
    const rateLimit = await checkRateLimit(userId, 'delete-thread', 20, 60);
    
    if (!rateLimit.allowed) {
        return NextResponse.json(
            { error: 'Rate limit exceeded', resetIn: rateLimit.resetIn },
            { status: 429 }
        );
    }

    try {
        const authHeader = request.headers.get('Authorization');
        const supabaseClient = authHeader 
            ? createAuthenticatedClient(authHeader.replace('Bearer ', '')) 
            : supabase;

        const { error } = await supabaseClient
            .from('threads')
            .delete()
            .eq('id', threadId);

        if (error) {
            console.error('Error deleting thread:', error);
            return NextResponse.json(
                { error: 'Failed to delete thread' },
                { status: 500 }
            );
        }

        // Invalidate cache
        if (playgroundId) {
            await deleteCache(CACHE_KEYS.threads(playgroundId));
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Thread deletion error:', error);
        return NextResponse.json(
            { error: 'Failed to delete thread' },
            { status: 500 }
        );
    }
}
