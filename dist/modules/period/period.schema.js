"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.togglePeriodDaySchema = exports.updatePeriodLogSchema = exports.createPeriodLogSchema = void 0;
const zod_1 = require("zod");
exports.createPeriodLogSchema = zod_1.z.object({
    body: zod_1.z.object({
        startDate: zod_1.z.string().datetime(),
        endDate: zod_1.z.string().datetime().nullable().optional(),
        flowIntensity: zod_1.z.string().optional(),
        notes: zod_1.z.string().max(500).optional(),
    }).refine(data => !data.endDate || new Date(data.startDate) <= new Date(data.endDate), {
        message: "End date must be after start date",
        path: ["endDate"],
    }),
});
exports.updatePeriodLogSchema = zod_1.z.object({
    body: zod_1.z.object({
        startDate: zod_1.z.string().datetime().optional(),
        endDate: zod_1.z.string().datetime().nullable().optional(),
        flowIntensity: zod_1.z.string().optional(),
        notes: zod_1.z.string().max(500).optional(),
    }),
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    })
});
exports.togglePeriodDaySchema = zod_1.z.object({
    body: zod_1.z.object({
        date: zod_1.z.string().datetime(),
        isPeriod: zod_1.z.boolean(),
        flowIntensity: zod_1.z.string().optional(),
    })
});
