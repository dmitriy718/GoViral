import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().optional(), // Optional for now as we use SQLite file
  OPENAI_API_KEY: z.string().min(1, "OpenAI API Key is required"),
  CLIENT_URL: z.string().optional(),
  CORS_ORIGIN: z.string().optional(),
  ENCRYPTION_KEY: z.string().optional(),
  MOCK_MODE: z.string().optional(),
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_SERVICE_ACCOUNT: z.string().optional(),
  ALLOW_MOCK_AUTH: z.string().optional(),
  // Add other critical keys here
});

const parseEnv = () => {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.format());
    process.exit(1);
  }

  return parsed.data;
};

export const env = parseEnv();
