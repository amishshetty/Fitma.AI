import express from 'express';
import { handleVisionAnalyze } from '../controllers/visionController.js';

const router = express.Router();

router.post('/analyze', handleVisionAnalyze);

export default router;
