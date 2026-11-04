import { createApp } from './app.js';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import { seedDatabase } from './db/seed.js';

const app = createApp();

const startServer = async () => {
  // Connect to MongoDB Atlas cluster
  const isDbConnected = await connectDB();
  if (isDbConnected) {
    await seedDatabase();
  }

  const server = app.listen(ENV.PORT, () => {
    console.log('====================================================');
    console.log(`🚀 VendorSphere Enterprise API Server Running`);
    console.log(`📡 Port: ${ENV.PORT}`);
    console.log(`🌐 Environment: ${ENV.NODE_ENV}`);
    console.log(`🌿 Database: MongoDB Atlas (${isDbConnected ? 'Connected' : 'Disconnected / Standby'})`);
    console.log(`🔗 Health Check: http://localhost:${ENV.PORT}/api/health`);
    console.log(`📦 Base API v1: http://localhost:${ENV.PORT}/api/v1`);
    console.log('====================================================');
  });

  // Graceful shutdown handling
  const shutdown = () => {
    console.log('SIGTERM/SIGINT signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

startServer();
