import { Post } from '@prisma/client';
import { prisma } from '../utils/prisma';

export class AutomationService {
    
    // Called by the scheduler every minute (simulated)
    async checkTriggers() {
        // 1. Check Auto-Plug Triggers
        // Find posts that are PUBLISHED, have autoPlugEnabled, and are NOT yet plugged (we need a flag or check comments)
        // For simplicity, we'll assume we check 'options' JSON or add a status.
        // Actually, let's just log for MVP simulation.
        console.log('[Automation] Checking for Auto-Plug candidates...');
        
        const activePlugs = await prisma.post.findMany({
            where: {
                status: 'PUBLISHED',
                autoPlugEnabled: true,
                // In a real app, we'd filter out already-replied posts.
            }
        });

        for (const post of activePlugs) {
            await this.processAutoPlug(post);
        }

        // 2. Check Auto-DM Triggers
        console.log('[Automation] Checking for Auto-DM candidates...');
        const activeDMs = await prisma.post.findMany({
            where: {
                status: 'PUBLISHED',
                autoDmEnabled: true,
            }
        });

        for (const post of activeDMs) {
            await this.processAutoDM(post);
        }
    }

    private async processAutoPlug(post: Post) {
        // Mock API call to get engagement
        const currentLikes = Math.floor(Math.random() * 100); // Random simulation
        
        console.log(`[AutoPlug] Post ${post.id}: ${currentLikes}/${post.autoPlugThreshold} likes.`);

        if (currentLikes >= post.autoPlugThreshold) {
            console.log(`[AutoPlug] 🚀 TRIGGERED! Replying with: ${post.autoPlugContent}`);
            
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

        const keyword = post.autoDmKeyword?.toLowerCase();
        if (!keyword) return;

        console.log(`[AutoDM] Scanning comments on Post ${post.id} for "${keyword}"...`);

        for (const comment of mockComments) {
            if (comment.text.toLowerCase().includes(keyword)) {
                console.log(`[AutoDM] 📬 SENDING DM to ${comment.user}: "${post.autoDmContent}"`);
                // In real app: await socialApi.sendDM(comment.user, post.autoDmContent);
            }
        }
    }
}

export const automationService = new AutomationService();
