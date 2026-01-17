type Post = {
    id: string;
    autoPlugThreshold?: number | null;
    autoPlugContent?: string | null;
    autoDmKeyword?: string | null;
    autoDmContent?: string | null;
};
import { prisma } from '../utils/prisma';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export class AutomationService {
    
    // Called by the scheduler every minute (simulated)
    async checkTriggers() {
        if (env.MOCK_MODE !== 'true') {
            return;
        }
        // 1. Check Auto-Plug Triggers
        // Find posts that are PUBLISHED, have autoPlugEnabled, and are NOT yet plugged (we need a flag or check comments)
        // For simplicity, we'll assume we check 'options' JSON or add a status.
        // Actually, let's just log for MVP simulation.
        logger.info('Checking for Auto-Plug candidates');
        
        const activePlugs = await prisma.post.findMany({
            where: {
                status: 'PUBLISHED',
                autoPlugEnabled: true,
            }
        });

        // Parallelize processing
        await Promise.allSettled(activePlugs.map(post => this.processAutoPlug(post)));

        // 2. Check Auto-DM Triggers
        logger.info('Checking for Auto-DM candidates');
        const activeDMs = await prisma.post.findMany({
            where: {
                status: 'PUBLISHED',
                autoDmEnabled: true,
            }
        });

        await Promise.allSettled(activeDMs.map(post => this.processAutoDM(post)));
    }

    private async processAutoPlug(post: Post) {
        // Mock API call to get engagement
        const currentLikes = Math.floor(Math.random() * 100); // Random simulation
        
        const threshold = typeof post.autoPlugThreshold === 'number' ? post.autoPlugThreshold : 0;
        logger.info({ postId: post.id, currentLikes, threshold }, 'AutoPlug check');

        if (currentLikes >= threshold) {
            logger.info({ postId: post.id }, 'AutoPlug triggered');
            
            // In real app: await socialApi.reply(post.platformId, post.autoPlugContent);
            
            // Mark as done to avoid spamming
            await prisma.post.update({
                where: { id: post.id },
                data: { autoPlugEnabled: false } // Disable after firing once
            });
        }
    }

    private async processAutoDM(post: Post) {
        // Mock API call to get comments
        const mockComments = [
            { user: '@fan1', text: 'Great post!' },
            { user: '@lead1', text: `Please send the ${post.autoDmKeyword}!` }, // Match!
            { user: '@bot', text: 'Promote it here.' }
        ];

        const keyword = typeof post.autoDmKeyword === 'string' ? post.autoDmKeyword.toLowerCase() : '';
        if (!keyword) return;

        logger.info({ postId: post.id, keyword }, 'AutoDM scanning comments');

        for (const comment of mockComments) {
            if (comment.text.toLowerCase().includes(keyword)) {
                logger.info({ postId: post.id, user: comment.user }, 'AutoDM send');
                // In real app: await socialApi.sendDM(comment.user, post.autoDmContent);
            }
        }
    }
}

export const automationService = new AutomationService();
