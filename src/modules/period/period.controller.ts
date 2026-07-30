import { Request, Response, NextFunction } from 'express';
import { PeriodService } from './period.service';
import { sendResponse } from '../../utils/response.util';

export class PeriodController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const log = await PeriodService.createLog(req.user!.userId, req.body);
      sendResponse(res, 201, log);
    } catch (error) {
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      const logs = await PeriodService.getLogs(req.user!.userId, limit, offset);
      sendResponse(res, 200, logs);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const log = await PeriodService.updateLog(req.user!.userId, req.params.id as string, req.body);
      sendResponse(res, 200, log);
    } catch (error) {
      next(error);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await PeriodService.deleteLog(req.user!.userId, req.params.id as string);
      sendResponse(res, 200, { message: 'Period log deleted' });
    } catch (error) {
      next(error);
    }
  }
}
