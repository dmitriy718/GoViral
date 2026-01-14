
import cron from 'node-cron';
import { prisma } from '../utils/prisma';
import { automationService } from './automation.service';


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
                console.log(`[Scheduler] Found ${duePosts.length} due posts.`);
                
                // Process in parallel but with error isolation
                await Promise.allSettled(duePosts.map(post => this.publishPost(post)));
            }
        } catch (error) {
            console.error('[Scheduler] Critical error checking posts:', error);
        }
    }

    async publishPost(post: { id: string, platform: string }) {
        console.log(`[Scheduler] Publishing post ${post.id} to ${post.platform}...`);

        try {
            // Mock Publishing Logic (Integration with social APIs would go here)
            // await socialService.publish(post); 

            await prisma.post.update({
                where: { id: post.id },
                data: { status: 'PUBLISHED' }
            });

            console.log(`[Scheduler] Post ${post.id} published successfully.`);
        } catch (error) {
            console.error(`[Scheduler] Failed to publish post ${post.id}:`, error);
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
