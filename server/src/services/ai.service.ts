interface GeneratePostParams {
  keywords: string[];
  tone: string;
  postType: 'text' | 'image' | 'video' | 'poll' | 'link';
  platform: string;
}

interface GeneratedContent {
  content: string;
  hashtags: string[];
  mediaUrl?: string;
  platform: string;
}

export class AIService {
  async generatePost(params: GeneratePostParams): Promise<GeneratedContent[]> {
    // In a real app, this would call OpenAI/Anthropic
    // For this prototype, we simulate high-quality generation
    
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate AI latency

    const baseContent = `Here is a ${params.tone} post about ${params.keywords.join(', ')}.`;
    const cleanKeywords = params.keywords.map(k => k.trim().replace(/\s+/g, ''));
    let hashtags: string[] = [];
    let variations: GeneratedContent[] = [];

    if (params.platform === 'twitter') {
        hashtags = ['#goviral', ...cleanKeywords.slice(0, 2).map(k => `#${k}`)];
        variations = [
            {
                content: `🚀 ${baseContent} #tech`,
                hashtags,
                platform: 'twitter',
            },
            {
                content: `Thinking about ${params.keywords[0]}? Here's my take: ${baseContent}`,
                hashtags,
                platform: 'twitter',
            },
            {
                content: `🧵 Thread: Why ${params.keywords[0]} matters. \n\n1/ ${baseContent}`,
                hashtags,
                platform: 'twitter',
            }
        ];
    } else if (params.platform === 'linkedin') {
        hashtags = ['#Professional', '#Innovation', ...cleanKeywords.map(k => `#${k}`)];
        variations = [
            {
                content: `Excited to share some thoughts on ${params.keywords.join(' and ')}.\n\n${baseContent}\n\nWhat are your experiences with this? Let's connect in the comments! 👇`,
                hashtags,
                platform: 'linkedin',
            },
            {
                content: `💡 Insight of the day: ${baseContent}\n\nAs we navigate the changing landscape of ${params.keywords[0]}, it's crucial to stay ahead.\n\n#Leadership #Growth`,
                hashtags,
                platform: 'linkedin',
            },
            {
                content: `I've been reflecting on ${params.keywords[0]} lately.\n\n${baseContent}\n\nAgree or disagree?`,
                hashtags,
                platform: 'linkedin',
            }
        ];
    } else {
        // Facebook/Default
        hashtags = cleanKeywords.map(k => `#${k}`);
        variations = [
            {
                content: `${baseContent} \n\nTag a friend who needs to see this!`,
                hashtags,
                platform: params.platform,
            },
            {
                content: `Check this out! ${baseContent}`,
                hashtags,
                platform: params.platform,
            },
            {
                content: `Question for you all: ${baseContent}`,
                hashtags,
                platform: params.platform,
            }
        ];
    }

    // Add media if needed
    if (params.postType === 'image') {
        variations = variations.map((v, i) => ({
            ...v,
            mediaUrl: `https://via.placeholder.com/800x400?text=${encodeURIComponent(params.keywords[0])}+${i+1}`
        }));
    }

    return variations;
  }
}

export const aiService = new AIService();
