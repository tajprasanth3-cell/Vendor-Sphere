import mongoose from 'mongoose';
import dns from 'dns';
import { ENV } from './env.js';

// Ensure SRV records can be resolved reliably across all networks
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Use system default DNS
}

let isConnected = false;

export const connectDB = async (): Promise<boolean> => {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return true;
  }

  try {
    const maskedUri = ENV.MONGODB_URI.replace(/:([^:@]+)@/, ':****@');
    console.log(`🌿 Connecting to MongoDB Atlas: ${maskedUri}...`);
    
    const conn = await mongoose.connect(ENV.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
    });

    isConnected = true;
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error: any) {
    console.error(`⚠️ MongoDB Connection Status: ${error.message}`);
    console.log('ℹ️ Server will continue running in hybrid resilient mode.');
    return false;
  }
};

export const getDBStatus = () => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const stateIndex = mongoose.connection.readyState;
  return {
    isConnected: stateIndex === 1,
    state: states[stateIndex] || 'unknown',
    host: mongoose.connection.host || null,
    database: mongoose.connection.name || null,
  };
};
