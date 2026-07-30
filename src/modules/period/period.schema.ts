import { z } from 'zod';

export const createPeriodLogSchema = z.object({
  body: z.object({
    startDate: z.string().datetime(),
    endDate: z.string().datetime().nullable().optional(),
    flowIntensity: z.string().optional(),
    notes: z.string().max(500).optional(),
  }).refine(data => !data.endDate || new Date(data.startDate) <= new Date(data.endDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  }),
});

export const updatePeriodLogSchema = z.object({
  body: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().nullable().optional(),
    flowIntensity: z.string().optional(),
    notes: z.string().max(500).optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  })
});
