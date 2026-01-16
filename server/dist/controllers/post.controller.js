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
const ai_service_1 = require("../services/ai.service");
const post_service_1 = require("../services/post.service");
const asyncHandler_1 = require("../utils/asyncHandler");
const subscription_service_1 = require("../services/subscription.service");
const user_service_1 = require("../services/user.service");
const prisma_1 = require("../utils/prisma");
exports.generatePost = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const { keywords, tone, postType, platform, includeMedia } = req.body;
    yield user_service_1.userService.syncUser(req.user);
    const { allowed, limit, plan } = yield subscription_service_1.subscriptionService.checkLimit(req.user.uid, 'aiGenerations');
    if (!allowed) {
        res.status(403).json({
            error: `Plan limit reached (${plan})`,
            message: `You have reached the limit of ${limit} AI generations for your ${plan} plan.`
        });
        return;
    }
    const suggestions = yield ai_service_1.aiService.generatePost({
        keywords,
        tone,
        postType,
        platform: platform || 'twitter',
        includeMedia,
        generationMode: req.body.generationMode || 'mix'
    });
    yield prisma_1.prisma.aiGeneration.create({
        data: {
            userId: req.user.uid
        }
    });
    res.json({ suggestions });
}));
exports.createPost = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const post = yield post_service_1.postService.createPost(req.user, req.body);
        res.json(post);
    }
    catch (error) {
        // Handle service-level errors (like limits)
        if (error.message.includes('Plan limit')) {
            res.status(403).json({ error: error.message });
            return;
        }
        if (error.message.includes('Project not found')) {
            res.status(403).json({ error: error.message });
            return;
        }
        throw error;
    }
}));
exports.getPosts = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const limitParam = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;
    const statusParam = Array.isArray(req.query.status) ? req.query.status[0] : req.query.status;
    const limit = limitParam ? Math.min(parseInt(String(limitParam), 10) || 50, 200) : 50;
    const status = statusParam ? String(statusParam).toUpperCase() : undefined;
    const posts = yield post_service_1.postService.getPosts(req.user.uid, limit, status);
    res.json(posts);
}));
