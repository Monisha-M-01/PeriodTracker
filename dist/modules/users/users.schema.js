"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettingsSchema = void 0;
const zod_1 = require("zod");
exports.updateSettingsSchema = zod_1.z.object({
    body: zod_1.z.object({
        defaultCycleLength: zod_1.z.number().min(15).max(45).optional(),
        defaultPeriodLength: zod_1.z.number().min(1).max(14).optional(),
        reminderPeriodDaysBefore: zod_1.z.number().min(1).max(7).optional(),
        reminderNotificationsEnabled: zod_1.z.boolean().optional(),
        theme: zod_1.z.string().optional(),
    }),
});
