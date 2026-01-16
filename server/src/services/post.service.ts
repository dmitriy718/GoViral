type Post = Record<string, unknown>;
import { prisma } from '../utils/prisma';
import { subscriptionService } from './subscription.service';
import { userService } from './user.service';
import { AuthenticatedUser } from '../middleware/auth';


interface CreatePostDTO {
    content: string;
    mediaUrl?: string;
    platform?: string;
    scheduledAt?: string;
    projectId?: string;
    // Automation
    autoPlugEnabled?: boolean;
    autoPlugThreshold?: number;
    autoPlugContent?: string;
    autoDmEnabled?: boolean;
    autoDmKeyword?: string;
    autoDmContent?: string;
}

export class PostService {
    async createPost(userPayload: AuthenticatedUser, data: CreatePostDTO): Promise<Post> {
        // 1. Sync User (Ensure they exist in DB first)
        const user = await userService.syncUser(userPayload);

        if (data.projectId) {
            const project = await prisma.project.findFirst({
                where: {
                    id: data.projectId,
                    userId: user.id
                },
                select: { id: true }
            });

            if (!project) {
                throw new Error('Project not found or access denied.');
            }
        }

        // 2. Check Limits
        const { allowed, limit, plan } = await subscriptionService.checkLimit(userPayload.uid, 'posts');
        if (!allowed) {
            throw new Error(`Plan limit reached (${plan}). You have reached the limit of ${limit} posts.`);
        }

        // 3. Create Post
        return prisma.post.create({
            data: {
                content: data.content,
                mediaUrl: data.mediaUrl,
                platform: data.platform || 'twitter',
                scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
                status: data.scheduledAt ? 'SCHEDULED' : 'DRAFT',
                userId: user.id,
                projectId: data.projectId,
                // Automations
                autoPlugEnabled: data.autoPlugEnabled,
                autoPlugThreshold: data.autoPlugThreshold,
                autoPlugContent: data.autoPlugContent,
                autoDmEnabled: data.autoDmEnabled,
                autoDmKeyword: data.autoDmKeyword,
                autoDmContent: data.autoDmContent
            }
        });
    }

    async getPosts(userId: string, limit: number = 50, status?: string): Promise<Post[]> {
        return prisma.post.findMany({
            where: {
                userId,
                ...(status ? { status } : {})
            },
            orderBy: { createdAt: 'desc' },
            take: limit
        });
    }
}

export const postService = new PostService();
