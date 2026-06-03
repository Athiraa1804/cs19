/**
 * Reply Service — business logic layer.
 * Coordinates between controller and repository and returns ApiResponse<T>.
 */
import type { Reply, CreateReplyInput } from '../types/reply.js';
import type { ApiResponse } from '../types/apiResponse.js';
import { replyRepository } from '../repositories/replyRepository.js';
import { validateCreateReplyInput } from '../utils/replyValidator.js';

export const replyService = {
  /**
   * GET /api/queries/:queryId/replies — list replies for a query, oldest-first.
   */
  getRepliesForQuery(queryId: string): ApiResponse<Reply[]> {
    const replies = replyRepository.findByQueryId(queryId);
    return { success: true, data: replies };
  },

  /**
   * POST /api/queries/:queryId/replies — add a new reply.
   * Returns validation errors as 400.
   */
  createReply(queryId: string, input: CreateReplyInput): ApiResponse<Reply> {
    const errors = validateCreateReplyInput(input);
    if (errors.length > 0) {
      return { success: false, error: errors.join('; ') };
    }

    const reply = replyRepository.create({ ...input, queryId });
    return { success: true, data: reply };
  },
};