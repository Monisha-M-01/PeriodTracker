import { z } from 'zod';

export const updateSettingsSchema = z.object({
  body: z.object({
    defaultCycleLength: z.number().min(15).max(45).optional(),
    defaultPeriodLength: z.number().min(1).max(14).optional(),
    reminderPeriodDaysBefore: z.number().min(1).max(7).optional(),
    reminderNotificationsEnabled: z.boolean().optional(),
    theme: z.string().optional(),
    hasCompletedOnboarding: z.boolean().optional(),
    periodStress: z.string().optional().nullable(),
  }),
});
