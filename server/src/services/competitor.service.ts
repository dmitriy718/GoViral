import { prisma } from '../utils/prisma';

export class CompetitorService {
    
    async addCompetitor(userId: string, handle: string) {
        return prisma.competitor.create({
            data: {
                userId,
                handle,
                status: 'Analyzing...'
            }
        });
    }

    async analyze(competitorId: string) {
        console.log('[Competitor] Analyzing:', competitorId);
        
        const competitor = await prisma.competitor.findUnique({ where: { id: competitorId } });
        if (!competitor) throw new Error('Competitor not found');

        // Mock Analysis Logic
        const mockAnalysis = {
            bestTime: '09:00 AM EST',
            topHashtags: ['#growth', '#saas', '#tech'],
            heatmap: Array.from({ length: 7 }, () => Math.floor(Math.random() * 10)), // 7 days of activity
            engagementRate: '4.2%'
        };

        await prisma.competitor.update({
            where: { id: competitorId },
            data: {
                status: 'Active',
                lastPost: '2 hours ago',
                analysis: JSON.stringify(mockAnalysis)
            }
        });

        return mockAnalysis;
    }

    async getCompetitors(userId: string) {
        const comps = await prisma.competitor.findMany({ where: { userId } });
        
        // Parse analysis JSON for frontend
        return comps.map(c => ({
            ...c,
            analysis: c.analysis ? JSON.parse(c.analysis) : null
        }));
    }
}

export const competitorService = new CompetitorService();
