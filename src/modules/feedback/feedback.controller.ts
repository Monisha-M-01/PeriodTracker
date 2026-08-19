import { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../../utils/response.util';
import { FeedbackService } from './feedback.service';

export class FeedbackController {
  static async submitFeedback(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const feedback = await FeedbackService.createFeedback(userId, req.body);
      sendResponse(res, 201, feedback);
    } catch (error) {
      next(error);
    }
  }

  static async getFeedbacks(req: Request, res: Response, next: NextFunction) {
    try {
      const feedbacks = await FeedbackService.getFeedbacks();
      sendResponse(res, 200, feedbacks);
    } catch (error) {
      next(error);
    }
  }
}
