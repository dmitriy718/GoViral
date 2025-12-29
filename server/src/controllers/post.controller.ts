import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { aiService } from '../services/ai.service';

const prisma = new PrismaClient();

export const generatePost = async (req: Request, res: Response) => {
  try {
    const { keywords, tone, postType, platform } = req.body;

    if (!keywords || !tone || !postType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const suggestions = await aiService.generatePost({
      keywords,
      tone,
      postType,
      platform: platform || 'twitter'
    });

    res.json({ suggestions });
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const { content, mediaUrl, platform, scheduledAt } = req.body;
    const userPayload = (req as any).user; // Attached by auth middleware

    // Sync user to local DB
    let user = await prisma.user.findUnique({
      where: { email: userPayload.email }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userPayload.uid, // Use Firebase UID as primary key if possible, or keep UUID and map it. 
          // Actually schema has UUID default. Let's keep UUID for internal and store firebaseId? 
          // Schema not updated for firebaseId. Let's used email as unique identifier for now and create.
          email: userPayload.email,
          password: 'firebase_oauth_user', // Placeholder
          name: userPayload.name || userPayload.email.split('@')[0]
        }
      });
    }

    const post = await prisma.post.create({
      data: {
        content,
        mediaUrl,
        platform: platform || 'twitter',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        status: scheduledAt ? 'SCHEDULED' : 'DRAFT',
        userId: user.id
      }
    });

    res.json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
}
