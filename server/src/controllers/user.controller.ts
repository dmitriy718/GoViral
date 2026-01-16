import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middleware/auth';
import { emailService } from '../services/email.service';
import crypto from 'crypto';

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const firebaseUser = req.user;
        logger.info({ firebaseUser }, 'getProfile requested');
        if (!firebaseUser || !firebaseUser.email) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Find or create user based on Firebase email
        let user = await prisma.user.findUnique({
            where: { email: firebaseUser.email }
        });

        logger.info({ userFound: !!user }, 'User search result');

        if (!user) {
            logger.info({ email: firebaseUser.email }, 'Creating new user');
            const verificationToken = crypto.randomBytes(32).toString('hex');
            
            // Auto-create user if they exist in Firebase but not in our DB
            user = await prisma.user.create({
                data: {
                    id: firebaseUser.uid, // Explicitly use Firebase UID
                    email: firebaseUser.email,
                    name: firebaseUser.name || firebaseUser.email.split('@')[0],
                    verificationToken,
                    emailVerified: false
                }
            });
            logger.info({ userId: user.id }, 'New user created');

            // Send verification email
            try {
                logger.info({ email: user.email }, 'Sending verification email');
                await emailService.sendVerificationEmail(user.email, verificationToken);
                logger.info('Verification email sent successfully');
            } catch (emailError) {
                logger.error({ err: emailError }, 'Failed to send initial verification email');
                // Don't fail the request, user can resend later
            }
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

export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ error: 'Verification token is required' });
        }

        const user = await prisma.user.findUnique({
            where: { verificationToken: token }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired verification token' });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                verificationToken: null
            }
        });

        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        logger.error({ err: error }, 'Verify email error');
        res.status(500).json({ error: 'Failed to verify email' });
    }
};

export const resendVerificationEmail = async (req: AuthRequest, res: Response) => {
    try {
        const firebaseUser = req.user;
        if (!firebaseUser || !firebaseUser.email) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = await prisma.user.findUnique({
            where: { email: firebaseUser.email }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.emailVerified) {
            return res.status(400).json({ error: 'Email is already verified' });
        }

        const verificationToken = crypto.randomBytes(32).toString('hex');

        await prisma.user.update({
            where: { id: user.id },
            data: { verificationToken }
        });

        await emailService.sendVerificationEmail(user.email, verificationToken);

        res.json({ message: 'Verification email sent' });
    } catch (error) {
        logger.error({ err: error }, 'Resend verification email error');
        res.status(500).json({ error: 'Failed to resend verification email' });
    }
};