import { Router, type RequestHandler } from 'express';
import rateLimit from 'express-rate-limit';
import { login, logout, me, register } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authGuard.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many auth attempts. Please try again later.' },
});

router.post('/register', authLimiter, asyncHandler(register as unknown as RequestHandler));
router.post('/login', authLimiter, asyncHandler(login as unknown as RequestHandler));
router.post('/logout', asyncHandler(logout as unknown as RequestHandler));
router.get('/me', requireAuth as RequestHandler, asyncHandler(me as unknown as RequestHandler));

export default router;
