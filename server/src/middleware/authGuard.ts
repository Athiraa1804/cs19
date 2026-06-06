import type { NextFunction, Request, Response } from 'express';
import type { ApiResponse } from '../types/apiResponse.js';
import type { UserRole } from '../types/user.js';
import { authService } from '../services/authService.js';
import { verifyToken } from '../utils/token.js';

export async function requireAuth(
  req: Request,
  res: Response<ApiResponse<never>>,
  next: NextFunction,
): Promise<void> {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : undefined;

  if (!token) {
    res.status(401).json({ success: false, error: 'Authentication required' });
    return;
  }

  const tokenUser = verifyToken(token);
  const user = tokenUser ? await authService.getPublicUserById(tokenUser.id) : undefined;

  if (!user) {
    res.status(401).json({ success: false, error: 'Invalid or expired session' });
    return;
  }

  req.user = user;
  next();
}

export function requireRole(role: UserRole) {
  return (req: Request, res: Response<ApiResponse<never>>, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Authentication required' });
      return;
    }

    if (req.user.role !== role) {
      res.status(403).json({ success: false, error: `${role} role required` });
      return;
    }

    next();
  };
}
