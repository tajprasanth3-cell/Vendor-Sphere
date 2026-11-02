import { createApp } from './app.js';
import { ENV } from './config/env.js';

const app = createApp();

const server = app.listen(ENV.PORT, () => {
  console.log('====================================================');
  console.log(`🚀 VendorSphere Enterprise API Server Running`);
  console.log(`📡 Port: ${ENV.PORT}`);
  console.log(`🌐 Environment: ${ENV.NODE_ENV}`);
  console.log(`🔗 Health Check: http://localhost:${ENV.PORT}/api/health`);
  console.log(`📦 Base API v1: http://localhost:${ENV.PORT}/api/v1`);
  console.log('====================================================');
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

