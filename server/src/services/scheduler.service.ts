
import cron from 'node-cron';
import { prisma } from '../utils/prisma';
import { automationService } from './automation.service';
import { logger } from '../utils/logger';


export class SchedulerService {
    constructor() {
        // Run every minute
        cron.schedule('* * * * *', this.checkScheduledPosts.bind(this));
    }

    async checkScheduledPosts() {
        try {
            // Run Automations (Plug/DM)
            await automationService.checkTriggers();

            // Optimization: Select only needed fields
            const duePosts = await prisma.post.findMany({
                where: {
                    status: 'SCHEDULED',
                    scheduledAt: {
                        lte: new Date()
                    }
                },
                select: {
                    id: true,
                    platform: true,
                    content: true,
                    mediaUrl: true,
                    userId: true
                }
            });

            if (duePosts.length > 0) {
                logger.info({ count: duePosts.length }, 'Scheduler found due posts');
                
                // Process in parallel but with error isolation
                await Promise.allSettled(duePosts.map(post => this.publishPost(post)));
            }
        } catch (error) {
            logger.error({ err: error }, 'Scheduler failed to check posts');
        }
    }

    async publishPost(post: { id: string, platform: string }) {
        logger.info({ postId: post.id, platform: post.platform }, 'Publishing scheduled post');

        try {
            // Mock Publishing Logic (Integration with social APIs would go here)
            // await socialService.publish(post); 

            await prisma.post.update({
                where: { id: post.id },
                data: { status: 'PUBLISHED' }
            });

            logger.info({ postId: post.id }, 'Scheduled post published');
        } catch (error) {
            logger.error({ err: error, postId: post.id }, 'Failed to publish scheduled post');
            // Optional: Update status to 'FAILED'
             await prisma.post.update({
                where: { id: post.id },
                data: { status: 'FAILED' }
            });
        }
    }
}

// Initialize scheduler
export const schedulerService = new SchedulerService();
