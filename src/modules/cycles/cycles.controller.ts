import { Request, Response, NextFunction } from 'express';
import { CyclesService } from './cycles.service';
import { sendResponse } from '../../utils/response.util';

export class CyclesController {
  static async getPredictions(req: Request, res: Response, next: NextFunction) {
    try {
      const { date } = req.query;
      const predictions = await CyclesService.getCyclePredictions(
        req.user!.userId,
        date as string
      );
      sendResponse(res, 200, predictions);
    } catch (error) {
      next(error);
    }
  }
}
