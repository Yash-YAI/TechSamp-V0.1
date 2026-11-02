import mongoose from 'mongoose';

/**
 * Health check endpoint
 */
export const getHealth = (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime().toFixed(2)}s`,
    database: dbStatus,
  });
};

/**
 * Example info endpoint
 */
export const getApiInfo = (req, res) => {
  res.status(200).json({
    message: 'TechSamp Backend API is running smoothly.',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      info: '/api/info',
    },
  });
};

