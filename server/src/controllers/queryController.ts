/**
 * Query Controller — HTTP layer.
 * Receives requests, calls the service, sends back ApiResponse<T>.
 */
import type { Request, Response } from 'express';
import type { ApiResponse } from '../types/apiResponse.js';
import type { Query, GetQueriesQuery, CreateQueryInput } from '../types/query.js';
import { queryService } from '../services/queryService.js';
import { isValidQueryId, isValidUserId } from '../utils/queryValidator.js';

// Re-export for routes
export type { GetQueriesQuery } from '../types/query.js';

/**
 * GET /api/queries
 * Query params: search?, category?, status?
 */
export const getQueries = (
  req: Request<object, ApiResponse<Query[]>, unknown, GetQueriesQuery>,
  res: Response<ApiResponse<Query[]>>,
): void => {
  const { search, category, status } = req.query;
  const result = queryService.getQueries({ search, category, status });
  res.json(result);
};

/**
 * GET /api/queries/:id
 */
export const getQueryById = (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<Query>>,
): void => {
  const { id } = req.params;

  if (!isValidQueryId(id)) {
    res.status(400).json({
      success: false,
      error: 'Invalid or missing query id',
    });
    return;
  }

  const result = queryService.getQueryById(id);
  if (!result.success) {
    res.status(404).json(result);
    return;
  }
  res.json(result);
};

/**
 * GET /api/users/:userId/queries
 * Returns all queries for the given user, newest first.
 */
export const getQueriesByUserId = (
  req: Request<{ userId: string }>,
  res: Response<ApiResponse<Query[]>>,
): void => {
  const { userId } = req.params;

  if (!isValidUserId(userId)) {
    res.status(400).json({
      success: false,
      error: 'Invalid or missing userId',
    });
    return;
  }

  const result = queryService.getQueriesByUserId(userId);
  res.json(result);
};

/**
 * POST /api/queries
 * Body: { title, description, category, tags? }
 * createdBy is passed as a header (X-User-Id) since there's no auth in MVP.
 * In a real system this would come from the authenticated session.
 */
export const createQuery = (
  req: Request<object, ApiResponse<Query>, CreateQueryInput>,
  res: Response<ApiResponse<Query>>,
): void => {
  const userId = req.headers['x-user-id'];

  if (!isValidUserId(userId)) {
    res.status(400).json({
      success: false,
      error: 'X-User-Id header is required',
    });
    return;
  }

  const result = queryService.createQuery(req.body, userId as string);

  if (!result.success) {
    res.status(400).json(result);
    return;
  }

  res.status(201).json(result);
};