
import { Request, Response } from 'express';
import { analyticsService } from '../services/analytics.service';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';


export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const userPayload = (req as any).user;
        const user = await prisma.user.findUnique({ where: { email: userPayload.email } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const stats = await analyticsService.getDashboardStats(user.id);
        res.json(stats);
    } catch (error) {
        logger.error({ err: error }, 'Analytics error');
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
};

export const getDetailedReport = async (req: Request, res: Response) => {
    try {
        const userPayload = (req as any).user;
        const { range } = req.query;

        const user = await prisma.user.findUnique({ where: { email: userPayload.email } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const report = await analyticsService.getDetailedReport(user.id, range as string);
        res.json(report);
    } catch (error) {
        logger.error({ err: error }, 'Detailed report error');
        res.status(500).json({ error: 'Failed to fetch detailed report' });
    }
};
