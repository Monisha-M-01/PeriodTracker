import { z } from 'zod';

export const upsertCheckInSchema = z.object({
  body: z.object({
    date: z.string().datetime({ message: "Invalid date format, must be ISO-8601" }),
    mood: z.number().min(1).max(5).optional().nullable(),
    stress: z.number().min(1).max(5).optional().nullable(),
    diet: z.number().min(1).max(5).optional().nullable(),
    note: z.string().max(500).optional().nullable(),
    answers: z.string().optional().nullable(),
    moodString: z.string().optional().nullable(),
    symptoms: z.string().optional().nullable(),
    workouts: z.string().optional().nullable(),
    dietDetails: z.string().optional().nullable(),
    sleepBedtime: z.string().optional().nullable(),
    sleepWakeTime: z.string().optional().nullable(),
    sleepDurationMinutes: z.number().optional().nullable(),
    sleepQuality: z.string().optional().nullable(),
  })
});

export const getCheckInSchema = z.object({
  query: z.object({
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
  })
});
