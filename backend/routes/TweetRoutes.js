import express from 'express';
import {
    createTweet,
    likeTweet,
    retweetTweet,
    getTweet,
    bookmarkTweet,
    replyToTweet,
    getReplies
} from '../controllers/TweetController.js';
import { authMiddleware } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

router.post('/create', authMiddleware, createTweet);
router.post('/reply/:id', authMiddleware, replyToTweet);
router.get('/reply/:id', authMiddleware, getReplies);
router.put('/like/:id', authMiddleware, likeTweet);
router.put('/retweet/:id', authMiddleware, retweetTweet);
router.put('/bookmark/:id', authMiddleware, bookmarkTweet);
router.get('/:id', authMiddleware, getTweet);
router.get('/', authMiddleware, getTweet);

export default router;