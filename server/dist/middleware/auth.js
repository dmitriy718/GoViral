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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const firebase_1 = require("../config/firebase");
const logger_1 = require("../utils/logger");
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split('Bearer ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }
        try {
            // Verify the ID token and decode its payload.
            const decodedToken = yield firebase_1.auth.verifyIdToken(token);
            req.user = {
                uid: decodedToken.uid,
                email: decodedToken.email || '',
                name: decodedToken.name,
                picture: decodedToken.picture
            };
            next();
        }
        catch (firebaseError) {
            logger_1.logger.warn({ err: firebaseError }, 'Firebase token verification failed');
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }
    }
    catch (error) {
        logger_1.logger.error({ err: error }, 'Auth middleware error');
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.authenticate = authenticate;
