import mongoose from 'mongoose';
import config from './env.js';

let isConnected = false;

/**
 * Start Database Connection
 */
export const connectDB = async () => {
  if (isConnected) {
    console.log('[DB] Already connected to MongoDB.');
    return;
  }

  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log(`[DB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`[DB] Connection error: ${error.message}`);
    // If running in development without MongoDB running, don't crash the server immediately, but log warning
    if (config.nodeEnv === 'production') {
      process.exit(1);
    }
  }
};

/**
 * Stop Database Connection
 */
export const disconnectDB = async () => {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('[DB] Disconnected from MongoDB.');
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

