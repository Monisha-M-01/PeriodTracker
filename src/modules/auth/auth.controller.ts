import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { sendResponse } from '../../utils/response.util';
import { CONSTANTS } from '../../config/constants';

export class AuthController {
  static async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const user = await AuthService.signup(email, password);
      sendResponse(res, 201, user);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: CONSTANTS.JWT.REFRESH_COOKIE_MAX_AGE,
      });

      sendResponse(res, 200, {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.refreshToken || req.body.refreshToken;
      if (!token) {
        return sendResponse(res, 401, null, 'Refresh token required');
      }

      const result = await AuthService.refreshAccessToken(token);
      
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: CONSTANTS.JWT.REFRESH_COOKIE_MAX_AGE,
      });

      sendResponse(res, 200, result);
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.refreshToken;
      if (token) {
        await AuthService.logout(token);
        res.clearCookie('refreshToken');
      }
      sendResponse(res, 200, { message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      if (!email) {
        return sendResponse(res, 400, null, 'Email is required');
      }
      await AuthService.forgotPassword(email);
      sendResponse(res, 200, { message: 'If that email is registered, a password reset link has been sent.' });
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, password } = req.body;
      if (!token || !password) {
        return sendResponse(res, 400, null, 'Token and new password are required');
      }
      await AuthService.resetPassword(token, password);
      sendResponse(res, 200, { message: 'Password has been reset successfully' });
    } catch (error) {
      next(error);
    }
  }
}
