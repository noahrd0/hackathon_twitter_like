import express from 'express';
import {
    createTweet,
    likeTweet,
    retweetTweet,
    getTweet,
    bookmarkTweet,
    replyToTweet,
    getReplies,
    getBookmarks,
    getTweetFromUser,
    searchTweet,
    getUserNotifications
} from '../controllers/TweetController.js';
import { authMiddleware } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

router.get('/notifications', authMiddleware, getUserNotifications);
router.get('/getuserprofile', authMiddleware, getTweetFromUser);
router.get('/getuserprofile/:username', authMiddleware, getTweetFromUser);
router.post('/create', authMiddleware, createTweet);
router.post('/reply/:id', authMiddleware, replyToTweet);
router.get('/reply/:id', authMiddleware, getReplies);
router.get('/bookmark', authMiddleware, getBookmarks);
router.put('/like/:id', authMiddleware, likeTweet);
router.put('/retweet/:id', authMiddleware, retweetTweet);
router.put('/bookmark/:id', authMiddleware, bookmarkTweet);
router.get('/search/:searchTerm', authMiddleware, searchTweet);
router.get('/:id', authMiddleware, getTweet);
router.get('/', authMiddleware, getTweet);

export default router;