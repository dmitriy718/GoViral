import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';
import { logger } from '../utils/logger';

// Define the shape of the decoded Firebase token user
export interface AuthenticatedUser {
    uid: string;
    email: string;
    name?: string;
    picture?: string;
    [key: string]: any; // Allow other firebase claims
}

export interface AuthRequest extends Request {
    user?: AuthenticatedUser;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        try {
            // Verify the ID token and decode its payload.
            const decodedToken = await auth.verifyIdToken(token);
            req.user = {
                uid: decodedToken.uid,
                email: decodedToken.email || '',
                name: decodedToken.name,
                picture: (decodedToken as any).picture
            };
            next();
        } catch (firebaseError) {
            logger.warn({ err: firebaseError }, 'Firebase token verification failed');
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }
    } catch (error) {
        logger.error({ err: error }, 'Auth middleware error');
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
