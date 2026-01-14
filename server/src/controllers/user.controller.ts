import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middleware/auth';


export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const firebaseUser = req.user;
        if (!firebaseUser || !firebaseUser.email) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Find or create user based on Firebase email
        let user = await prisma.user.findUnique({
            where: { email: firebaseUser.email }
        });

        if (!user) {
            // Auto-create user if they exist in Firebase but not in our DB
            user = await prisma.user.create({
                data: {
                    id: firebaseUser.uid, // Explicitly use Firebase UID
                    email: firebaseUser.email,
                    name: firebaseUser.name || firebaseUser.email.split('@')[0],
                }
            });
        }

        res.json(user);
    } catch (error) {
        logger.error({ err: error }, 'Get profile error');
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const firebaseUser = req.user;
        const { name, jobTitle, avatarUrl } = req.body;

        if (!firebaseUser || !firebaseUser.email) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = await prisma.user.update({
            where: { email: firebaseUser.email },
            data: {
                name,
                jobTitle,
                avatarUrl
            }
        });

        res.json(user);
    } catch (error) {
        logger.error({ err: error }, 'Update profile error');
        res.status(500).json({ error: 'Failed to update profile' });
    }
};
