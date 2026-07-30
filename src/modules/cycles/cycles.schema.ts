import { z } from 'zod';

export const getPredictionsSchema = z.object({
  query: z.object({
    date: z.string().datetime().optional(), // calculate predictions relative to this date
  }),
});
