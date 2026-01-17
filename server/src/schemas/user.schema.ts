import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional().nullable(),
    jobTitle: z.string().max(100).optional().nullable(),
    avatarUrl: z.string().max(500).optional().nullable().or(z.literal('')),
  }),
});

export const verifyEmailSchema = z.object({
  body: z.object({
    token: z.string().min(32, "Invalid token format"),
  }),
});
