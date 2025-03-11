import express from 'express';
import { detectEmotion, getEmotionHistory } from '../api/controllers/EmotionController.js';
import { authMiddleware } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

router.post('/detect', authMiddleware, detectEmotion);
router.get('/history', authMiddleware, getEmotionHistory);

export default router;