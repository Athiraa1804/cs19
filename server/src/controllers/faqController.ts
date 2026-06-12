/**
 * FAQ Controller — HTTP layer.
 * Receives requests, calls the service, sends back ApiResponse<T>.
 */
import type { Request, Response } from 'express';
import type { ApiResponse } from '../types/apiResponse.js';
import type { FAQ, CreateFaqInput, GetFaqsQuery } from '../types/faq.js';
import { faqService } from '../services/faqService.js';
import { isValidFaqId } from '../utils/faqValidator.js';

// Re-export query type so routes can use it
export type { GetFaqsQuery } from '../types/faq.js';

/**
 * GET /api/faqs
 * Query params: search?, category?
 * Returns paginated list of FAQs matching filters.
 */
export const getFaqs = async (
  req: Request<object, ApiResponse<FAQ[]>, unknown, GetFaqsQuery>,
  res: Response<ApiResponse<FAQ[]>>,
): Promise<void> => {
  const { search, category } = req.query;
  const result = await faqService.getFaqs({ search, category });
  res.json(result);
};

/**
 * GET /api/faqs/:id
 * Returns a single FAQ or 404-equivalent error response.
 */
export const getFaqById = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<FAQ>>,
): Promise<void> => {
  const { id } = req.params;

  if (!isValidFaqId(id)) {
    res.status(400).json({
      success: false,
      error: 'Invalid or missing FAQ id',
    });
    return;
  }

  const result = await faqService.getFaqById(id);
  if (!result.success) {
    res.status(404).json(result);
    return;
  }
  res.json(result);
};

/**
 * POST /api/faqs
 * Creates a new crowd-sourced FAQ.
 * Role simulation (MVP): always creates "crowd-sourced" source.
 * Real auth will determine whether POST creates "existing" or "crowd-sourced".
 */
export const createFaq = async (
  req: Request<object, ApiResponse<FAQ>, CreateFaqInput>,
  res: Response<ApiResponse<FAQ>>,
): Promise<void> => {
  const result = await faqService.createFaq(req.body);

  if (!result.success) {
    res.status(400).json(result);
    return;
  }

  res.status(201).json(result);
};

/**
 * PATCH /api/faqs/:id/helpful
 * Persists a helpful vote for a FAQ.
 */
export const markFaqHelpful = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<FAQ>>,
): Promise<void> => {
  const { id } = req.params;

  if (!isValidFaqId(id)) {
    res.status(400).json({
      success: false,
      error: 'Invalid or missing FAQ id',
    });
    return;
  }

  const result = await faqService.markHelpful(id);
  if (!result.success) {
    res.status(404).json(result);
    return;
  }
  res.json(result);
};
