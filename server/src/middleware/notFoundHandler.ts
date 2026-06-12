import type { Request, Response } from 'express';
import type { ApiResponse } from '../types/apiResponse.js';

/**
 * Catches any request that reached a route but wasn't matched.
 * Returns a 404 with a standard ApiResponse envelope.
 */
export const notFoundHandler = (
  _req: Request,
  res: Response<ApiResponse<never>>,
) => {
  res.status(404).json({
    success: false,
    error: 'Not found',
  });
};