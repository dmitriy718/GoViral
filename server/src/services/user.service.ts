import { AuthenticatedUser } from '../middleware/auth';
import { prisma } from '../utils/prisma';
import { emailService } from './email.service';
import crypto from 'crypto';
import { logger } from '../utils/logger';

export class UserService {
    async syncUser(userPayload: AuthenticatedUser) {
        const existingUser = await prisma.user.findUnique({
            where: { id: userPayload.uid }
        });

        if (!existingUser) {
            const verificationToken = crypto.randomBytes(32).toString('hex');
            const newUser = await prisma.user.create({
                data: {
                    id: userPayload.uid,
                    email: userPayload.email,
                    name: userPayload.name || userPayload.email.split('@')[0],
                    avatarUrl: userPayload.picture,
                    verificationToken,
                    emailVerified: false
                }
            });

            try {
                const name = newUser.name || newUser.email.split('@')[0];
                await emailService.sendWelcomeEmail(newUser.email, name);
                await emailService.sendVerificationEmail(newUser.email, verificationToken);
                logger.info({ email: newUser.email }, 'Welcome and verification emails sent to new user');
            } catch (error) {
                logger.error({ err: error }, 'Failed to send verification email during sync');
            }
            return newUser;
        }

        return prisma.user.update({
            where: { id: userPayload.uid },
            data: {
                email: userPayload.email,
                name: userPayload.name || userPayload.email.split('@')[0],
                avatarUrl: userPayload.picture
            }
        });
    }
    
    async getUser(id: string) {
        return prisma.user.findUnique({ where: { id } });
    }
}

export const userService = new UserService();
