"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSymptomSchema = exports.logSymptomSchema = void 0;
const zod_1 = require("zod");
const SymptomCategoryEnum = zod_1.z.enum([
    'CRAMPS', 'MOOD', 'FLOW', 'HEADACHE', 'ACNE', 'ENERGY', 'DIGESTION', 'OTHER'
]);
exports.logSymptomSchema = zod_1.z.object({
    body: zod_1.z.object({
        date: zod_1.z.string().datetime(),
        category: SymptomCategoryEnum,
        type: zod_1.z.string().min(1).max(50),
        intensity: zod_1.z.number().min(1).max(5).optional().nullable(),
        value: zod_1.z.string().max(255).optional().nullable(),
        details: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional().nullable(),
        notes: zod_1.z.string().max(500).optional().nullable(),
    }),
});
exports.updateSymptomSchema = zod_1.z.object({
    body: zod_1.z.object({
        date: zod_1.z.string().datetime().optional(),
        category: SymptomCategoryEnum.optional(),
        type: zod_1.z.string().min(1).max(50).optional(),
        intensity: zod_1.z.number().min(1).max(5).optional().nullable(),
        value: zod_1.z.string().max(255).optional().nullable(),
        details: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional().nullable(),
        notes: zod_1.z.string().max(500).optional().nullable(),
    }),
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    })
});
