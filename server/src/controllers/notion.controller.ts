import { Response } from 'express';
import { notionService } from '../services/notion.service';
import { userService } from '../services/user.service';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middleware/auth';
import { env } from '../config/env';

export const connectNotion = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.sendStatus(401);
    
    // Ensure user exists in DB before creating integration
    await userService.syncUser(req.user);

    const { databaseId, accessToken } = req.body;
    
    const integration = await notionService.connect(req.user.uid, { databaseId, accessToken });
    res.json(integration);
});

export const syncNotion = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.sendStatus(401);
    if (env.MOCK_MODE !== 'true') {
        return res.status(501).json({ error: 'Not implemented', message: 'Notion sync is not enabled in production yet.' });
    }
    
    const result = await notionService.sync(req.user.uid);
    res.json(result);
});
