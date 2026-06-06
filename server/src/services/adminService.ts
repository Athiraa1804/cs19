/**
 * Admin Service — business logic for admin-only operations.
 * Coordinates with reply and FAQ repositories to perform
 * privileged actions that normal users cannot perform.
 *
 * Returns ApiResponse<T> for all operations.
 */
import type { ApiResponse } from '../types/apiResponse.js';
import type { FAQ } from '../types/faq.js';
import { replyRepository } from '../repositories/replyRepository.js';
import { faqRepository } from '../repositories/faqRepository.js';
import { queryRepository } from '../repositories/queryRepository.js';

/** Response shape for a successful verify operation */
export interface VerifyReplyResult {
  replyId: string;
}

export const adminService = {
  /**
   * PATCH /api/admin/replies/:replyId/verify
   *
   * Marks a reply as verified and updates the parent query's verifiedReplyId
   * if the query exists. Returns 404 if the reply is not found.
   */
  async verifyReply(replyId: string): Promise<ApiResponse<VerifyReplyResult>> {
    const reply = await replyRepository.findById(replyId);
    if (!reply) {
      return { success: false, error: `Reply with id "${replyId}" not found` };
    }

    reply.isVerified = true;
    await replyRepository.update(reply);

    const query = await queryRepository.findById(reply.queryId);
    if (query) {
      query.verifiedReplyId = replyId;
      query.status = 'verified';
      await queryRepository.update(query);
    }

    return { success: true, data: { replyId } };
  },

  /**
   * POST /api/admin/replies/:replyId/convert-to-faq
   *
   * Converts a verified reply into a crowd-sourced FAQ.
   * The reply must already be verified before conversion.
   * Returns 400 if the reply is not found or not yet verified.
   */
  async convertToFaq(replyId: string, question: string): Promise<ApiResponse<FAQ>> {
    // Validate question
    if (!question || question.trim().length === 0) {
      return { success: false, error: 'question is required' };
    }
    if (question.trim().length < 10) {
      return { success: false, error: 'question must be at least 10 characters long' };
    }

    // Reply must exist
    const reply = await replyRepository.findById(replyId);
    if (!reply) {
      return { success: false, error: `Reply with id "${replyId}" not found` };
    }

    // Reply must be verified before conversion
    if (!reply.isVerified) {
      return { success: false, error: 'Reply must be verified before converting to FAQ' };
    }

    // Gather category/tags from the parent query if available
    const query = await queryRepository.findById(reply.queryId);
    const category = query?.category ?? 'General';
    const tags = query?.tags ?? [];

    const faq = await faqRepository.create(
      {
        question: question.trim(),
        answer: reply.body,
        category,
        tags,
      },
      'crowd-sourced',
    );

    return { success: true, data: faq };
  },
};
