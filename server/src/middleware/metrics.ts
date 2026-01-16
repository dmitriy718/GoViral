import { Request, Response, NextFunction } from 'express';

const MAX_SAMPLES = 5000;

const metrics = {
    requests: 0,
    errors: 0,
    totalResponseMs: 0,
    responseTimes: [] as number[],
    statusCounts: new Map<number, number>(),
    dbQueries: 0,
    totalDbMs: 0,
    dbTimes: [] as number[]
};

const pushSample = (arr: number[], value: number) => {
    arr.push(value);
    if (arr.length > MAX_SAMPLES) {
        arr.shift();
    }
};

const percentile = (values: number[], p: number) => {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const idx = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
    return Math.round(sorted[idx]);
};

export const recordDbDuration = (durationMs: number) => {
    metrics.dbQueries += 1;
    metrics.totalDbMs += durationMs;
    pushSample(metrics.dbTimes, durationMs);
};

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    metrics.requests += 1;

    res.on('finish', () => {
        const duration = Date.now() - start;
        metrics.totalResponseMs += duration;
        pushSample(metrics.responseTimes, duration);

        const status = res.statusCode;
        metrics.statusCounts.set(status, (metrics.statusCounts.get(status) || 0) + 1);
        if (status >= 500) {
            metrics.errors += 1;
        }
    });

    next();
};

export const getMetrics = () => ({
    requests: metrics.requests,
    errors: metrics.errors,
    errorRate: metrics.requests ? Number((metrics.errors / metrics.requests).toFixed(4)) : 0,
    avgResponseMs: metrics.requests ? Math.round(metrics.totalResponseMs / metrics.requests) : 0,
    responseP50Ms: percentile(metrics.responseTimes, 50),
    responseP90Ms: percentile(metrics.responseTimes, 90),
    responseP99Ms: percentile(metrics.responseTimes, 99),
    dbQueries: metrics.dbQueries,
    dbAvgMs: metrics.dbQueries ? Math.round(metrics.totalDbMs / metrics.dbQueries) : 0,
    dbP50Ms: percentile(metrics.dbTimes, 50),
    dbP90Ms: percentile(metrics.dbTimes, 90),
    dbP99Ms: percentile(metrics.dbTimes, 99)
});
