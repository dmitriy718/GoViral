import admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';
import { logger } from '../utils/logger';

dotenv.config();

try {
    let credential;
    const isProduction = process.env.NODE_ENV === 'production';

    // 1. Try environment variable containing JSON string
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        credential = admin.credential.cert(serviceAccount);
    } else {
        // 2. Try looking for file server/config/serviceAccountKey.json
        try {
            credential = admin.credential.cert(path.join(__dirname, 'serviceAccountKey.json'));
        } catch (e) {
            logger.warn("Firebase Service Account file not found in config/serviceAccountKey.json");
        }
    }

    if (credential) {
        admin.initializeApp({
            credential,
        });
        logger.info('Firebase Admin initialized successfully');
    } else {
        logger.warn('Firebase Admin NOT initialized. Missing credentials.');
        if (isProduction) {
            logger.error('Firebase Admin credentials are required in production. Exiting.');
            process.exit(1);
        }
    }

} catch (error) {
    logger.error({ err: error }, 'Firebase Admin initialization error');
    if (process.env.NODE_ENV === 'production') {
        process.exit(1);
    }
}

const allowMockAuth = process.env.ALLOW_MOCK_AUTH === 'true' && (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test');
const notInitialized = async () => {
    throw new Error('Firebase Admin is not initialized. Provide credentials or enable ALLOW_MOCK_AUTH in development/test.');
};

// Safe export that doesn't crash if app not initialized
export const auth = (admin.apps.length > 0) ? admin.auth() : (allowMockAuth ? {
    verifyIdToken: async (token: string) => {
        if (token === 'mock-token') {
            return { uid: '123e4567-e89b-12d3-a456-426614174000', email: 'mock@example.com', name: 'Mock User' };
        }
        throw new Error('Mock auth enabled but token did not match.');
    },
    getUserByEmail: notInitialized,
    updateUser: notInitialized,
    createUser: notInitialized
} : {
    verifyIdToken: notInitialized,
    getUserByEmail: notInitialized,
    updateUser: notInitialized,
    createUser: notInitialized
});
