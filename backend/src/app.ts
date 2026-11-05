import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { ENV } from './config/env.js';
import { getDBStatus } from './config/db.js';
import apiRouter from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

export const createApp = (): Application => {
  const app = express();

  // Core Middlewares
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like curl, postman, server-to-server)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        ENV.CLIENT_URL,
        'http://localhost:5173',
        'http://127.0.0.1:5173',
      ];

      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.includes('vercel.app')
      ) {
        return callback(null, true);
      }

      // Permissive fallback to allow Vercel previews & production
      return callback(null, true);
    },
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Root landing endpoint for cloud verification & browser access
  app.get('/', (_req: Request, res: Response) => {
    const dbStatus = getDBStatus();
    res.json({
      status: 'operational',
      platform: 'VendorSphere Enterprise API',
      version: '2.4.0',
      database: {
        provider: 'MongoDB Atlas',
        ...dbStatus,
      },
      endpoints: {
        health: '/api/health',
        apiV1: '/api/v1',
      },
      clientUrl: ENV.CLIENT_URL,
      timestamp: new Date().toISOString(),
    });
  });

  // Health check endpoint with MongoDB status
  app.get('/api/health', (_req: Request, res: Response) => {
    const dbStatus = getDBStatus();
    res.json({
      status: 'operational',
      platform: 'VendorSphere Enterprise API',
      version: '2.4.0',
      database: {
        provider: 'MongoDB Atlas',
        ...dbStatus,
      },
      timestamp: new Date().toISOString(),
    });
  });

  // Enterprise API v1 Router
  app.use('/api/v1', apiRouter);

  // 404 Fallback
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: 'The requested enterprise API endpoint does not exist.',
    });
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
