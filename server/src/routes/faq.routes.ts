import { Router, type RequestHandler } from 'express';
import { getFaqs, getFaqById, createFaq, markFaqHelpful } from '../controllers/faqController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRole } from '../middleware/authGuard.js';

const router = Router();

/**
 * GET /api/faqs
 * Query params: search?, category?
 */
router.get('/', asyncHandler(getFaqs as unknown as RequestHandler));

/**
 * GET /api/faqs/:id
 */
router.get('/:id', asyncHandler(getFaqById as unknown as RequestHandler));

/**
 * PATCH /api/faqs/:id/helpful
 */
router.patch(
  '/:id/helpful',
  requireAuth as RequestHandler,
  asyncHandler(markFaqHelpful as unknown as RequestHandler),
);

/**
 * POST /api/faqs
 * Body: { question, answer, category, tags? }
 */
router.post(
  '/',
  requireAuth as RequestHandler,
  requireRole('admin') as RequestHandler,
  asyncHandler(createFaq as unknown as RequestHandler),
);

export default router;
