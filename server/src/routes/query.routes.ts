import { Router, type RequestHandler } from 'express';
import {
  getQueries,
  getQueryById,
  createQuery,
} from '../controllers/queryController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

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
 * Header: X-User-Id (MVP stand-in for auth)
 */
router.post('/', asyncHandler(createQuery as unknown as RequestHandler));

export default router;