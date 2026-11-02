import express from 'express';
import { getHomeData } from '../controllers/homeController.js';

const router = express.Router();

// GET /api/home - Dashboard & Overview
router.get('/', getHomeData);

export default router;

