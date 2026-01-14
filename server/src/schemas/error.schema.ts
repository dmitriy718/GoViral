import { z } from 'zod';

export const reportErrorSchema = z.object({
  body: z.object({
    message: z.string().min(1),
    stack: z.string().optional(),
    url: z.string().url(),
    timestamp: z.string().min(1),
  }),
});
