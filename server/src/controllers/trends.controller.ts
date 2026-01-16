
import { Request, Response } from 'express';
import { trendsService } from '../services/trends.service';

export const getTrends = async (req: Request, res: Response) => {
    try {
        const trends = await trendsService.getTrends();
        res.json(trends);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch trends' });
    }
};
