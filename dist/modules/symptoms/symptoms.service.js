"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymptomsService = void 0;
const prisma_1 = require("../../config/prisma");
class SymptomsService {
    static async logSymptom(userId, data) {
        return prisma_1.prisma.symptomLog.create({
            data: {
                userId,
                ...data,
            },
        });
    }
    static async getSymptoms(userId, limit = 50, offset = 0) {
        return prisma_1.prisma.symptomLog.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
            take: limit,
            skip: offset,
        });
    }
    static async updateSymptom(userId, id, data) {
        const log = await prisma_1.prisma.symptomLog.findUnique({ where: { id } });
        if (!log || log.userId !== userId) {
            throw { statusCode: 404, message: 'Symptom log not found' };
        }
        return prisma_1.prisma.symptomLog.update({
            where: { id },
            data,
        });
    }
    static async deleteSymptom(userId, id) {
        const log = await prisma_1.prisma.symptomLog.findUnique({ where: { id } });
        if (!log || log.userId !== userId) {
            throw { statusCode: 404, message: 'Symptom log not found' };
        }
        await prisma_1.prisma.symptomLog.delete({ where: { id } });
    }
}
exports.SymptomsService = SymptomsService;
