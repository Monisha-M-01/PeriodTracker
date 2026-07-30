"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenSchema = exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
exports.signupSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(8, 'Password must be at least 8 characters long'),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string(),
    }),
});
exports.refreshTokenSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string(),
    }).optional(),
    body: zod_1.z.object({
        refreshToken: zod_1.z.string().optional(),
    }).optional(),
});
