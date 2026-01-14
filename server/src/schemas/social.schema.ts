import { z } from 'zod';

export const connectProviderSchema = z.object({
  body: z.object({
    provider: z.enum(['twitter', 'linkedin', 'facebook', 'instagram', 'reddit', 'discord']),
  }),
});
