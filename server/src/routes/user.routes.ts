import { Router, type RequestHandler } from 'express';
import { getQueriesByUserId } from '../controllers/queryController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

/**
 * GET /api/users/:userId/queries
 * Returns all queries for the given user, newest first.
 */
router.get('/:userId/queries', asyncHandler(getQueriesByUserId as unknown as RequestHandler));

export default router;