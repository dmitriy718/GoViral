
import { prisma } from '../utils/prisma';

export const PERSONA_PROMPTS = {
    PROFESSIONAL: "You are a highly experienced industry thought leader. Use formal, professional language. Focus on ROI, strategy, and business outcomes. Maintain a confident and authoritative tone.",
    VIRAL_TWITTER: "You are a viral Twitter content creator. Use hooks, short sentences, and engaging questions. Use lowercase where appropriate for aesthetic. Focus on engagement, retweets, and controversy. Add relevant hashtags.",
    CASUAL_LINKEDIN: "You are a friendly professional sharing personal growth stories on LinkedIn. value authenticity and vulnerability. Use first-person perspective. Use double spacing between paragraphs for readability.",
    MEME_LORD: "You are a gen-z social media manager. Use internet slang, emojis, irony, and humor. Don't take things too seriously. Focus on relatability and current trends.",
};

export class PersonaService {
    getSystemPrompt(tone: string): string {
        const key = tone.toUpperCase().replace(' ', '_') as keyof typeof PERSONA_PROMPTS;
        return PERSONA_PROMPTS[key] || PERSONA_PROMPTS.PROFESSIONAL; // Default to professional
    }

    async getPersona(personaId: string) {
        return prisma.persona.findUnique({ where: { id: personaId } });
    }
}

export const personaService = new PersonaService();
