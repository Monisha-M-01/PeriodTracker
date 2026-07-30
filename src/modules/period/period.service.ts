import { prisma } from '../../config/prisma';

export class PeriodService {
  static async createLog(userId: string, data: any) {
    // Ensure no overlapping periods (basic validation)
    const existing = await prisma.periodLog.findFirst({
      where: {
        userId,
        startDate: data.startDate,
      },
    });

    if (existing) {
      throw { statusCode: 409, message: 'A period log already exists starting on this date' };
    }

    return prisma.periodLog.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  static async getLogs(userId: string, limit: number = 20, offset: number = 0) {
    return prisma.periodLog.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  static async updateLog(userId: string, id: string, data: any) {
    const log = await prisma.periodLog.findUnique({ where: { id } });
    if (!log || log.userId !== userId) {
      throw { statusCode: 404, message: 'Period log not found' };
    }

    return prisma.periodLog.update({
      where: { id },
      data,
    });
  }

  static async deleteLog(userId: string, id: string) {
    const log = await prisma.periodLog.findUnique({ where: { id } });
    if (!log || log.userId !== userId) {
      throw { statusCode: 404, message: 'Period log not found' };
    }

    await prisma.periodLog.delete({ where: { id } });
  }
}
