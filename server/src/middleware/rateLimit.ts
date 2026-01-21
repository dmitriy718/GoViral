import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import { env } from '../config/env';
import { logger } from '../utils/logger';

// Initialize Redis client
// We use a separate client for rate limiting to avoid blocking other operations if we had a shared client
const redis = new Redis(env.DATABASE_URL?.includes('redis') ? env.DATABASE_URL : process.env.REDIS_URL || 'redis://localhost:6379');

redis.on('error', (err) => {
    logger.warn({ err }, 'Redis rate limiter error, falling back to permissive mode');
});

interface RateLimitOptions {
    windowMs: number;
    max: number;
    keyGenerator?: (req: Request) => string;
}

export const rateLimit = (options: RateLimitOptions) => {
    const { windowMs, max, keyGenerator } = options;

    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const key = `ratelimit:${(keyGenerator ? keyGenerator(req) : req.ip) || 'unknown'}`;
            
            // Increment the key
            const current = await redis.incr(key);
            
            // If it's the first time, set the expiry
            if (current === 1) {
                await redis.expire(key, Math.ceil(windowMs / 1000));
            }

            if (current > max) {
                const ttl = await redis.ttl(key);
                res.setHeader('Retry-After', ttl);
                return res.status(429).json({
                    error: 'Rate limit exceeded',
                    message: `Too many requests. Try again in ${ttl}s.`
                });
            }

            return next();
        } catch (error) {
            // Fail open if Redis is down
            logger.error({ err: error }, 'Rate limit middleware failed');
            return next();
        }
    };
};

