import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import path from 'path';

// Load env from server directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function testImageGen() {
    console.log('Testing Image Generation...');
    if (!process.env.OPENAI_API_KEY) {
        console.error('ERROR: No API Key found in env');
        return;
    }
    console.log('API Key present (starts with):', process.env.OPENAI_API_KEY.substring(0, 5));

    try {
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: "A cute robot coding on a laptop",
            n: 1,
            size: "1024x1024",
        });
        console.log('Success! URL:', response.data?.[0]?.url);
    } catch (error: any) {
        console.error('Generation Failed:', error.message);
        if (error.code) console.error('Error Code:', error.code);
        if (error.type) console.error('Error Type:', error.type);
    }
}

testImageGen();
