"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const prisma_1 = require("../../config/prisma");
class UsersService {
    static async getProfile(userId) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                isVerified: true,
                createdAt: true,
                settings: true,
            },
        });
        if (!user) {
            throw { statusCode: 404, message: 'User not found' };
        }
        return user;
    }
    static async updateSettings(userId, data) {
        const settings = await prisma_1.prisma.userSettings.upsert({
            where: { userId },
            update: data,
            create: {
                userId,
                ...data,
            },
        });
        return settings;
    }
}
exports.UsersService = UsersService;
