import { z } from 'zod';

export const addCompetitorSchema = z.object({
  body: z.object({
    handle: z.string().min(1).max(64),
  }),
});
