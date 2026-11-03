import express from 'express';
import apiRoutes from './apiRoutes.js';
import authRoutes from './authRoutes.js';
import homeRoutes from './homeRoutes.js';
import userRoutes from './userRoutes.js';
import dbRoutes from './dbRoutes.js';

const router = express.Router();

// Root route
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to TechSamp Backend API',
    docs: '/api/info',
  });
});

// Mount Feature Routes
router.use('/api/auth', authRoutes);
router.use('/api/home', homeRoutes);
router.use('/api', userRoutes);
router.use('/api', dbRoutes);
router.use('/api', apiRoutes);

// 404 Route Handler for undefined endpoints
router.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

export default router;

