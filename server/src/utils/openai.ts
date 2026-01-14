
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

console.log('[OpenAI] Initializing client...');
if (!apiKey) {
    console.error('[OpenAI] CRITICAL: OPENAI_API_KEY is missing from env.');
} else if (apiKey.startsWith('sk-PLACEHOLDER')) {
    console.warn('[OpenAI] WARNING: Key is a placeholder.');
}

export const openai = new OpenAI({
    apiKey: apiKey || 'dummy-key',
});
