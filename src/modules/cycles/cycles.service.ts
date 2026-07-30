import { prisma } from '../../config/prisma';

export class CyclesService {
  static async getCyclePredictions(userId: string, relativeDateStr?: string) {
    const relativeDate = relativeDateStr ? new Date(relativeDateStr) : new Date();

    const [settings, recentPeriods] = await Promise.all([
      prisma.userSettings.findUnique({ where: { userId } }),
      prisma.periodLog.findMany({
        where: { userId, startDate: { lte: relativeDate } },
        orderBy: { startDate: 'desc' },
        take: 6, // Use last 6 periods for average
      }),
    ]);

    const defaultCycleLength = settings?.defaultCycleLength || 28;
    const defaultPeriodLength = settings?.defaultPeriodLength || 5;

    if (recentPeriods.length === 0) {
      return {
        message: 'Not enough data to calculate predictions',
        predictions: null,
      };
    }

    // Calculate averages if we have more than 1 period
    let avgCycleLength = defaultCycleLength;
    let avgPeriodLength = defaultPeriodLength;

    if (recentPeriods.length > 1) {
      let totalCycleDays = 0;
      let validCycles = 0;
      let totalPeriodDays = 0;
      let validPeriods = 0;

      for (let i = 0; i < recentPeriods.length - 1; i++) {
        const current = recentPeriods[i];
        const previous = recentPeriods[i + 1];
        
        // Difference in days between start dates
        const diffTime = Math.abs(current.startDate.getTime() - previous.startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays >= 15 && diffDays <= 45) { // Sanity check for valid cycle lengths
          totalCycleDays += diffDays;
          validCycles++;
        }

        if (previous.endDate) {
          const periodTime = Math.abs(previous.endDate.getTime() - previous.startDate.getTime());
          const pDays = Math.ceil(periodTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive
          if (pDays > 0 && pDays <= 14) {
            totalPeriodDays += pDays;
            validPeriods++;
          }
        }
      }

      if (validCycles > 0) avgCycleLength = Math.round(totalCycleDays / validCycles);
      if (validPeriods > 0) avgPeriodLength = Math.round(totalPeriodDays / validPeriods);
    } else {
      // Just one period, check its length if it has an end date
      const p = recentPeriods[0];
      if (p.endDate) {
        const periodTime = Math.abs(p.endDate.getTime() - p.startDate.getTime());
        const pDays = Math.ceil(periodTime / (1000 * 60 * 60 * 24)) + 1;
        if (pDays > 0 && pDays <= 14) avgPeriodLength = pDays;
      }
    }

    const lastPeriod = recentPeriods[0];
    const nextPeriodStart = new Date(lastPeriod.startDate);
    nextPeriodStart.setDate(nextPeriodStart.getDate() + avgCycleLength);

    const nextPeriodEnd = new Date(nextPeriodStart);
    nextPeriodEnd.setDate(nextPeriodEnd.getDate() + avgPeriodLength - 1);

    // Fertile window typically 14 days before next period start, +/- 2 days
    const ovulationDate = new Date(nextPeriodStart);
    ovulationDate.setDate(ovulationDate.getDate() - 14);

    const fertileWindowStart = new Date(ovulationDate);
    fertileWindowStart.setDate(fertileWindowStart.getDate() - 3);

    const fertileWindowEnd = new Date(ovulationDate);
    fertileWindowEnd.setDate(fertileWindowEnd.getDate() + 1);

    return {
      history: {
        avgCycleLength,
        avgPeriodLength,
        lastPeriodStartDate: lastPeriod.startDate,
      },
      predictions: {
        nextPeriodStart,
        nextPeriodEnd,
        ovulationDate,
        fertileWindowStart,
        fertileWindowEnd,
      },
    };
  }
}
