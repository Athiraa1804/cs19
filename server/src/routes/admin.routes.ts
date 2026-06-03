import { Router, type RequestHandler } from 'express';
import { adminGuard } from '../middleware/adminGuard.js';
import { verifyReply, convertToFaq } from '../controllers/adminController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

// All routes on this router are protected by the admin guard
router.use(adminGuard as RequestHandler);

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