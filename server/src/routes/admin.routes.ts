import { Router, type RequestHandler } from 'express';
import { verifyReply, convertToFaq } from '../controllers/adminController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRole } from '../middleware/authGuard.js';

const router = Router();

router.use(requireAuth as RequestHandler);
router.use(requireRole('admin') as RequestHandler);

/**
 * PATCH /api/admin/replies/:replyId/verify
 * Marks a reply as verified and updates the parent query's verifiedReplyId.
 */
router.patch(
  '/replies/:replyId/verify',
  asyncHandler(verifyReply as unknown as RequestHandler),
);

/**
 * POST /api/admin/replies/:replyId/convert-to-faq
 * Converts a verified reply into a crowd-sourced FAQ.
 * Body: { question: string }
 */
router.post(
  '/replies/:replyId/convert-to-faq',
  asyncHandler(convertToFaq as unknown as RequestHandler),
);

export default router;
