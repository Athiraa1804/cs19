// ============================================================
// faqService — connects FAQ service layer to backend API
// All calls go to http://localhost:3001/api/faqs
// Uses the authenticated backend API.
// ============================================================

import type { FAQ, GetFaqsParams } from '../types/faq.types';
import type { ApiResponse } from '../../../shared/types/apiResponse';
import { apiGet, apiPatch } from '../../../shared/utils/apiClient';

// ── GET /api/faqs ───────────────────────────────────────────
export async function getFaqs(
  params?: GetFaqsParams,
): Promise<ApiResponse<FAQ[]>> {
  const qs = new URLSearchParams();
  if (params?.search) qs.set('search', params.search);
  if (params?.category && params.category !== 'All') qs.set('category', params.category);
  const query = qs.toString() ? `?${qs.toString()}` : '';

  const res = await apiGet<FAQ[]>(`/api/faqs${query}`);

  return res;
}

// ── GET /api/faqs/:id ───────────────────────────────────────
export async function getFaqById(
  id: string,
): Promise<ApiResponse<FAQ | undefined>> {
  const res = await apiGet<FAQ>(`/api/faqs/${id}`);

  return res;
}

// ── PATCH /api/faqs/:id/helpful ─────────────────────────────
export async function markFaqHelpful(
  id: string,
): Promise<ApiResponse<FAQ | undefined>> {
  return apiPatch<FAQ>(`/api/faqs/${id}/helpful`);
}

// Backward-compatible named export used by existing pages/components
export const faqService = {
  getFaqs,
  getFaqById,
  markFaqHelpful,
};
