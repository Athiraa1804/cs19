/**
 * Reply Service — business logic layer.
 * Coordinates between controller and repository and returns ApiResponse<T>.
 */
import type { Reply, CreateReplyInput } from '../types/reply.js';
import type { ApiResponse } from '../types/apiResponse.js';
import { replyRepository } from '../repositories/replyRepository.js';
import { queryRepository } from '../repositories/queryRepository.js';
import { validateCreateReplyInput } from '../utils/replyValidator.js';

export const replyService = {
  /**
   * GET /api/queries/:queryId/replies — list replies for a query, oldest-first.
   */
  async getRepliesForQuery(queryId: string): Promise<ApiResponse<Reply[]>> {
    const query = await queryRepository.findById(queryId);
    if (!query) {
      return { success: false, error: `Query with id "${queryId}" not found` };
    }

    const replies = await replyRepository.findByQueryId(queryId);
    return { success: true, data: replies };
  },

  /**
   * POST /api/queries/:queryId/replies — add a new reply.
   * Returns validation errors as 400.
   */
  async createReply(queryId: string, input: CreateReplyInput & { authorId: string }): Promise<ApiResponse<Reply>> {
    const errors = validateCreateReplyInput(input);
    if (errors.length > 0) {
      return { success: false, error: errors.join('; ') };
    }

    const query = await queryRepository.findById(queryId);
    if (!query) {
      return { success: false, error: `Query with id "${queryId}" not found` };
    }

    const reply = await replyRepository.create({ ...input, queryId });
    return { success: true, data: reply };
  },
};
