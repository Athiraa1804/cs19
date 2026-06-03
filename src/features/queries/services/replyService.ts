// ============================================================
// replyService — connects Reply service layer to backend API
// All calls go to http://localhost:3001/api/queries/:queryId/replies
// Mock layer retained as fallback only.
// ============================================================

import type { ApiResponse } from '../../../shared/types/apiResponse';
import type { Reply, ReplyCreateInput } from '../types/reply.types';
import { apiGet, apiPost } from '../../../shared/utils/apiClient';
import { getRepliesForQuery, addSessionReply } from '../mocks/reply.mock';

// In-memory store for replies created via POST during this session
// These are merged with the backend reply list so new replies appear immediately.
const sessionReplies: Reply[] = [];

// ── GET /api/queries/:queryId/replies ──────────────────────
export async function getByQueryId(queryId: string): Promise<ApiResponse<Reply[]>> {
  const res = await apiGet<Reply[]>(`/api/queries/${queryId}/replies`);

  if (res.success && res.data) {
    return {
      success: true,
      data: [...res.data, ...sessionReplies.filter((r) => r.queryId === queryId)],
    };
  }

  // Fallback to mock data
  return { success: true, data: getRepliesForQuery(queryId) };
}

// ── POST /api/queries/:queryId/replies ─────────────────────
export async function create(input: ReplyCreateInput): Promise<ApiResponse<Reply>> {
  const res = await apiPost<Reply>(
    `/api/queries/${input.queryId}/replies`,
    input,
  );

  if (res.success && res.data) {
    // Track session-created reply so it appears in the thread immediately
    sessionReplies.push(res.data);
    return res;
  }

  // Fallback: create locally if backend unavailable
  const newReply: Reply = {
    id: `r-${Date.now()}`,
    ...input,
    createdAt: new Date().toISOString(),
    isVerified: false,
  };
  addSessionReply(newReply);
  sessionReplies.push(newReply);
  return { success: true, data: newReply };
}

// Backward-compatible named export used by existing pages
export const replyService = {
  getByQueryId,
  create,
};