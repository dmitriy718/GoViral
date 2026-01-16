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
exports.aiService = exports.AIService = void 0;
const openai_1 = require("../utils/openai");
const logger_1 = require("../utils/logger");
class AIService {
    generatePost(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('PLACEHOLDER')) {
                return this.generateMock(params);
            }
            try {
                // 1. Generate Text Content
                const textResults = yield this.generateTextContent(params);
                const finalPosts = [];
                // 2. Process each variation
                for (const item of textResults) {
                    let mediaUrl = undefined;
                    // Generate image if requested (Sequential to avoid rate limits)
                    if (params.includeMedia && item.imagePrompt) {
                        if (finalPosts.length > 0)
                            yield new Promise(r => setTimeout(r, 1000));
                        mediaUrl = yield this.generateImage(item.imagePrompt);
                    }
                    finalPosts.push({
                        content: this.formatContent(item, params.postType),
                        hashtags: item.hashtags || [],
                        platform: params.platform,
                        mediaUrl: mediaUrl
                    });
                }
                return finalPosts;
            }
            catch (error) {
                logger_1.logger.error({ err: error }, 'AI generation failed');
                return this.generateMock(params);
            }
        });
    }
    generateTextContent(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const systemPrompt = `
        You are an expert Social Media Strategist.
        Generate a JSON object with a "posts" array containing 3 DISTINCT variations.
        Each variation MUST take a different angle or perspective on the topic.
        Tone: ${params.tone}
        Platform: ${params.platform}
        `;
            let userPrompt = '';
            const mediaInstruction = (params.includeMedia || params.postType === 'image')
                ? 'For EACH post, include a detailed "imagePrompt" field for DALL-E 3.'
                : '';
            if (params.generationMode === 'repurpose' && params.sourceContent) {
                userPrompt = `Repurpose this: "${params.sourceContent}". 
            Variation 1: Educational Insight. 
            Variation 2: Contrarian/Surprising Perspective. 
            Variation 3: Question/Poll-style. 
            ${mediaInstruction}`;
            }
            else {
                userPrompt = `Topic: ${params.keywords.join(', ')}. 
            Type: ${params.postType}. 
            Make each of the 3 variations completely unique in hook and structure.
            ${mediaInstruction}`;
            }
            const completion = yield openai_1.openai.chat.completions.create({
                messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
                model: "gpt-4o-mini",
                response_format: { type: "json_object" },
                temperature: 0.9, // Higher temperature for more variety
            });
            const raw = completion.choices[0].message.content || '{}';
            try {
                const parsed = JSON.parse(raw);
                const items = parsed.posts || parsed.variations || [parsed];
                return items.map((item) => ({
                    content: item.content || item.text || item.caption || "Content unavailable",
                    hashtags: item.hashtags || [],
                    imagePrompt: item.imagePrompt || item.image_prompt,
                    pollOptions: item.pollOptions
                }));
            }
            catch (e) {
                throw new Error('Failed to parse AI response');
            }
        });
    }
    generateImage(prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            logger_1.logger.info('Generating DALL-E 3 image');
            try {
                const response = yield openai_1.openai.images.generate({
                    model: "dall-e-3",
                    prompt: prompt + ", high quality, professional photography or 3d render, no text",
                    n: 1,
                    size: "1024x1024",
                    quality: "standard",
                });
                return ((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.url) || "";
            }
            catch (error) {
                logger_1.logger.error({ err: error }, 'Image generation failed');
                // Graceful fallback to Unsplash if even DALL-E 3 fails (e.g. safety filter)
                return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop";
            }
        });
    }
    formatContent(item, type) {
        let text = item.content;
        if (type === 'poll' && item.pollOptions) {
            text += '\n\n' + item.pollOptions.map((o, i) => `${i + 1}. ${o}`).join('\n');
        }
        return text;
    }
    generateMock(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return [{
                    content: `[MOCK] Post about ${params.keywords.join(', ')}.`,
                    hashtags: ['#mock'],
                    platform: params.platform,
                    mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
                }];
        });
    }
}
exports.AIService = AIService;
exports.aiService = new AIService();
