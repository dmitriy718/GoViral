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
exports.getPosts = exports.createPost = exports.generatePost = void 0;
const client_1 = require("@prisma/client");
const ai_service_1 = require("../services/ai.service");
const prisma = new client_1.PrismaClient();
const generatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { keywords, tone, postType, platform } = req.body;
        if (!keywords || !tone || !postType) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const suggestions = yield ai_service_1.aiService.generatePost({
            keywords,
            tone,
            postType,
            platform: platform || 'twitter'
        });
        res.json({ suggestions });
    }
    catch (error) {
        console.error('Generation error:', error);
        res.status(500).json({ error: 'Failed to generate content' });
    }
});
exports.generatePost = generatePost;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content, mediaUrl, platform, scheduledAt } = req.body;
        const userPayload = req.user; // Attached by auth middleware
        // Sync user to local DB
        let user = yield prisma.user.findUnique({
            where: { email: userPayload.email }
        });
        if (!user) {
            user = yield prisma.user.create({
                data: {
                    id: userPayload.uid, // Use Firebase UID as primary key if possible, or keep UUID and map it. 
                    // Actually schema has UUID default. Let's keep UUID for internal and store firebaseId? 
                    // Schema not updated for firebaseId. Let's used email as unique identifier for now and create.
                    email: userPayload.email,
                    password: 'firebase_oauth_user', // Placeholder
                    name: userPayload.name || userPayload.email.split('@')[0]
                }
            });
        }
        const post = yield prisma.post.create({
            data: {
                content,
                mediaUrl,
                platform: platform || 'twitter',
                scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
                status: scheduledAt ? 'SCHEDULED' : 'DRAFT',
                userId: user.id
            }
        });
        res.json(post);
    }
    catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ error: 'Failed to create post' });
    }
});
exports.createPost = createPost;
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield prisma.post.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(posts);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});
exports.getPosts = getPosts;
