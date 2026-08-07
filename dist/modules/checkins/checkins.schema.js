"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCheckInSchema = exports.upsertCheckInSchema = void 0;
const zod_1 = require("zod");
exports.upsertCheckInSchema = zod_1.z.object({
    body: zod_1.z.object({
        date: zod_1.z.string().datetime({ message: "Invalid date format, must be ISO-8601" }),
        mood: zod_1.z.number().min(1).max(5).optional().nullable(),
        stress: zod_1.z.number().min(1).max(5).optional().nullable(),
        diet: zod_1.z.number().min(1).max(5).optional().nullable(),
        note: zod_1.z.string().max(500).optional().nullable(),
        answers: zod_1.z.string().optional().nullable(),
        moodString: zod_1.z.string().optional().nullable(),
        symptoms: zod_1.z.string().optional().nullable(),
        workouts: zod_1.z.string().optional().nullable(),
        dietDetails: zod_1.z.string().optional().nullable(),
        sleepBedtime: zod_1.z.string().optional().nullable(),
        sleepWakeTime: zod_1.z.string().optional().nullable(),
        sleepDurationMinutes: zod_1.z.number().optional().nullable(),
        sleepQuality: zod_1.z.string().optional().nullable(),
    })
});
exports.getCheckInSchema = zod_1.z.object({
    query: zod_1.z.object({
        from: zod_1.z.string().datetime().optional(),
        to: zod_1.z.string().datetime().optional(),
    })
});
