"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPredictionsSchema = void 0;
const zod_1 = require("zod");
exports.getPredictionsSchema = zod_1.z.object({
    query: zod_1.z.object({
        date: zod_1.z.string().datetime().optional(), // calculate predictions relative to this date
    }),
});
