import { Request, Response, NextFunction } from 'express';

const metrics = {
    requests: 0,
    errors: 0,
    totalResponseMs: 0
};

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    metrics.requests += 1;

    res.on('finish', () => {
        const duration = Date.now() - start;
        metrics.totalResponseMs += duration;
        if (res.statusCode >= 500) {
            metrics.errors += 1;
        }
    });

    next();
};

export const getMetrics = () => ({
    requests: metrics.requests,
    errors: metrics.errors,
    avgResponseMs: metrics.requests ? Math.round(metrics.totalResponseMs / metrics.requests) : 0
});
