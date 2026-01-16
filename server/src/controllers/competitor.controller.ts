import { Request, Response } from 'express';
import { competitorService } from '../services/competitor.service';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';
import { env } from '../config/env';

export const addCompetitor = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (env.MOCK_MODE !== 'true') {
        return res.status(501).json({ error: 'Not implemented', message: 'Competitor tracking is not enabled in production yet.' });
    }
    const { handle } = req.body;
    if (!req.user) return res.sendStatus(401);

    const comp = await competitorService.addCompetitor(req.user.uid, handle);
    
    // Trigger analysis immediately for MVP
    competitorService.analyze(comp.id).catch(err => logger.error({ err }, 'Background analysis failed'));

    res.json(comp);
});

export const getCompetitors = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (env.MOCK_MODE !== 'true') {
        return res.status(501).json({ error: 'Not implemented', message: 'Competitor tracking is not enabled in production yet.' });
    }
    if (!req.user) return res.sendStatus(401);
    const comps = await competitorService.getCompetitors(req.user.uid);
    res.json(comps);
});
