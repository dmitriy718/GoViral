import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addCompetitor = async (req: Request, res: Response) => {
    try {
        const { handle } = req.body;
        const userId = (req as any).user.uid;

        if (!handle) {
            return res.status(400).json({ error: 'Handle is required' });
        }

        const competitor = await prisma.competitor.create({
            data: {
                handle,
                userId,
                // Mock data for now until we have real scraping
                status: Math.random() > 0.3 ? 'Active Now' : 'Offline',
                lastPost: `${Math.floor(Math.random() * 59) + 1}m ago`
            }
        });

        res.json(competitor);
    } catch (error) {
        console.error('Error adding competitor:', error);
        res.status(500).json({ error: 'Failed to add competitor' });
    }
};

export const getCompetitors = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.uid;
        const competitors = await prisma.competitor.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(competitors);
    } catch (error) {
        console.error('Error fetching competitors:', error);
        res.status(500).json({ error: 'Failed to fetch competitors' });
    }
};
