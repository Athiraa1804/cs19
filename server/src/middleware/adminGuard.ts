/**
 * Admin Guard Middleware.
 *
 * MVP AUTH SUBSTITUTE — NOT REAL AUTHENTICATION.
 *
 * In a real system this would be replaced by JWT/session-based authentication.
 * For now, the frontend simulates admin role by sending the header:
 *   x-role: admin
 *
 * This guard rejects any request that does not carry that header value.
 */
import type { Request, Response, NextFunction } from 'express';
import type { ApiResponse } from '../types/apiResponse.js';

export function adminGuard(
  req: Request,
  res: Response<ApiResponse<never>>,
  next: NextFunction,
): void {
  const role = req.headers['x-role'];

  if (role !== 'admin') {
    res.status(403).json({
      success: false,
      error: 'Access denied. Admin role required.',
    });
    return;
  }

  next();
}