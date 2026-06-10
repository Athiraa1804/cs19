/**
 * Query Controller — HTTP layer.
 * Receives requests, calls the service, sends back ApiResponse<T>.
 */
import type { Request, Response } from 'express';
import type { ApiResponse } from '../types/apiResponse.js';
import type { Query, GetQueriesQuery, CreateQueryInput } from '../types/query.js';
import { queryService } from '../services/queryService.js';
import { isValidQueryId, isValidUserId, queryStatusSchema } from '../utils/queryValidator.js';
import { zodErrors } from '../utils/authValidator.js';

// Re-export for routes
export type { GetQueriesQuery } from '../types/query.js';

/**
 * GET /api/queries
 * Query params: search?, category?, status?
 */
export const getQueries = async (
  req: Request<object, ApiResponse<Query[]>, unknown, GetQueriesQuery>,
  res: Response<ApiResponse<Query[]>>,
): Promise<void> => {
  const { search, category, status } = req.query;
  const result = await queryService.getQueries({ search, category, status });
  res.json(result);
};

/**
 * GET /api/queries/:id
 */
export const getQueryById = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<Query>>,
): Promise<void> => {
  const { id } = req.params;

  if (!isValidQueryId(id)) {
    res.status(400).json({
      success: false,
      error: 'Invalid or missing query id',
    });
    return;
  }

  const result = await queryService.getQueryById(id);
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
export const getQueriesByUserId = async (
  req: Request<{ userId: string }>,
  res: Response<ApiResponse<Query[]>>,
): Promise<void> => {
  const { userId } = req.params;
  const requester = req.user;

  if (!isValidUserId(userId)) {
    res.status(400).json({
      success: false,
      error: 'Invalid or missing userId',
    });
    return;
  }

  if (!requester || (requester.role !== 'admin' && requester.id !== userId)) {
    res.status(403).json({
      success: false,
      error: 'You can only view your own queries',
    });
    return;
  }

  const result = await queryService.getQueriesByUserId(userId);
  res.json(result);
};

/**
 * POST /api/queries
 * Body: { title, description, category, tags? }
 * createdBy comes from the authenticated session.
 */
export const createQuery = async (
  req: Request<object, ApiResponse<Query>, CreateQueryInput>,
  res: Response<ApiResponse<Query>>,
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Authentication required',
    });
    return;
  }

  const attachmentUrl = req.file
  ? `/uploads/${req.file.filename}`
  : undefined;

const result = await queryService.createQuery(
  {
    ...req.body,
    attachmentUrl,
  },
  req.user.id,
);

  if (!result.success) {
    res.status(400).json(result);
    return;
  }

  res.status(201).json(result);
};

export const updateQueryStatus = async (
  req: Request<{ id: string }, ApiResponse<Query>, { status?: Query['status'] }>,
  res: Response<ApiResponse<Query>>,
): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body ?? {};

  if (!isValidQueryId(id)) {
    res.status(400).json({ success: false, error: 'Invalid or missing query id' });
    return;
  }

  const parsedStatus = queryStatusSchema.safeParse(status);
  if (!parsedStatus.success) {
    res.status(400).json({ success: false, error: zodErrors(parsedStatus.error) });
    return;
  }

  const result = await queryService.updateQueryStatus(id, parsedStatus.data);
  if (!result.success) {
    res.status(404).json(result);
    return;
  }
  res.json(result);
};
