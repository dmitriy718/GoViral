import { Request, Response } from 'express';
import { aiService } from '../services/ai.service';
import { postService } from '../services/post.service';
import { AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import { subscriptionService } from '../services/subscription.service';
import { userService } from '../services/user.service';
import { prisma } from '../utils/prisma';

export const generatePost = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    const { keywords, tone, postType, platform, includeMedia } = req.body;
    await userService.syncUser(req.user);

    const { allowed, limit, plan } = await subscriptionService.checkLimit(req.user.uid, 'aiGenerations');
    if (!allowed) {
        res.status(403).json({
            error: `Plan limit reached (${plan})`,
            message: `You have reached the limit of ${limit} AI generations for your ${plan} plan.`
        });
        return;
    }

    const suggestions = await aiService.generatePost({
      keywords,
      tone,
      postType,
      platform: platform || 'twitter',
      includeMedia,
      generationMode: req.body.generationMode || 'mix'
    });

    await prisma.aiGeneration.create({
        data: {
            userId: req.user.uid
        }
    });

    res.json({ suggestions });
});

export const createPost = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    try {
        const post = await postService.createPost(req.user, req.body);
        res.json(post);
    } catch (error: any) {
        // Handle service-level errors (like limits)
        if (error.message.includes('Plan limit')) {
            res.status(403).json({ error: error.message });
            return;
        }
        throw error;
    }
});

export const getPosts = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    const limitParam = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;
    const statusParam = Array.isArray(req.query.status) ? req.query.status[0] : req.query.status;
    const limit = limitParam ? Math.min(parseInt(String(limitParam), 10) || 50, 200) : 50;
    const status = statusParam ? String(statusParam).toUpperCase() : undefined;

    const posts = await postService.getPosts(req.user.uid, limit, status);
    res.json(posts);
});
