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
    origin: [ENV.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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
