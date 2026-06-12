import type { Request, Response, ErrorRequestHandler } from 'express';
import type { ApiResponse } from '../types/apiResponse.js';

/**
 * Centralised error handler.
 * All thrown/next(error) calls land here.
 * Never leaks the stack trace to the client.
 */
export const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response<ApiResponse<never>>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: Response['locals'],
) => {
  console.error('[ErrorHandler]', err.message);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
};