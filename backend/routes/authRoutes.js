import express from 'express';
import { login, getMe } from '../controllers/authController.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/me
router.get('/me', getMe);

export default router;

