import { Integration } from '@prisma/client';
import { prisma } from '../utils/prisma';
import { encrypt, decrypt } from '../utils/crypto';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export class NotionService {
    
    async connect(userId: string, config: { databaseId: string, accessToken: string }) {
        // In real app: Verify with Notion API first
        logger.info({ databaseId: config.databaseId }, 'Notion connect');

        return prisma.integration.upsert({
            where: {
                userId_type: {
                    userId,
                    type: 'NOTION'
                }
            },
            update: {
                config: encrypt(JSON.stringify(config)),
                updatedAt: new Date()
            },
            create: {
                userId,
                type: 'NOTION',
                config: encrypt(JSON.stringify(config))
            }
        });
    }

    async sync(userId: string) {
        logger.info({ userId }, 'Notion sync');

        const integration = await prisma.integration.findUnique({
            where: {
                userId_type: {
                    userId,
                    type: 'NOTION'
                }
            }
        });

        if (!integration) throw new Error('Notion not connected');

        const rawConfig = decrypt(integration.config);
        const config = JSON.parse(rawConfig);

        if (env.MOCK_MODE !== 'true') {
            // Real Notion sync not implemented yet
            await prisma.integration.update({
                where: { id: integration.id },
                data: { lastSyncedAt: new Date() }
            });
            return { synced: 0 };
        }
        
        // Mock Notion API Response
        const mockNotionPages = [
            {
                id: 'page-1',
                title: '5 Ways to Use AI in 2026',
                status: 'Ready',
                platform: 'Twitter'
            },
            {
                id: 'page-2',
                title: 'Q1 Launch Strategy',
                status: 'Draft',
                platform: 'LinkedIn'
            }
        ];

        // Process Sync
        let syncedCount = 0;
        for (const page of mockNotionPages) {
            if (page.status === 'Ready') {
                // Create draft in PostDoctor
                // Check if already exists? (Skip for MVP simplicity)
                await prisma.post.create({
                    data: {
                        userId,
                        content: `${page.title}\n\n(Imported from Notion)`,
                        platform: page.platform.toLowerCase(),
                        status: 'DRAFT',
                        options: JSON.stringify({ notionId: page.id })
                    }
                });
                syncedCount++;
            }
        }

        await prisma.integration.update({
            where: { id: integration.id },
            data: { lastSyncedAt: new Date() }
        });

        return { synced: syncedCount };
    }
}

export const notionService = new NotionService();
