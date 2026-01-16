import * as admin from 'firebase-admin';
import * as path from 'path';

async function testAuth() {
    console.log("Testing Firebase Admin Credentials...");

    try {
        const serviceAccountPath = path.join(__dirname, '../config/serviceAccountKey.json');
        console.log(`Loading credentials from: ${serviceAccountPath}`);

        const serviceAccount = require(serviceAccountPath);

        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        }

        console.log("Firebase App Initialized.");

        // Test a read operation - List Users (max 1)
        console.log("Attempting to list users...");
        const listUsersResult = await admin.auth().listUsers(1);
        console.log("Successfully connected to Firebase Auth!");
        console.log(`Found ${listUsersResult.users.length} users in the project.`);

        process.exit(0);
    } catch (error: any) {
        console.error("FAILED to verify credentials.");
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);
        process.exit(1);
    }
}

testAuth();
