import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/authRoutes';
import courseRoutes from './routes/courseRoutes';
import moduleRoutes from './routes/moduleRoutes';
import lessonRoutes from './routes/lessonRoutes';
import quizRoutes from './routes/quizRoutes';
import assignmentRoutes from './routes/assignmentRoutes';
import progressRoutes from './routes/progressRoutes';
import certificateRoutes from './routes/certificateRoutes';
import finalProjectRoutes from './routes/finalProjectRoutes';
import adminRoutes from './routes/adminRoutes';

export const createApp = () => {
  const app = express();

  // Security Middleware
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: false,
    })
  );

  app.use(
    cors({
      origin: [config.frontendUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // Body and cookie parsing
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));
  app.use(cookieParser(config.cookieSecret));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Comp!lo Learn API',
      timestamp: new Date().toISOString(),
    });
  });

  // Rate limiter for auth endpoints
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // 100 attempts per 15 minutes
    message: { success: false, error: 'Too many requests. Please try again later.' },
  });
  app.use('/api/v1/auth', authLimiter);

  // Mount API v1 Routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/courses', courseRoutes);
  app.use('/api/v1/modules', moduleRoutes);
  app.use('/api/v1/lessons', lessonRoutes);
  app.use('/api/v1/quizzes', quizRoutes);
  app.use('/api/v1/assignments', assignmentRoutes);
  app.use('/api/v1/progress', progressRoutes);
  app.use('/api/v1/certificates', certificateRoutes);
  app.use('/api/v1/projects', finalProjectRoutes);
  app.use('/api/v1/admin', adminRoutes);

  // 404 handler for API
  app.use('/api/*', (req, res) => {
    res.status(404).json({ success: false, error: `Route not found: ${req.method} ${req.originalUrl}` });
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
