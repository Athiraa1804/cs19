import type { RequestHandler } from 'express';

/**
 * Wraps an async route handler so uncaught promise rejections
 * are forwarded to the next error handler instead of crashing the server.
 *
 * Usage:
 *   router.get('/path', asyncHandler(async (req, res, next) => { ... }));
 */
export const asyncHandler = (fn: RequestHandler): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };