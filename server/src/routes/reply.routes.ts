import { Router, type RequestHandler } from 'express';
import { getRepliesForQuery, createReply } from '../controllers/replyController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth } from '../middleware/authGuard.js';

const router = Router({ mergeParams: true });

router.use(requireAuth as RequestHandler);

/**
 * GET /api/queries/:queryId/replies
 */
router.get('/', asyncHandler(getRepliesForQuery as unknown as RequestHandler));

/**
 * POST /api/queries/:queryId/replies
 */
router.post('/', asyncHandler(createReply as unknown as RequestHandler));

export default router;
