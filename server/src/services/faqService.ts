/**
 * FAQ Service — business logic layer.
 * Coordinates between controller and repository, applies business rules,
 * and returns ApiResponse<T> for all operations.
 */
import type { FAQ, GetFaqsQuery, CreateFaqInput } from '../types/faq.js';
import type { ApiResponse } from '../types/apiResponse.js';
import { faqRepository } from '../repositories/faqRepository.js';
import { validateCreateFaqInput } from '../utils/faqValidator.js';

export const faqService = {
  /** GET /api/faqs — list FAQs, optionally filtered by search and/or category. */
  getFaqs(query: GetFaqsQuery = {}): ApiResponse<FAQ[]> {
    const faqs = faqRepository.findAll(query);
    return { success: true, data: faqs };
  },

  /**
   * GET /api/faqs/:id — fetch a single FAQ.
   * Returns 404-style error response if not found.
   */
  getFaqById(id: string): ApiResponse<FAQ> {
    const faq = faqRepository.findById(id);
    if (!faq) {
      return { success: false, error: `FAQ with id "${id}" not found` };
    }
    return { success: true, data: faq };
  },

  /**
   * POST /api/faqs — create a new FAQ.
   * "existing" source = official/preloaded; "crowd-sourced" = admin-converted.
   * For MVP, POST always creates a crowd-sourced FAQ (admin-created/converted).
   */
  createFaq(input: CreateFaqInput): ApiResponse<FAQ> {
    const errors = validateCreateFaqInput(input);
    if (errors.length > 0) {
      return { success: false, error: errors.join('; ') };
    }

    const faq = faqRepository.create(input, 'crowd-sourced');
    return { success: true, data: faq };
  },
};