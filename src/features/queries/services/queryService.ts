// ============================================================
// queryService — connects Query service layer to backend API
// All calls go to http://localhost:3001/api/
// Requires an authenticated backend session.
// ============================================================

import type { ApiResponse } from '../../../shared/types/apiResponse';
import type { Query, QueryCreateInput, QueryStatus } from '../types/query.types';
import { apiGet, apiPatch, apiPost } from '../../../shared/utils/apiClient';
import { getAuthToken } from '../../auth/utils/authToken';

// ── GET /api/queries ────────────────────────────────────────
export async function getAll(): Promise<ApiResponse<Query[]>> {
  const res = await apiGet<Query[]>('/api/queries');

  return res;
}

// ── GET /api/users/:userId/queries ─────────────────────────
export async function getByUser(userId: string): Promise<ApiResponse<Query[]>> {
  // The backend permits interns to read only their own queries; admins may read any user's list.
  const res = await apiGet<Query[]>(`/api/users/${userId}/queries`);

  return res;
}

// ── GET /api/queries/:id ────────────────────────────────────
export async function getById(id: string): Promise<ApiResponse<Query>> {
  const res = await apiGet<Query>(`/api/queries/${id}`);

  return res;
}

// ── POST /api/queries ───────────────────────────────────────
export async function create(input: QueryCreateInput): Promise<ApiResponse<Query>> {
  const formData = new FormData();

  formData.append('title', input.title);
  formData.append('description', input.description);
  formData.append('category', input.category);

  input.tags.forEach((tag) => {
    formData.append('tags', tag);
  });

  if (input.attachment) {
    formData.append('attachment', input.attachment);
  }

  const token = getAuthToken();

  try {
    const response = await fetch('http://localhost:3001/api/queries', {
      method: 'POST',
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
      body: formData,
      
    });

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}
export async function updateStatus(id: string, status: QueryStatus): Promise<ApiResponse<Query>> {
  // Status changes are protected by the backend's admin role guard.
  return apiPatch<Query>(`/api/queries/${id}/status`, { status });
}

// Backward-compatible named export used by existing pages
export const queryService = {
  getAll,
  getById,
  getByUser,
  create,
  updateStatus,
};
