// ============================================================
// adminService — connects admin service layer to backend API
// Calls go to http://localhost:3001/api/admin/
// NOTE: page components may call convertReplyToFaq (snake_case) or
// convertToFaq (camelCase). Both are supported.
// ============================================================

import type { ApiResponse } from '../../../shared/types/apiResponse';
import type { FAQ } from '../../faq/types/faq.types';
import { apiPatch, apiPost } from '../../../shared/utils/apiClient';

/** Result shape returned by verifyReply */
export interface VerifyReplyResult {
  replyId: string;
}

/**
 * PATCH /api/admin/replies/:replyId/verify
 * Marks a reply as verified and updates the parent query's verifiedReplyId.
 */
export async function verifyReply(
  replyId: string,
): Promise<ApiResponse<VerifyReplyResult>> {
  return apiPatch<VerifyReplyResult>(
    `/api/admin/replies/${replyId}/verify`,
    undefined,
  );
}

/**
 * POST /api/admin/replies/:replyId/convert-to-faq
 * Converts a verified reply into a crowd-sourced FAQ.
 * The question text is supplied by the admin.
 */
export async function convertToFaq(
  replyId: string,
  question: string,
): Promise<ApiResponse<FAQ>> {
  return apiPost<FAQ>(
    `/api/admin/replies/${replyId}/convert-to-faq`,
    { question },
  );
}

/**
 * Alias for convertToFaq — supports snake_case call sites (legacy page API).
 */
export const convertReplyToFaq = convertToFaq;

// Backward-compatible named export used by existing pages/components
export const adminService = {
  verifyReply,
  convertToFaq,
  convertReplyToFaq,
};
