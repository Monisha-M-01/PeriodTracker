import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { sendResponse } from '../utils/response.util';

export const validate = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error as z.ZodError<any>;
        const message = zodError.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
        return sendResponse(res, 400, null, message);
      }
      next(error);
    }
  };
};
