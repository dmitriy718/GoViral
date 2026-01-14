
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { logger } from './logger';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

logger.info('[OpenAI] Initializing client...');
if (!apiKey) {
    logger.error('[OpenAI] CRITICAL: OPENAI_API_KEY is missing from env.');
} else if (apiKey.startsWith('sk-PLACEHOLDER')) {
    logger.warn('[OpenAI] WARNING: Key is a placeholder.');
}

export const openai = new OpenAI({
    apiKey: apiKey || 'dummy-key',
});
