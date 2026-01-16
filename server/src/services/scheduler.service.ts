
import cron from 'node-cron';
import { prisma } from '../utils/prisma';
import { automationService } from './automation.service';
import { logger } from '../utils/logger';
import { publishQueue } from '../utils/queue';


export class SchedulerService {
    constructor() {
        // Run every minute
        cron.schedule('* * * * *', this.checkScheduledPosts.bind(this));
    }

    async checkScheduledPosts() {
        const lockKey = 19770414;
        const lockResult = await prisma.$queryRaw<
            Array<{ locked: boolean }>
        >`SELECT pg_try_advisory_lock(${lockKey}) as locked`;
        if (!lockResult[0]?.locked) {
            return;
        }

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

                await Promise.allSettled(duePosts.map((post: { id: string }) =>
                    publishQueue.add('publish-post', { postId: post.id }, { jobId: post.id })
                ));
            }
        } catch (error) {
            logger.error({ err: error }, 'Scheduler failed to check posts');
        } finally {
            await prisma.$queryRaw`SELECT pg_advisory_unlock(${lockKey})`;
        }
    }
}

// Initialize scheduler
export const schedulerService = new SchedulerService();
