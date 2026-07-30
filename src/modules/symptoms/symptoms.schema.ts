import { z } from 'zod';

const SymptomCategoryEnum = z.enum([
  'CRAMPS', 'MOOD', 'FLOW', 'HEADACHE', 'ACNE', 'ENERGY', 'DIGESTION', 'OTHER'
]);

export const logSymptomSchema = z.object({
  body: z.object({
    date: z.string().datetime(),
    category: SymptomCategoryEnum,
    type: z.string().min(1).max(50),
    intensity: z.number().min(1).max(5).optional().nullable(),
    value: z.string().max(255).optional().nullable(),
    details: z.record(z.string(), z.any()).optional().nullable(),
    notes: z.string().max(500).optional().nullable(),
  }),
});

export const updateSymptomSchema = z.object({
  body: z.object({
    date: z.string().datetime().optional(),
    category: SymptomCategoryEnum.optional(),
    type: z.string().min(1).max(50).optional(),
    intensity: z.number().min(1).max(5).optional().nullable(),
    value: z.string().max(255).optional().nullable(),
    details: z.record(z.string(), z.any()).optional().nullable(),
    notes: z.string().max(500).optional().nullable(),
  }),
  params: z.object({
    id: z.string().uuid(),
  })
});
