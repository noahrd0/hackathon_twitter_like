import express from 'express';
import {
    createTweet,
    likeTweet,
    retweetTweet,
    getTweet
} from '../controllers/TweetController.js';
import { authMiddleware } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

router.post('/create', authMiddleware, createTweet);
router.put('/like/:id', authMiddleware, likeTweet);
router.put('/retweet/:id', authMiddleware, retweetTweet);
router.get('/:id', authMiddleware, getTweet);
router.get('/', authMiddleware, getTweet);

export default router;