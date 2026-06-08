import express from 'express';
import cors from 'cors';
import healthRouter from './routes/health.routes.js';
import authRouter from './routes/auth.routes.js';
import faqRouter from './routes/faq.routes.js';
import queryRouter from './routes/query.routes.js';
import userRouter from './routes/user.routes.js';
import replyRouter from './routes/reply.routes.js';
import adminRouter from './routes/admin.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Parse JSON bodies in incoming requests
app.use(express.json());

// Allow configured frontend origins to call the backend.
app.use(cors({ origin: allowedOrigins }));

// Health check at /api/health
app.use('/api/health', healthRouter);

// Auth routes at /api/auth
app.use('/api/auth', authRouter);

// FAQ routes at /api/faqs
app.use('/api/faqs', faqRouter);

// Reply routes at /api/queries/:queryId/replies
app.use('/api/queries/:queryId/replies', replyRouter);

// User-scoped query route at /api/users/:userId/queries
app.use('/api/users', userRouter);

// Query routes at /api/queries
app.use('/api/queries', queryRouter);

// Admin routes at /api/admin
app.use('/api/admin', adminRouter);

// Serve uploaded files from the /uploads directory at the /uploads URL path
app.use('/uploads', express.static('uploads'));

// Catch unknown routes — must be registered after all real routes
app.use(notFoundHandler);

// Centralised error handler — must be registered last
app.use(errorHandler);

export default app;
