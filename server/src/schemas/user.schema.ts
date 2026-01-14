import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    jobTitle: z.string().max(100).optional(),
    avatarUrl: z.string().url().optional(),
  }),
});
