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
export const getRepliesForQuery = async (
  req: Request<{ queryId: string }>,
  res: Response<ApiResponse<Reply[]>>,
): Promise<void> => {
  const { queryId } = req.params;

  if (!isValidQueryId(queryId)) {
    res.status(400).json({
      success: false,
      error: 'Invalid or missing queryId',
    });
    return;
  }

  const result = await replyService.getRepliesForQuery(queryId);
  if (!result.success) {
    res.status(404).json(result);
    return;
  }
  res.json(result);
};

/**
 * POST /api/queries/:queryId/replies
 */
export const createReply = async (
  req: Request<{ queryId: string }, ApiResponse<Reply>, CreateReplyInput>,
  res: Response<ApiResponse<Reply>>,
): Promise<void> => {
  const { queryId } = req.params;
  const user = req.user;

  if (!isValidQueryId(queryId)) {
    res.status(400).json({
      success: false,
      error: 'Invalid or missing queryId',
    });
    return;
  }

  if (!user) {
    res.status(401).json({
      success: false,
      error: 'Authentication required',
    });
    return;
  }

  const result = replyService.createReply(queryId, {
    body: req.body.body,
    authorName: user.name,
    authorRole: user.role,
    authorId: user.id,
  });
  const awaitedResult = await result;

  if (!awaitedResult.success) {
    const status = awaitedResult.error?.includes('not found') ? 404 : 400;
    res.status(status).json(awaitedResult);
    return;
  }

  res.status(201).json(awaitedResult);
};
