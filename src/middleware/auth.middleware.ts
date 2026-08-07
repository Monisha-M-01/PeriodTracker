import { Request, Response, NextFunction } from 'express';
import { TokenPayload, verifyAccessToken } from '../utils/jwt.util';
import { prisma } from '../config/prisma';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, error: 'Unauthorized: No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const payload = verifyAccessToken(token);
      req.user = payload;
      next();
    } catch (err) {
      res.status(401).json({ success: false, error: 'Unauthorized: Invalid token' });
      return;
    }
  } catch (error) {
    next(error);
  }
};
