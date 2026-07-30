import { Request, Response, NextFunction } from 'express';
import { SymptomsService } from './symptoms.service';
import { sendResponse } from '../../utils/response.util';

export class SymptomsController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const log = await SymptomsService.logSymptom(req.user!.userId, req.body);
      sendResponse(res, 201, log);
    } catch (error) {
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const logs = await SymptomsService.getSymptoms(req.user!.userId, limit, offset);
      sendResponse(res, 200, logs);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const log = await SymptomsService.updateSymptom(req.user!.userId, req.params.id as string, req.body);
      sendResponse(res, 200, log);
    } catch (error) {
      next(error);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await SymptomsService.deleteSymptom(req.user!.userId, req.params.id as string);
      sendResponse(res, 200, { message: 'Symptom log deleted' });
    } catch (error) {
      next(error);
    }
  }
}
