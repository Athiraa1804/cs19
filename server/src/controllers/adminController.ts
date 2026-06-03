/**
 * Admin Controller — HTTP layer for admin-only endpoints.
 * All routes are protected by adminGuard middleware.
 */
import type { Request, Response } from 'express';
import type { ApiResponse } from '../types/apiResponse.js';
import type { FAQ } from '../types/faq.js';
import type { VerifyReplyResult } from '../services/adminService.js';
import { adminService } from '../services/adminService.js';
import { isValidReplyId } from '../utils/replyValidator.js';

/** Request body for POST /api/admin/replies/:replyId/convert-to-faq */
interface ConvertToFaqBody {
  question?: string;
}

/**
 * PATCH /api/admin/replies/:replyId/verify
 * Requires x-role: admin
 */
export const verifyReply = (
  req: Request<{ replyId: string }>,
  res: Response<ApiResponse<VerifyReplyResult>>,
): void => {
  const { replyId } = req.params;

  if (!isValidReplyId(replyId)) {
    res.status(400).json({
      success: false,
      error: 'Invalid or missing replyId',
    });
    return;
  }

  const result = adminService.verifyReply(replyId);

  if (!result.success) {
    res.status(404).json(result);
    return;
  }

  res.json(result);
};

/**
 * POST /api/admin/replies/:replyId/convert-to-faq
 * Requires x-role: admin
 * Body: { question: string }
 */
export const convertToFaq = (
  req: Request<{ replyId: string }, ApiResponse<FAQ>, ConvertToFaqBody>,
  res: Response<ApiResponse<FAQ>>,
): void => {
  const { replyId } = req.params;
  const { question } = req.body ?? {};

  if (!isValidReplyId(replyId)) {
    res.status(400).json({
      success: false,
      error: 'Invalid or missing replyId',
    });
    return;
  }

  const result = adminService.convertToFaq(replyId, question ?? '');

  if (!result.success) {
    const status = result.error?.includes('not found') ? 404 : 400;
    res.status(status).json(result);
    return;
  }

  res.status(201).json(result);
};