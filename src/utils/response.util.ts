import { Response } from 'express';

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  data: T | null = null,
  error: string | null = null
) => {
  return res.status(statusCode).json({
    success: statusCode >= 200 && statusCode < 300,
    data,
    error,
  });
};
