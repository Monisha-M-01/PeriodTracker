import { Request, Response, NextFunction } from 'express';
import { UsersService } from './users.service';
import { sendResponse } from '../../utils/response.util';

export class UsersController {
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const profile = await UsersService.getProfile(userId);
      sendResponse(res, 200, profile);
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      // We only allow updating the name for now
      const profile = await UsersService.updateProfile(userId, { name: req.body.name });
      sendResponse(res, 200, profile);
    } catch (error) {
      next(error);
    }
  }

  static async updateSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const settings = await UsersService.updateSettings(userId, req.body);
      sendResponse(res, 200, settings);
    } catch (error) {
      next(error);
    }
  }
}
