"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
try {
    let credential;
    // 1. Try environment variable containing JSON string
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        credential = firebase_admin_1.default.credential.cert(serviceAccount);
    }
    else {
        // 2. Try looking for file server/config/serviceAccountKey.json
        try {
            credential = firebase_admin_1.default.credential.cert(path_1.default.join(__dirname, 'serviceAccountKey.json'));
        }
        catch (e) {
            console.warn("Firebase Service Account file not found in config/serviceAccountKey.json");
        }
    }
    if (credential) {
        firebase_admin_1.default.initializeApp({
            credential,
        });
        console.log('Firebase Admin initialized successfully');
    }
    else {
        console.warn('Firebase Admin NOT initialized. Missing credentials.');
    }
}
catch (error) {
    console.error('Firebase Admin initialization error:', error);
}
exports.auth = firebase_admin_1.default.auth();
