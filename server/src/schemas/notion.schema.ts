import { z } from 'zod';

export const connectNotionSchema = z.object({
  body: z.object({
    databaseId: z.string().min(1),
    accessToken: z.string().min(1),
  }),
});
