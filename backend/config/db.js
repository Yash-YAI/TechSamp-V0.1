import mongoose from 'mongoose';
import config from './env.js';
import { disconnectMongoDB } from '../controllers/dbController.js';

let isConnected = false;

/**
 * Start Database Connection
 */
export const connectDB = async () => {
  if (isConnected) {
    console.log('[DB] Primary database already connected.');
    return;
  }

  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log(`[DB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);
  } catch (error) {
    console.warn(`[DB] Primary mongoose connection warning: ${error.message}`);
  }
};

/**
 * Stop Database Connection
 */
export const disconnectDB = async () => {
  try {
    await disconnectMongoDB();
    if (isConnected) {
      await mongoose.disconnect();
      isConnected = false;
    }
    console.log('[DB] Disconnected from all MongoDB instances.');
  } catch (error) {
    console.error(`[DB] Disconnection error: ${error.message}`);
  }
};

// Listen to connection events
mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.log('[DB] MongoDB connection lost.');
});

mongoose.connection.on('error', (err) => {
  console.error(`[DB] MongoDB runtime error: ${err.message}`);
});

export default {
  connectDB,
  disconnectDB,
};

