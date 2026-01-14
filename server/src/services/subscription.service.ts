
import { prisma } from '../utils/prisma';


export const PLAN_LIMITS = {
    FREE: {
        posts: 5,
        socialAccounts: 1,
        aiGenerations: 10
    },
    PRO: {
        posts: 100,
        socialAccounts: 5,
        aiGenerations: 500
    },
    ENTERPRISE: {
        posts: 10000,
        socialAccounts: 50,
        aiGenerations: 10000
    }
};

export class SubscriptionService {
    async checkLimit(userId: string, resource: 'posts' | 'socialAccounts' | 'aiGenerations'): Promise<{ allowed: boolean, limit: number, current: number, plan: string }> {
        // 1. Get User Plan
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { subscription: true }
        });

        if (!user) throw new Error('User not found');

        const planName = (user.subscription?.plan || 'FREE') as keyof typeof PLAN_LIMITS;
        const limits = PLAN_LIMITS[planName];

        let currentUsage = 0;
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        if (resource === 'posts') {
            currentUsage = await prisma.post.count({ 
                where: { 
                    userId,
                    createdAt: {
                        gte: startOfMonth
                    }
                } 
            });
        } else if (resource === 'socialAccounts') {
            // Accounts are absolute, not monthly
            currentUsage = await prisma.socialAccount.count({ where: { userId } });
        } else if (resource === 'aiGenerations') {
             // Not tracked in DB yet, return mock for now or implement AI log table later.
             currentUsage = 0; 
        }

        console.log(`[SubscriptionService] User: ${userId}, Plan: ${planName}, Resource: ${resource}, Current: ${currentUsage}, Limit: ${limits?.[resource]}`);

        // Safe check
        const limit = limits?.[resource] ?? 0;

        if (currentUsage >= limit) {
            return { allowed: false, limit, current: currentUsage, plan: planName };
        }

        return { allowed: true, limit, current: currentUsage, plan: planName };
    }
}

export const subscriptionService = new SubscriptionService();
