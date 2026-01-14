import { z } from 'zod';

export const getDetailedReportSchema = z.object({
  query: z.object({
    range: z.string().optional(),
  }),
});
