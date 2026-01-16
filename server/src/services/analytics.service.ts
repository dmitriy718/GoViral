
import { prisma } from '../utils/prisma';
import { env } from '../config/env';

export class AnalyticsService {
    async getDashboardStats(userId: string) {
        // Aggregation logic
        const totalPosts = await prisma.post.count({ where: { userId } });
        const activePersonas = await prisma.persona.count({ where: { userId } });

        // Simulate "Viral Score" and "ROI" based on activity
        // In real app, these would sum 'views' or 'engagement' columns
        const viralScore = totalPosts > 0 ? Math.min(100, 50 + (totalPosts * 2)) : 0;
        const estRoi = totalPosts * 150; // $150 value per post
        const totalReach = totalPosts * 1200; // 1.2k views avg

        return {
            viralScore: Math.round(viralScore),
            estRoi,
            totalReach,
            activePersonas
        };
    }

    async getDetailedReport(userId: string, dateRange: string = '7d') {
        if (env.MOCK_MODE !== 'true') {
            return {
                engagementHistory: [],
                demographics: {},
                topPosts: []
            };
        }
        const posts = await prisma.post.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 5
        });

        // Mock Engagement Data (Daily views/likes over time)
        const engagementHistory = Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            views: Math.floor(Math.random() * 5000) + 1000,
            likes: Math.floor(Math.random() * 500) + 50
        }));

        // Mock Audience Demographics
        const demographics = {
            age: { '18-24': 15, '25-34': 45, '35-44': 30, '45+': 10 },
            locations: { 'USA': 40, 'UK': 20, 'Canada': 15, 'Other': 25 }
        };

        const postPerformance = posts.map((p: { id: string; content: string; platform: string }) => ({
            id: p.id,
            content: p.content.substring(0, 50) + '...',
            platform: p.platform,
            views: Math.floor(Math.random() * 2000),
            likes: Math.floor(Math.random() * 200),
            shares: Math.floor(Math.random() * 50)
        }));

        return {
            engagementHistory,
            demographics,
            topPosts: postPerformance
        };
    }
}

export const analyticsService = new AnalyticsService();
