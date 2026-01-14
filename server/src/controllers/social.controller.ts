import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import axios from 'axios';
import { subscriptionService } from '../services/subscription.service';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middleware/auth';
import { encrypt } from '../utils/crypto';

const appUrl = process.env.APP_URL || process.env.CLIENT_URL || 'http://localhost:5173';
const normalizedAppUrl = appUrl.replace(/\/$/, '');
const API_URL = process.env.APP_URL
    ? `${normalizedAppUrl}/api`
    : process.env.API_URL || 'http://localhost:5000';
const CLIENT_URL = normalizedAppUrl;

export const connectProvider = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { provider } = req.body;
    
    if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    const userId = req.user.uid; 

    // Ensure user exists locally (safety check)
    // In a perfect world, middleware ensures this, but safe to keep or rely on UserService
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    // Check Subscription Limit
    const { allowed, limit, plan } = await subscriptionService.checkLimit(userId, 'socialAccounts');
    if (!allowed) {
        res.status(403).json({
            error: `Plan limit reached (${plan})`,
            message: `You have reached the limit of ${limit} connected accounts for your ${plan} plan.`
        });
        return;
    }

    const existing = await prisma.socialAccount.findFirst({
        where: { userId: user.id, provider }
    });

    if (existing) {
        res.json({ status: 'connected', account: existing });
        return;
    }

    const account = await prisma.socialAccount.create({
        data: {
            userId: user.id,
            provider,
            platformUserId: `mock-${provider}-${Date.now()}`,
            accessToken: encrypt('mock-access-token'),
            username: `@${user.name?.replace(/\s+/g, '') || 'user'}_${provider}`
        }
    });

    res.json({ status: 'connected', account });
});

export const getConnectedProviders = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        res.json([]);
        return;
    }

    const accounts = await prisma.socialAccount.findMany({
        where: { userId: req.user.uid }
    });

    const sanitized = accounts.map(({ accessToken, refreshToken, ...rest }) => rest);
    res.json(sanitized);
});

// ... (Keep existing OAuth flows as they are complex and might need specific error handling, 
// or refactor them in a separate pass if needed. For now, we improved the main API endpoints)
export const initiateFacebookAuth = async (req: Request, res: Response) => {
    // ... existing implementation
    try {
        const appId = process.env.FACEBOOK_APP_ID;
        const redirectUri = `${API_URL}/api/social/facebook/callback`;
// ...

        if (!appId) {
            return res.status(500).json({ error: 'Missing FACEBOOK_APP_ID in server env' });
        }

        // Scopes:
        // public_profile, email -> distinct to user
        // pages_manage_posts, pages_read_engagement -> essential for the app's purpose
        // pages_show_list -> to list pages
        const scopes = [
            'public_profile',
            'email',
            'pages_manage_posts',
            'pages_read_engagement',
            'pages_show_list'
        ].join(',');

        // Encode user email in state to survive the redirect loop
        const userPayload = (req as any).user;
        const state = Buffer.from(JSON.stringify({ email: userPayload.email })).toString('base64');

        const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scopes}&state=${state}`;

        res.redirect(authUrl);
    } catch (error) {
        console.error('FB Init Error:', error);
        res.status(500).json({ error: 'Failed to initiate Facebook Auth' });
    }
};

export const handleFacebookCallback = async (req: Request, res: Response) => {
    try {
        const { code } = req.query;
        // console.log('FB Callback Code:', code);

        if (!code) {
            return res.status(400).send('No code provided from Facebook');
        }

        const appId = process.env.FACEBOOK_APP_ID;
        const appSecret = process.env.FACEBOOK_APP_SECRET;
        const redirectUri = `${API_URL}/api/social/facebook/callback`;

        if (!appId || !appSecret) {
            return res.status(500).send('Server missing FB ID/Secret');
        }

        // 1. Exchange Code for User Access Token
        const tokenParams = new URLSearchParams({
            client_id: appId,
            client_secret: appSecret,
            redirect_uri: redirectUri,
            code: code as string
        });

        // console.log('Exchanging code for token...');
        const tokenRes = await axios.get(
            `https://graph.facebook.com/v18.0/oauth/access_token?${tokenParams.toString()}`,
            { timeout: 8000 }
        );
        const userAccessToken = tokenRes.data.access_token;

        if (!userAccessToken) {
            return res.status(400).send('Failed to obtain user access token');
        }

        // 2. Get User's Pages
        // We need the Pages to get the PAGE ACCESS TOKEN (Post permission)
        // console.log('Fetching pages...');
        const pagesRes = await axios.get(
            `https://graph.facebook.com/v18.0/me/accounts?access_token=${userAccessToken}`,
            { timeout: 8000 }
        );
        const pages = pagesRes.data.data;

        if (!pages || pages.length === 0) {
            return res.status(400).send('No Facebook Pages found for this user. You must have a Page to use PostDoctor.');
        }

        // For MVP, we just connect the FIRST page found.
        // real implementation would let user choose.
        const targetPage = pages[0];
        const pageAccessToken = targetPage.access_token;
        const pageName = targetPage.name;
        const pageId = targetPage.id;

        // 3. Identify User (PostDoctor User)
        // Decode state
        const stateStr = req.query.state as string;
        if (!stateStr) {
            // Fallback? No, strict security.
            return res.status(400).send('Missing state parameter. Please try again.');
        }

        let userEmail;
        try {
            const decoded = JSON.parse(Buffer.from(stateStr, 'base64').toString('utf-8'));
            userEmail = decoded.email;
        } catch (e) {
            return res.status(400).send('Invalid state parameter');
        }

        const user = await prisma.user.findUnique({ where: { email: userEmail } });
        if (!user) {
            return res.status(404).send('User not found');
        }

        // 4. Save/Update Account
        await prisma.socialAccount.upsert({
            where: {
                provider_platformUserId: {
                    provider: 'facebook',
                    platformUserId: pageId
                }
            },
            update: {
                accessToken: encrypt(pageAccessToken),
                username: pageName,
                updatedAt: new Date()
            },
            create: {
                userId: user.id,
                provider: 'facebook',
                platformUserId: pageId,
                accessToken: encrypt(pageAccessToken),
                username: pageName,
                refreshToken: encrypt(userAccessToken) // Store encrypted
            }
        });

        // 5. Redirect back to Client Settings
        res.redirect(`${CLIENT_URL}/settings?success=facebook_connected`);

    } catch (error) {
        console.error('FB Callback Error:', error);
        // In production, we should not show the raw error to the user
        res.redirect(`${CLIENT_URL}/settings?error=facebook_callback_failed`);
    }
};
