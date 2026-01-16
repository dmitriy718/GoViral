import { z } from 'zod';

export const createPostSchema = z.object({
    body: z.object({
        content: z.string().min(1, "Content cannot be empty").max(10000, "Content too long"),
        mediaUrl: z.string().url().optional().or(z.literal('')),
        platform: z.enum(['twitter', 'linkedin', 'facebook', 'instagram', 'reddit', 'discord']).optional(),
        scheduledAt: z.string().datetime().optional(),
        projectId: z.string().uuid().optional(),
        // Automation
        autoPlugEnabled: z.boolean().optional(),
        autoPlugThreshold: z.number().optional(),
        autoPlugContent: z.string().optional(),
        autoDmEnabled: z.boolean().optional(),
        autoDmKeyword: z.string().optional(),
        autoDmContent: z.string().optional()
    })
});

export const generatePostSchema = z.object({
    body: z.object({
        keywords: z.array(z.string()).optional(), // Optional for repurpose
        tone: z.string().min(1),
        postType: z.string().min(1),
        platform: z.string().optional(),
        includeMedia: z.boolean().optional(),
        generationMode: z.enum(['text', 'image', 'mix', 'repurpose']).optional(),
        sourceContent: z.string().optional()
    }).refine((data) => {
        if (data.generationMode === 'repurpose') {
            return Boolean(data.sourceContent && data.sourceContent.trim());
        }
        return Array.isArray(data.keywords) && data.keywords.length > 0;
    }, {
        message: 'Provide keywords for generation or sourceContent when repurposing.'
    })
});
