import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export const reportError = async (req: Request, res: Response) => {
    try {
        const errorData = req.body;
        const timestamp = new Date().toISOString();
        const logDir = path.join(__dirname, '../../logged_errors');

        // Ensure log directory exists
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }

        const logFile = path.join(logDir, `error_report_${timestamp.replace(/[:.]/g, '-')}.json`);

        const report = {
            timestamp,
            ...errorData,
            userAgent: req.headers['user-agent'],
            ip: req.ip
        };

        // 1. Log to Console (Immediate Visibility)
        console.error('CRITICAL CLIENT ERROR REPORTED:', {
            timestamp,
            message: errorData?.message,
            url: errorData?.url,
            ip: req.ip
        });

        // 2. Save to Disk (Simulating Email/Persistence)
        fs.writeFileSync(logFile, JSON.stringify(report, null, 2));

        res.json({ success: true, message: 'Error reported successfully', ticketId: timestamp });
    } catch (err) {
        console.error('Failed to process error report:', err);
        res.status(500).json({ error: 'Failed to report error' });
    }
};
