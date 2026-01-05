import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL;

// Create Redis client with fallback for development
// Only create the client if REDIS_URL is set to avoid connection errors
let redis: Redis | null = null;

if (redisUrl) {
    redis = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
            if (times > 3) {
                // Stop retrying after 3 attempts
                return null;
            }
            return Math.min(times * 100, 3000);
        },
        lazyConnect: true, // Don't connect until first command
    });

    // Handle connection errors gracefully
    redis.on('error', (err) => {
        console.warn('Redis connection error (non-fatal):', err.message);
    });
}

export { redis };

// Cache TTL constants (in seconds)
export const CACHE_TTL = {
    CURSOR: 5,           // Cursor positions expire quickly
    THREADS: 60,         // Thread data cache for 1 minute
    USER_SESSION: 3600,  // User session data for 1 hour
    RATE_LIMIT: 60,      // Rate limit window
} as const;

// Key prefixes for organization
export const CACHE_KEYS = {
    cursor: (playgroundId: string, oderId: string) => `cursor:${playgroundId}:${oderId}`,
    cursors: (playgroundId: string) => `cursors:${playgroundId}`,
    threads: (playgroundId: string) => `threads:${playgroundId}`,
    userSession: (userId: string) => `session:${userId}`,
    rateLimit: (userId: string, action: string) => `ratelimit:${action}:${userId}`,
} as const;

/**
 * Get cached data with automatic JSON parsing
 */
export async function getCache<T>(key: string): Promise<T | null> {
    if (!redis) return null;
    try {
        const data = await redis.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Redis get error:', error);
        return null;
    }
}

/**
 * Set cache with automatic JSON serialization
 */
export async function setCache(key: string, value: unknown, ttlSeconds?: number): Promise<boolean> {
    if (!redis) return false;
    try {
        const serialized = JSON.stringify(value);
        if (ttlSeconds) {
            await redis.setex(key, ttlSeconds, serialized);
        } else {
            await redis.set(key, serialized);
        }
        return true;
    } catch (error) {
        console.error('Redis set error:', error);
        return false;
    }
}

/**
 * Delete cache key
 */
export async function deleteCache(key: string): Promise<boolean> {
    if (!redis) return false;
    try {
        await redis.del(key);
        return true;
    } catch (error) {
        console.error('Redis delete error:', error);
        return false;
    }
}

/**
 * Delete multiple cache keys by pattern
 */
export async function deleteCachePattern(pattern: string): Promise<boolean> {
    if (!redis) return false;
    try {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
            await redis.del(...keys);
        }
        return true;
    } catch (error) {
        console.error('Redis delete pattern error:', error);
        return false;
    }
}

/**
 * Rate limiting check - returns true if action is allowed
 */
export async function checkRateLimit(
    userId: string, 
    action: string, 
    maxRequests: number = 100,
    windowSeconds: number = CACHE_TTL.RATE_LIMIT
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
    if (!redis) {
        return { allowed: true, remaining: maxRequests, resetIn: 0 };
    }

    const key = CACHE_KEYS.rateLimit(userId, action);
    
    try {
        const current = await redis.incr(key);
        
        if (current === 1) {
            await redis.expire(key, windowSeconds);
        }

        const ttl = await redis.ttl(key);
        const remaining = Math.max(0, maxRequests - current);
        
        return {
            allowed: current <= maxRequests,
            remaining,
            resetIn: ttl > 0 ? ttl : windowSeconds,
        };
    } catch (error) {
        console.error('Redis rate limit error:', error);
        return { allowed: true, remaining: maxRequests, resetIn: 0 };
    }
}

/**
 * Store cursor position in Redis for aggregation
 */
export async function updateCursorPosition(
    playgroundId: string,
    userId: string,
    cursorData: { x: number; y: number; userName: string; color: string }
): Promise<boolean> {
    if (!redis) return false;
    
    try {
        await redis.hset(
            CACHE_KEYS.cursors(playgroundId),
            userId,
            JSON.stringify({ ...cursorData, userId, timestamp: Date.now() })
        );
        await redis.expire(CACHE_KEYS.cursors(playgroundId), CACHE_TTL.CURSOR);
        return true;
    } catch (error) {
        console.error('Redis cursor update error:', error);
        return false;
    }
}

/**
 * Get all cursor positions for a playground
 */
export async function getCursorPositions(playgroundId: string): Promise<Record<string, { x: number; y: number; userId: string; timestamp: number }>> {
    if (!redis) return {};
    
    try {
        const cursors = await redis.hgetall(CACHE_KEYS.cursors(playgroundId));
        const parsed: Record<string, { x: number; y: number; userId: string; timestamp: number }> = {};
        
        for (const [userId, data] of Object.entries(cursors)) {
            try {
                const cursor = JSON.parse(data);
                // Filter out stale cursors (older than 10 seconds)
                if (Date.now() - cursor.timestamp < 10000) {
                    parsed[userId] = cursor;
                }
            } catch {
                // Skip invalid entries
            }
        }
        
        return parsed;
    } catch (error) {
        console.error('Redis get cursors error:', error);
        return {};
    }
}

/**
 * Remove a cursor when user disconnects
 */
export async function removeCursor(playgroundId: string, userId: string): Promise<boolean> {
    if (!redis) return false;
    
    try {
        await redis.hdel(CACHE_KEYS.cursors(playgroundId), userId);
        return true;
    } catch (error) {
        console.error('Redis remove cursor error:', error);
        return false;
    }
}
