import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma';
import { sendResponse } from '../../utils/response.util';

export class CheckInsController {
  static async upsert(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.user!;
      const { date, mood, stress, diet, note, answers, moodString, symptoms, workouts, dietDetails } = req.body;
      
      // We store just the date part for uniqueness (ignore time)
      const dateOnly = new Date(date);
      dateOnly.setUTCHours(0, 0, 0, 0);

      const checkIn = await prisma.dailyCheckIn.upsert({
        where: {
          userId_date: {
            userId,
            date: dateOnly
          }
        },
        update: {
          mood, stress, diet, note, answers,
          moodString, symptoms, workouts, dietDetails
        },
        create: {
          userId,
          date: dateOnly,
          mood, stress, diet, note, answers,
          moodString, symptoms, workouts, dietDetails
        }
      });

      return sendResponse(res, 200, checkIn);
    } catch (error) {
      next(error);
    }
  }

  static async getToday(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.user!;
      
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      const checkIn = await prisma.dailyCheckIn.findUnique({
        where: {
          userId_date: {
            userId,
            date: today
          }
        }
      });

      return sendResponse(res, 200, checkIn);
    } catch (error) {
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.user!;
      const { from, to } = req.query;

      let dateFilter: any = {};
      if (from) dateFilter.gte = new Date(from as string);
      if (to) dateFilter.lte = new Date(to as string);

      const checkIns = await prisma.dailyCheckIn.findMany({
        where: {
          userId,
          ...(Object.keys(dateFilter).length > 0 && { date: dateFilter })
        },
        orderBy: {
          date: 'desc'
        }
      });

      return sendResponse(res, 200, checkIns);
    } catch (error) {
      next(error);
    }
  }
}
