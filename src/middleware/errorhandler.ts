import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api.error";
import { ZodError } from "zod";
import status from 'http-status';
import MESSAGES from "../constants/message";

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(status.BAD_REQUEST).json({
      message: MESSAGES.COMMON.VALIDATION_FAILED,
      errors: err.format(),
    });
  }
  if (err instanceof ApiError || (err && typeof err === 'object' && (err as any).name === 'ApiError')) {
    const apiErr = err as ApiError;
    return res.status(apiErr.statusCode).json({
      message: apiErr.message,
      code: apiErr.statusCode,
    });
  }
  return res.status(500).json({
    message: MESSAGES.COMMON.INTERNAL_SERVER_ERROR,
  });
}
