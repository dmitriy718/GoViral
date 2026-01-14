
import { Request, Response } from 'express';
import { analyticsService } from '../services/analytics.service';
import { prisma } from '../utils/prisma';


export const getDashboardStats = async (req: Request, res: Response) => {
    console.log('HIT ANALYTICS CONTROLLER');
    try {
        const userPayload = (req as any).user;
        const user = await prisma.user.findUnique({ where: { email: userPayload.email } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const stats = await analyticsService.getDashboardStats(user.id);
        res.json(stats);
    } catch (error) {
        console.error('Analytics error:', error);
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
        console.error('Detailed report error:', error);
        res.status(500).json({ error: 'Failed to fetch detailed report' });
    }
};
