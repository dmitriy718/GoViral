import { openai } from '../utils/openai';
import { personaService } from './persona.service';
import { logger } from '../utils/logger';

interface GeneratePostParams {
    keywords: string[];
    tone: string;
    postType: 'text' | 'image' | 'video' | 'poll' | 'link';
    platform: string;
    includeMedia?: boolean;
    generationMode?: 'text' | 'image' | 'mix' | 'repurpose';
    sourceContent?: string;
}

interface AIResponseItem {
    content: string;
    hashtags?: string[];
    imagePrompt?: string; 
    pollOptions?: string[];
}

interface FinalPost {
    content: string;
    hashtags: string[];
    mediaUrl?: string;
    platform: string;
}

export class AIService {
    
    async generatePost(params: GeneratePostParams): Promise<FinalPost[]> {
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('PLACEHOLDER')) {
            return this.generateMock(params);
        }

        try {
            // 1. Generate Text Content
            const textResults = await this.generateTextContent(params);
            const finalPosts: FinalPost[] = [];

            // 2. Process each variation
            for (const item of textResults) {
                let mediaUrl: string | undefined = undefined;

                // Generate image if requested (Sequential to avoid rate limits)
                if (params.includeMedia && item.imagePrompt) {
                    if (finalPosts.length > 0) await new Promise(r => setTimeout(r, 1000));
                    mediaUrl = await this.generateImage(item.imagePrompt);
                }

                finalPosts.push({
                    content: this.formatContent(item, params.postType),
                    hashtags: item.hashtags || [],
                    platform: params.platform,
                    mediaUrl: mediaUrl
                });
            }

            return finalPosts;

        } catch (error: any) {
            logger.error({ err: error }, 'AI generation failed');
            return this.generateMock(params);
        }
    }

    private async generateTextContent(params: GeneratePostParams): Promise<AIResponseItem[]> {
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
        } else {
            userPrompt = `Topic: ${params.keywords.join(', ')}. 
            Type: ${params.postType}. 
            Make each of the 3 variations completely unique in hook and structure.
            ${mediaInstruction}`;
        }

        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
            temperature: 0.9, // Higher temperature for more variety
        });

        const raw = completion.choices[0].message.content || '{}';
        try {
            const parsed = JSON.parse(raw);
            const items = parsed.posts || parsed.variations || [parsed];
            
            return items.map((item: any) => ({
                content: item.content || item.text || item.caption || "Content unavailable",
                hashtags: item.hashtags || [],
                imagePrompt: item.imagePrompt || item.image_prompt,
                pollOptions: item.pollOptions
            }));
        } catch (e) {
            throw new Error('Failed to parse AI response');
        }
    }

    private async generateImage(prompt: string): Promise<string> {
        logger.info('Generating DALL-E 3 image');
        try {
            const response = await openai.images.generate({
                model: "dall-e-3",
                prompt: prompt + ", high quality, professional photography or 3d render, no text",
                n: 1,
                size: "1024x1024",
                quality: "standard",
            });
            return response.data?.[0]?.url || "";
        } catch (error: any) {
            logger.error({ err: error }, 'Image generation failed');
            // Graceful fallback to Unsplash if even DALL-E 3 fails (e.g. safety filter)
            return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop";
        }
    }

    private formatContent(item: AIResponseItem, type: string): string {
        let text = item.content;
        if (type === 'poll' && item.pollOptions) {
            text += '\n\n' + item.pollOptions.map((o, i) => `${i+1}. ${o}`).join('\n');
        }
        return text;
    }

    private async generateMock(params: GeneratePostParams): Promise<FinalPost[]> {
        return [{
            content: `[MOCK] Post about ${params.keywords.join(', ')}.`,
            hashtags: ['#mock'],
            platform: params.platform,
            mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
        }];
    }
}

export const aiService = new AIService();
