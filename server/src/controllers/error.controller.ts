import { Request, Response } from 'express';
import * as Sentry from '@sentry/node';
import { logger } from '../utils/logger';
import { env } from '../config/env';

export const reportError = async (req: Request, res: Response) => {
    try {
        const errorData = req.body;
        const timestamp = new Date().toISOString();
        const report = {
            timestamp,
            ...errorData,
            userAgent: req.headers['user-agent'],
            ip: req.ip
        };

        // 1. Log to Console (Immediate Visibility)
        logger.error({
            timestamp,
            message: errorData?.message,
            url: errorData?.url,
            ip: req.ip
        }, 'Critical client error reported');

        if (env.SENTRY_DSN) {
            Sentry.captureMessage('Client error reported', {
                level: 'error',
                extra: report
            });
        }

        // Disk persistence removed for production safety.

        res.json({ success: true, message: 'Error reported successfully', ticketId: timestamp });
    } catch (err) {
        logger.error({ err }, 'Failed to process error report');
        res.status(500).json({ error: 'Failed to report error' });
    }
};
