// ============================================================
// queryService — connects Query service layer to backend API
// All calls go to http://localhost:3001/api/
// Mock layer retained as fallback only.
// ============================================================

import type { ApiResponse } from '../../../shared/types/apiResponse';
import type { Query, QueryCreateInput } from '../types/query.types';
import { apiGet, apiPost } from '../../../shared/utils/apiClient';
import { mockQueries } from '../mocks/query.mock';

// In-memory store for queries created via POST during this session
// These are merged with the backend query list to emulate persistent creation.
const sessionQueries: Query[] = [];

// ── GET /api/queries ────────────────────────────────────────
export async function getAll(): Promise<ApiResponse<Query[]>> {
  const res = await apiGet<Query[]>('/api/queries');

  if (res.success && res.data) {
    // Merge backend results with any session-created queries so newly
    // created queries appear in the list without a page refresh.
    const merged = [...res.data, ...sessionQueries];
    return { success: true, data: merged };
  }

  return { success: true, data: [...mockQueries, ...sessionQueries] };
}

// ── GET /api/users/:userId/queries ─────────────────────────
export async function getByUser(userId: string): Promise<ApiResponse<Query[]>> {
  const res = await apiGet<Query[]>(`/api/users/${userId}/queries`);

  if (res.success && res.data) {
    return {
      success: true,
      data: [...res.data, ...sessionQueries.filter((q) => q.createdBy === userId)],
    };
  }

  return {
    success: true,
    data: [...mockQueries, ...sessionQueries].filter((q) => q.createdBy === userId),
  };
}

// ── GET /api/queries/:id ────────────────────────────────────
export async function getById(id: string): Promise<ApiResponse<Query>> {
  const res = await apiGet<Query>(`/api/queries/${id}`);

  if (res.success && res.data) return res;

  // Fallback to mock lookup
  const all = [...mockQueries, ...sessionQueries];
  const found = all.find((q) => q.id === id);
  if (!found) return { success: false, error: 'Query not found' };
  return { success: true, data: found };
}

// ── POST /api/queries ───────────────────────────────────────
export async function create(input: QueryCreateInput): Promise<ApiResponse<Query>> {
  // Backend expects X-User-Id header — pass it through from input.createdBy
  const headers: Record<string, string> = { 'X-User-Id': input.createdBy };

  const res = await apiPost<Query>('/api/queries', input, headers);

  if (res.success && res.data) {
    // Track session-created query so it appears in list views
    sessionQueries.push(res.data);
    return res;
  }

  // Fallback: create locally if backend unavailable
  const now = new Date().toISOString();
  const newQuery: Query = {
    id: `q-${Date.now()}`,
    ...input,
    status: 'open',
    createdAt: now,
    updatedAt: now,
    replyCount: 0,
  };
  sessionQueries.push(newQuery);
  return { success: true, data: newQuery };
}

// Backward-compatible named export used by existing pages
export const queryService = {
  getAll,
  getById,
  getByUser,
  create,
};