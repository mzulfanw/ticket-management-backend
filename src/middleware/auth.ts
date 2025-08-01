import { Request, Response, NextFunction } from 'express';
import JwtService from '../shared/jwt';
import status from 'http-status';
import { ApiError } from '../utils/api.error';
import MESSAGES from '../constants/message';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  if (!token) {
    return next(new ApiError(status.UNAUTHORIZED, MESSAGES.AUTH.TOKEN_INVALID));
  }
  try {
    const payload = JwtService.verifyToken(token);
    req.user = payload;
    next();
  } catch (err) {
    return next(new ApiError(status.UNAUTHORIZED, MESSAGES.AUTH.TOKEN_INVALID));
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (!roles.includes(userRole as string)) {
      return next(new ApiError(status.FORBIDDEN, MESSAGES.AUTH.FORBIDDEN));
    }
    next();
  };
};
