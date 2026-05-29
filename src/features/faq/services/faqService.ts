// ============================================================
// faqService — single switch point for mock vs real API
// Follows ApiResponse<T> contract from ENGINEERING_STANDARDS.md
// ============================================================

import type { FAQ, ApiResponse, GetFaqsParams } from '../types/faq.types';
import { mockFaqs } from '../mocks/faq.mock';

// Simulated network delay (ms) — makes loading states realistic
const DELAY = 600;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── GET /faqs ───────────────────────────────────────────────
export async function getFaqs(
  _params?: GetFaqsParams
): Promise<ApiResponse<FAQ[]>> {
  await delay(DELAY);

  try {
    const data = [...mockFaqs];
    return { success: true, data };
  } catch {
    return { success: false, error: 'Failed to load FAQs. Please try again.' };
  }
}

// ── GET /faqs?search=&category= ────────────────────────────
export async function searchFaqs(
  params: GetFaqsParams
): Promise<ApiResponse<FAQ[]>> {
  await delay(DELAY);

  try {
    let results = [...mockFaqs];

    if (params.category && params.category !== 'All') {
      results = results.filter((f) => f.category === params.category);
    }

    if (params.search) {
      const q = params.search.toLowerCase();
      results = results.filter(
        (f) =>
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q) ||
          f.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return { success: true, data: results };
  } catch {
    return { success: false, error: 'Search failed. Please try again.' };
  }
}

// ── GET /faqs/:id ───────────────────────────────────────────
export async function getFaqById(
  id: string
): Promise<ApiResponse<FAQ | undefined>> {
  await delay(DELAY);

  const faq = mockFaqs.find((f) => f.id === id);
  if (!faq) {
    return { success: false, error: `No FAQ found with ID "${id}".` };
  }

  return { success: true, data: faq };
}

// ── PATCH /faqs/:id/helpful ────────────────────────────────
export async function markFaqHelpful(
  id: string
): Promise<ApiResponse<FAQ | undefined>> {
  await delay(DELAY);

  const faq = mockFaqs.find((f) => f.id === id);
  if (!faq) {
    return { success: false, error: `No FAQ found with ID "${id}".` };
  }

  faq.helpfulCount += 1;
  return { success: true, data: faq };
}