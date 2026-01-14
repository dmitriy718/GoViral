import { PrismaClient, User } from '@prisma/client';
import { AuthenticatedUser } from '../middleware/auth';

const prisma = new PrismaClient();

export class UserService {
    async syncUser(userPayload: AuthenticatedUser): Promise<User> {
        return prisma.user.upsert({
            where: { id: userPayload.uid },
            update: {
                email: userPayload.email,
                name: userPayload.name || userPayload.email.split('@')[0],
                avatarUrl: userPayload.picture
            },
            create: {
                id: userPayload.uid,
                email: userPayload.email,
                name: userPayload.name || userPayload.email.split('@')[0],
                avatarUrl: userPayload.picture
            }
        });
    }
    
    async getUser(id: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { id } });
    }
}

export const userService = new UserService();
