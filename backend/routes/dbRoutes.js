import express from 'express';
import { getDatabaseStatus } from '../controllers/dbController.js';

const router = express.Router();

// Route to check status of all database connections
router.get('/db/status', getDatabaseStatus);
router.get('/database/status', getDatabaseStatus);

export default router;

