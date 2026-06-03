import express from 'express';
import cors from 'cors';
import healthRouter from './routes/health.routes.js';
import faqRouter from './routes/faq.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';

const app = express();

// Parse JSON bodies in incoming requests
app.use(express.json());

// Allow the React frontend running on its dev server to call the backend
app.use(cors());

// Health check at /api/health
app.use('/api/health', healthRouter);

// FAQ routes at /api/faqs
app.use('/api/faqs', faqRouter);

// Catch unknown routes — must be registered after all real routes
app.use(notFoundHandler);

// Centralised error handler — must be registered last
app.use(errorHandler);

export default app;