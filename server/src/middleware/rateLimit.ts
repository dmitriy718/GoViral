import { Request, Response, NextFunction } from 'express';

interface RateLimitOptions {
    windowMs: number;
    max: number;
    keyGenerator?: (req: Request) => string;
}

interface RateLimitState {
    count: number;
    resetAt: number;
}

const store = new Map<string, RateLimitState>();

export const rateLimit = (options: RateLimitOptions) => {
    const { windowMs, max, keyGenerator } = options;

    return (req: Request, res: Response, next: NextFunction) => {
        const key = (keyGenerator ? keyGenerator(req) : req.ip) || 'unknown';
        const now = Date.now();
        const entry = store.get(key);

        if (!entry || entry.resetAt <= now) {
            store.set(key, { count: 1, resetAt: now + windowMs });
            return next();
        }

        entry.count += 1;
        if (entry.count > max) {
            const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
            res.setHeader('Retry-After', String(retryAfter));
            return res.status(429).json({
                error: 'Rate limit exceeded',
                message: `Too many requests. Try again in ${retryAfter}s.`
            });
        }

        store.set(key, entry);
        return next();
    };
};
