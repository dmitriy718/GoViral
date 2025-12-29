import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';

export interface AuthRequest extends Request {
    user?: any;
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
            req.user = decodedToken;
            next();
        } catch (firebaseError) {
            console.error('Firebase Token Verification Failed:', firebaseError);
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
