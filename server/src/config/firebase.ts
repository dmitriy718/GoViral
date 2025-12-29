import admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

try {
    let credential;

    // 1. Try environment variable containing JSON string
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        credential = admin.credential.cert(serviceAccount);
    } else {
        // 2. Try looking for file server/config/serviceAccountKey.json
        try {
            credential = admin.credential.cert(path.join(__dirname, 'serviceAccountKey.json'));
        } catch (e) {
            console.warn("Firebase Service Account file not found in config/serviceAccountKey.json");
        }
    }

    if (credential) {
        admin.initializeApp({
            credential,
        });
        console.log('Firebase Admin initialized successfully');
    } else {
        console.warn('Firebase Admin NOT initialized. Missing credentials.');
    }

} catch (error) {
    console.error('Firebase Admin initialization error:', error);
}

export const auth = admin.auth();
