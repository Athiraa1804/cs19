/**
 * Reply Controller — HTTP layer.
 * Receives requests, calls the service, sends back ApiResponse<T>.
 */
import type { Request, Response } from 'express';
import type { ApiResponse } from '../types/apiResponse.js';
import type { Reply, CreateReplyInput } from '../types/reply.js';
import { replyService } from '../services/replyService.js';
import { isValidQueryId } from '../utils/replyValidator.js';

/**
 * GET /api/queries/:queryId/replies
 */
export const getRepliesForQuery = (
  req: Request<{ queryId: string }>,
  res: Response<ApiResponse<Reply[]>>,
): void => {
  const { queryId } = req.params;

  if (!isValidQueryId(queryId)) {
    res.status(400).json({
      success: false,
      error: 'Invalid or missing queryId',
    });
    return;
  }

  const result = replyService.getRepliesForQuery(queryId);
  res.json(result);
};

/**
 * POST /api/queries/:queryId/replies
 */
export const createReply = (
  req: Request<{ queryId: string }, ApiResponse<Reply>, CreateReplyInput>,
  res: Response<ApiResponse<Reply>>,
): void => {
  const { queryId } = req.params;

  if (!isValidQueryId(queryId)) {
    res.status(400).json({
      success: false,
      error: 'Invalid or missing queryId',
    });
    return;
  }

  const result = replyService.createReply(queryId, req.body);

  if (!result.success) {
    res.status(400).json(result);
    return;
  }

  res.status(201).json(result);
};