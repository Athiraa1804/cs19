import { Router, type RequestHandler } from 'express';
import {
  getQueries,
  getQueryById,
  createQuery,
  updateQueryStatus,
} from '../controllers/queryController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth } from '../middleware/authGuard.js';
import { requireRole } from '../middleware/authGuard.js';
import { queryUpload } from '../middleware/queryUpload.js';

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
 * Multipart body: { title, description, category, tags?, attachment? }
 */
router.post(
  '/',
  requireRole('intern') as RequestHandler,
  queryUpload.single('attachment'),
  asyncHandler(createQuery as unknown as RequestHandler),
);

router.patch(
  '/:id/status',
  requireRole('admin') as RequestHandler,
  asyncHandler(updateQueryStatus as unknown as RequestHandler),
);

export default router;
