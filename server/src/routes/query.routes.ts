import { Router, type RequestHandler } from 'express';
import { upload } from '../middleware/upload.js';
import {
  getQueries,
  getQueryById,
  createQuery,
  updateQueryStatus,
} from '../controllers/queryController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth } from '../middleware/authGuard.js';
import { requireRole } from '../middleware/authGuard.js';

const router = Router();

router.use(requireAuth as RequestHandler);

/**
 * GET /api/queries
 * Query params: search?, category?, status?
 */
router.get('/', asyncHandler(getQueries as unknown as RequestHandler));

/**
 * GET /api/queries/:id
 */
router.get('/:id', asyncHandler(getQueryById as unknown as RequestHandler));

/**
 * POST /api/queries
 * Body: { title, description, category, tags? }
 */
router.post(
  '/',
  requireRole('intern') as RequestHandler,
  upload.single('attachment'),
  asyncHandler(createQuery as unknown as RequestHandler),
);

router.patch(
  '/:id/status',
  requireRole('admin') as RequestHandler,
  asyncHandler(updateQueryStatus as unknown as RequestHandler),
);

export default router;
