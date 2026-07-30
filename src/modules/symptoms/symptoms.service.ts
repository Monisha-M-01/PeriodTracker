import { prisma } from '../../config/prisma';

export class SymptomsService {
  static async logSymptom(userId: string, data: any) {
    return prisma.symptomLog.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  static async getSymptoms(userId: string, limit: number = 50, offset: number = 0) {
    return prisma.symptomLog.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  static async updateSymptom(userId: string, id: string, data: any) {
    const log = await prisma.symptomLog.findUnique({ where: { id } });
    if (!log || log.userId !== userId) {
      throw { statusCode: 404, message: 'Symptom log not found' };
    }

    return prisma.symptomLog.update({
      where: { id },
      data,
    });
  }

  static async deleteSymptom(userId: string, id: string) {
    const log = await prisma.symptomLog.findUnique({ where: { id } });
    if (!log || log.userId !== userId) {
      throw { statusCode: 404, message: 'Symptom log not found' };
    }

    await prisma.symptomLog.delete({ where: { id } });
  }
}
