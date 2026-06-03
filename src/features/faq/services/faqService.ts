// ============================================================
// faqService — connects FAQ service layer to backend API
// All calls go to http://localhost:3001/api/faqs
// Mock layer retained as fallback only — see inline comments.
// ============================================================

import type { FAQ, GetFaqsParams } from '../types/faq.types';
import type { ApiResponse } from '../../../shared/types/apiResponse';
import { apiGet } from '../../../shared/utils/apiClient';
import { mockFaqs, getConvertedFaqs } from '../mocks/faq.mock';

// NOTE: markFaqHelpful has no backend endpoint — purely client-side
// increment for UX feedback only. Does not persist.
let helpfulIncrements: Record<string, number> = {};
const MOCK_HELPFUL = true; // set false if backend adds PATCH /api/faqs/:id/helpful

// ── GET /api/faqs ───────────────────────────────────────────
export async function getFaqs(
  params?: GetFaqsParams,
): Promise<ApiResponse<FAQ[]>> {
  const qs = new URLSearchParams();
  if (params?.search) qs.set('search', params.search);
  if (params?.category && params.category !== 'All') qs.set('category', params.category);
  const query = qs.toString() ? `?${qs.toString()}` : '';

  const res = await apiGet<FAQ[]>(`/api/faqs${query}`);

  if (res.success && res.data) {
    return res;
  }

  // Fallback to mock data on backend failure (dev / no server)
  return { success: true, data: [...mockFaqs, ...getConvertedFaqs()] };
}

// ── GET /api/faqs/:id ───────────────────────────────────────
export async function getFaqById(
  id: string,
): Promise<ApiResponse<FAQ | undefined>> {
  const res = await apiGet<FAQ>(`/api/faqs/${id}`);

  if (res.success && res.data) {
    return res;
  }

  // Fallback to mock lookup
  const faq = [...mockFaqs, ...getConvertedFaqs()].find((f) => f.id === id);
  if (!faq) return { success: false, error: `No FAQ found with ID "${id}".` };
  return { success: true, data: faq };
}

// ── PATCH /api/faqs/:id/helpful ─────────────────────────────
// No backend endpoint yet — purely client-side UX feedback.
// helpfulCount is incremented locally and not persisted.
export async function markFaqHelpful(
  id: string,
): Promise<ApiResponse<FAQ | undefined>> {
  if (MOCK_HELPFUL) {
    const all = [...mockFaqs, ...getConvertedFaqs()];
    const faq = all.find((f) => f.id === id);
    if (!faq) return { success: false, error: `No FAQ found with ID "${id}".` };
    helpfulIncrements[id] = (helpfulIncrements[id] ?? 0) + 1;
    return {
      success: true,
      data: { ...faq, helpfulCount: faq.helpfulCount + helpfulIncrements[id] },
    };
  }

  // Future: replace with apiPatch<FAQ>(`/api/faqs/${id}/helpful`);
  return { success: false, error: 'Endpoint not implemented' };
}

// Backward-compatible named export used by existing pages/components
export const faqService = {
  getFaqs,
  getFaqById,
  markFaqHelpful,
};