// ============================================================
// replyService — connects Reply service layer to backend API
// All calls go to http://localhost:3001/api/queries/:queryId/replies
// Requires an authenticated backend session.
// ============================================================

import type { ApiResponse } from '../../../shared/types/apiResponse';
import type { Reply, ReplyCreateInput } from '../types/reply.types';
import { apiGet, apiPost } from '../../../shared/utils/apiClient';

// ── GET /api/queries/:queryId/replies ──────────────────────
export async function getByQueryId(queryId: string): Promise<ApiResponse<Reply[]>> {
  const res = await apiGet<Reply[]>(`/api/queries/${queryId}/replies`);

  return res;
}

// ── POST /api/queries/:queryId/replies ─────────────────────
export async function create(input: ReplyCreateInput): Promise<ApiResponse<Reply>> {
  // Only reply text is sent; the authenticated backend assigns author identity and role.
  return apiPost<Reply>(
    `/api/queries/${input.queryId}/replies`,
    { body: input.body },
  );
}

// Backward-compatible named export used by existing pages
export const replyService = {
  getByQueryId,
  create,
};
