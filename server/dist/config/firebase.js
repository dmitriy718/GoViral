"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("../utils/logger");
dotenv_1.default.config();
try {
    let credential;
    const isProduction = process.env.NODE_ENV === 'production';
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
            logger_1.logger.warn("Firebase Service Account file not found in config/serviceAccountKey.json");
        }
    }
    if (credential) {
        firebase_admin_1.default.initializeApp({
            credential,
        });
        logger_1.logger.info('Firebase Admin initialized successfully');
    }
    else {
        logger_1.logger.warn('Firebase Admin NOT initialized. Missing credentials.');
        if (isProduction) {
            logger_1.logger.error('Firebase Admin credentials are required in production. Exiting.');
            process.exit(1);
        }
    }
}
catch (error) {
    logger_1.logger.error({ err: error }, 'Firebase Admin initialization error');
    if (process.env.NODE_ENV === 'production') {
        process.exit(1);
    }
}
const allowMockAuth = process.env.ALLOW_MOCK_AUTH === 'true' && process.env.NODE_ENV !== 'production';
const notInitialized = () => __awaiter(void 0, void 0, void 0, function* () {
    throw new Error('Firebase Admin is not initialized. Provide credentials or enable ALLOW_MOCK_AUTH in non-production.');
});
// Safe export that doesn't crash if app not initialized
exports.auth = (firebase_admin_1.default.apps.length > 0) ? firebase_admin_1.default.auth() : (allowMockAuth ? {
    verifyIdToken: (token) => __awaiter(void 0, void 0, void 0, function* () {
        if (token === 'mock-token') {
            return { uid: '123e4567-e89b-12d3-a456-426614174000', email: 'mock@example.com', name: 'Mock User' };
        }
        throw new Error('Mock auth enabled but token did not match.');
    }),
    getUserByEmail: notInitialized,
    updateUser: notInitialized,
    createUser: notInitialized
} : {
    verifyIdToken: notInitialized,
    getUserByEmail: notInitialized,
    updateUser: notInitialized,
    createUser: notInitialized
});
