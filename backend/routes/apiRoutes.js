import express from 'express';
import { getHealth, getApiInfo } from '../controllers/apiController.js';

const router = express.Router();

router.get('/health', getHealth);
router.get('/info', getApiInfo);

export default router;

