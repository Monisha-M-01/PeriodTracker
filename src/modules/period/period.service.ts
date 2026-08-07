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

  static async getLogs(userId: string, limit: number = 50, offset: number = 0) {
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

  static async togglePeriodDay(userId: string, targetDateStr: string, isPeriod: boolean, flowIntensity?: string) {
    // Standardize to start of day UTC
    const targetDate = new Date(targetDateStr);
    targetDate.setUTCHours(0, 0, 0, 0);

    const prevDay = new Date(targetDate);
    prevDay.setUTCDate(targetDate.getUTCDate() - 1);
    
    const nextDay = new Date(targetDate);
    nextDay.setUTCDate(targetDate.getUTCDate() + 1);

    // Find all period logs for this user to check overlaps/adjacencies
    const allLogs = await prisma.periodLog.findMany({
      where: { userId },
    });

    const targetTime = targetDate.getTime();
    const prevTime = prevDay.getTime();
    const nextTime = nextDay.getTime();

    // Check if target falls within an existing log
    let containingLog = null;
    let leftAdjacentLog = null;
    let rightAdjacentLog = null;

    for (const log of allLogs) {
      const st = new Date(log.startDate).getTime();
      const et = log.endDate ? new Date(log.endDate).getTime() : st;

      if (targetTime >= st && targetTime <= et) {
        containingLog = log;
      }
      if (et === prevTime) {
        leftAdjacentLog = log;
      }
      if (st === nextTime) {
        rightAdjacentLog = log;
      }
    }

    if (isPeriod) {
      if (containingLog) {
        // Just update flow intensity if provided
        if (flowIntensity) {
          return prisma.periodLog.update({
            where: { id: containingLog.id },
            data: { flowIntensity }
          });
        }
        return containingLog; // Already a period
      }

      // We need to add the day. Check merging.
      if (leftAdjacentLog && rightAdjacentLog) {
        // Merge them
        const updated = await prisma.periodLog.update({
          where: { id: leftAdjacentLog.id },
          data: { endDate: rightAdjacentLog.endDate || rightAdjacentLog.startDate }
        });
        await prisma.periodLog.delete({ where: { id: rightAdjacentLog.id } });
        return updated;
      } else if (leftAdjacentLog) {
        // Extend left log rightward
        return prisma.periodLog.update({
          where: { id: leftAdjacentLog.id },
          data: { endDate: targetDate }
        });
      } else if (rightAdjacentLog) {
        // Extend right log leftward
        return prisma.periodLog.update({
          where: { id: rightAdjacentLog.id },
          data: { startDate: targetDate }
        });
      } else {
        // Create new standalone day
        return prisma.periodLog.create({
          data: {
            userId,
            startDate: targetDate,
            endDate: targetDate,
            flowIntensity: flowIntensity || 'Medium'
          }
        });
      }
    } else {
      // isPeriod === false
      if (!containingLog) {
        return null; // Not a period day anyway
      }

      const st = new Date(containingLog.startDate).getTime();
      const et = containingLog.endDate ? new Date(containingLog.endDate).getTime() : st;

      if (st === targetTime && et === targetTime) {
        // Only one day in the log, delete it
        await prisma.periodLog.delete({ where: { id: containingLog.id } });
        return null;
      } else if (st === targetTime) {
        // Remove start day
        return prisma.periodLog.update({
          where: { id: containingLog.id },
          data: { startDate: nextDay }
        });
      } else if (et === targetTime) {
        // Remove end day
        return prisma.periodLog.update({
          where: { id: containingLog.id },
          data: { endDate: prevDay }
        });
      } else {
        // Split in the middle
        await prisma.periodLog.update({
          where: { id: containingLog.id },
          data: { endDate: prevDay }
        });
        return prisma.periodLog.create({
          data: {
            userId,
            startDate: nextDay,
            endDate: new Date(et),
            flowIntensity: containingLog.flowIntensity
          }
        });
      }
    }
  }
}
