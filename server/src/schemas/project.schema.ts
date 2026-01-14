import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    platforms: z.array(z.string().min(1)).min(1),
  }),
});
