"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeriodService = void 0;
const prisma_1 = require("../../config/prisma");
class PeriodService {
    static async createLog(userId, data) {
        // Ensure no overlapping periods (basic validation)
        const existing = await prisma_1.prisma.periodLog.findFirst({
            where: {
                userId,
                startDate: data.startDate,
            },
        });
        if (existing) {
            throw { statusCode: 409, message: 'A period log already exists starting on this date' };
        }
        return prisma_1.prisma.periodLog.create({
            data: {
                userId,
                ...data,
            },
        });
    }
    static async getLogs(userId, limit = 20, offset = 0) {
        return prisma_1.prisma.periodLog.findMany({
            where: { userId },
            orderBy: { startDate: 'desc' },
            take: limit,
            skip: offset,
        });
    }
    static async updateLog(userId, id, data) {
        const log = await prisma_1.prisma.periodLog.findUnique({ where: { id } });
        if (!log || log.userId !== userId) {
            throw { statusCode: 404, message: 'Period log not found' };
        }
        return prisma_1.prisma.periodLog.update({
            where: { id },
            data,
        });
    }
    static async deleteLog(userId, id) {
        const log = await prisma_1.prisma.periodLog.findUnique({ where: { id } });
        if (!log || log.userId !== userId) {
            throw { statusCode: 404, message: 'Period log not found' };
        }
        await prisma_1.prisma.periodLog.delete({ where: { id } });
    }
}
exports.PeriodService = PeriodService;
