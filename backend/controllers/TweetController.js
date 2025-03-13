import User from "../models/UserModel.js";
import Tweet from "../models/TweetModel.js";
import { decodeToken } from "../config/jwt.js";

export const createTweet = async (req, res) => {
    const { content, image, video } = req.body;
    console.log(req.body);
    if (!content) {
        return res.status(400).json({ message: 'Please provide content' });
    }

    // Get the User ID from the token
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = decodeToken(token);
    const author = await User.findById(decodedToken.id);

    // Parse content
    let hashtags = [];
    let mentions = [];

    const words = content.split(' ');
    words.forEach(async word => {
        console.log(word);
        if (word.startsWith('#')) {
            hashtags.push(word.slice(1));
        } else if (word.startsWith('@')) {
            console.log('mention', word);
            let userMentionned = await User.findOne({ username: word.slice(1) });
            if (userMentionned) {
                mentions.push(userMentionned._id);
            }
        }   
    });

    console.log(hashtags, mentions);
    try {
        const tweet = await Tweet.create({
            "content": content,
            "author": author._id,
            "image": image,
            "video": video,
            "hashtags": hashtags,
            "mentions": mentions
        });
        return res.status(201).json(tweet);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const likeTweet = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ message: 'Please provide tweet ID' });
    }

    // Get the User ID from the token
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = decodeToken(token);
    const user = await User.findById(decodedToken.id);

    try {
        const tweet = await Tweet.findById(req.params.id);
        if (tweet.likes.includes(user._id)) {
            // Unlike the tweet
            tweet.likes = tweet.likes.filter(like => like.toString() !== user._id.toString());
        } else {
            // Like the tweet
            tweet.likes.push(user._id);
        }
        await tweet.save();
        return res.status(200).json(tweet);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const retweetTweet = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ message: 'Please provide tweet ID' });
    }

    // Get the User ID from the token
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = decodeToken(token);
    const user = await User.findById(decodedToken.id);

    try {
        const tweet = await Tweet.findById(req.params.id);
        if (tweet.retweets.includes(user._id)) {
            // Unretweet the tweet
            tweet.retweets = tweet.retweets.filter(retweet => retweet.toString() !== user._id.toString());
        } else {
            // Retweet the tweet
            tweet.retweets.push(user._id);
        }
        await tweet.save();
        return res.status(200).json(tweet);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const bookmarkTweet = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ message: 'Please provide tweet ID' });
    }

    // Get the User ID from the token
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = decodeToken(token);
    const user = await User.findById(decodedToken.id);

    try {
        const tweet = await Tweet.findById(req.params.id);
        if (tweet.bookmarks.includes(user._id)) {
            // Unbookmark the tweet
            tweet.bookmarks = tweet.bookmarks.filter(bookmark => bookmark.toString() !== user._id.toString());
        } else {
            // Bookmark the tweet
            tweet.bookmarks.push(user._id);
        }
        await tweet.save();
        return res.status(200).json(tweet);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getTweet = async (req, res) => {
    if (!req.params.id) {
        // Show all tweets with replyTo field empty
        try {
            const tweets = await Tweet.find({ replyTo: { $exists: false } })
                .populate('author', 'username profilePicture')
                .populate('mentions', 'username profilePicture')
                .sort({ timestamp: -1 });
            return res.status(200).json(tweets);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    } else {
        // Show single tweet
        try {
            const tweet = await Tweet.findById(req.params.id)
                .populate('author', 'username profilePicture')
                .populate('mentions', 'username profilePicture');
            return res.status(200).json(tweet);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

export const getFeed = async (req, res) => {
    // Get the User ID from the token
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = decodeToken(token);
    const user = await User.findById(decodedToken.id);

    try {
        const tweets = await Tweet.find({ author: { $in: user.following } });
        return res.status(200).json(tweets);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const replyToTweet = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ message: 'Please provide tweet ID' });
    }

    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ message: 'Please provide content' });
    }

    // Get the User ID from the token
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = decodeToken(token);
    const author = await User.findById(decodedToken.id);

    // Parse content
    let hashtags = [];
    let mentions = [];

    const words = content.split(' ');
    words.forEach(async word => {
        console.log(word);
        if (word.startsWith('#')) {
            hashtags.push(word.slice(1));
        } else if (word.startsWith('@')) {
            console.log('mention', word);
            let userMentionned = await User.findOne({ username: word.slice(1) });
            if (userMentionned) {
                mentions.push(userMentionned._id);
            }
        }   
    });

    try {
        const tweet = await Tweet.create({
            "content": content,
            "author": author._id,
            "replyTo": req.params.id,
            "hashtags": hashtags,
            "mentions": mentions
        });
        return res.status(201).json(tweet);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getReplies = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ message: 'Please provide tweet ID' });
    }

    try {
        const tweets = await Tweet.find({ replyTo: req.params.id })
            .populate('author', 'username profilePicture')
            .populate('mentions', 'username profilePicture')
            .sort({ timestamp: -1 });

        return res.status(200).json(tweets);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getBookmarks = async (req, res) => {
    // Get the User ID from the token
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = decodeToken(token);
    const user = await User.findById(decodedToken.id);

    try {
        const tweets = await Tweet.find({ bookmarks: user._id })
            .populate('author', 'username profilePicture')
            .populate('mentions', 'username profilePicture')
            .sort({ timestamp: -1 });
        return res.status(200).json(tweets);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getTweetFromUser = async (req, res) => {
    if (req.params.username) {
        try {
            const user = await User.findOne({ username: req.params.username });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const tweets = await Tweet.find({ author: user._id })
                .populate('author', 'username profilePicture')
                .populate('mentions', 'username profilePicture')
                .sort({ timestamp: -1 });

            // Remove duplicates where the user has retweeted their own tweet
            const uniqueTweets = tweets.filter((tweet, index, self) =>
                index === self.findIndex((t) => (
                    t._id.toString() === tweet._id.toString()
                ))
            );

            return res.status(200).json(uniqueTweets);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    } else {
        try {
            // Get the User ID from the token
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = decodeToken(token);
            const user = await User.findById(decodedToken.id);

            const tweets = await Tweet.find({
                $or: [
                    { author: user._id, replyTo: { $exists: false } },
                    { retweets: user._id, replyTo: { $exists: false } }
                ]
            })
                .populate('author', 'username profilePicture')
                .populate('mentions', 'username profilePicture')
                .sort({ timestamp: -1 });

            // Remove duplicates where the user has retweeted their own tweet
            const uniqueTweets = tweets.filter((tweet, index, self) =>
                index === self.findIndex((t) => (
                    t._id.toString() === tweet._id.toString()
                ))
            );

            return res.status(200).json(uniqueTweets);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

export const searchTweet = async (req, res) => {
    if (!req.params.searchTerm) {
        return res.status(400).json({ message: 'Please provide a search term' });
    }

    try {
        const tweets = await Tweet.find({ content: { $regex: req.params.searchTerm, $options: 'i' } })
            .populate('author', 'username profilePicture')
            .populate('mentions', 'username profilePicture')
            .sort({ timestamp: -1 });
        return res.status(200).json(tweets);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getUserNotifications = async (req, res) => {
    // Get the User ID from the token
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = decodeToken(token);
    const user = await User.findById(decodedToken.id);

    try {
        // Find all tweets authored by the user
        const userTweets = await Tweet.find({ author: user._id })
            .populate('likes', 'username profilePicture')
            .populate('retweets', 'username profilePicture')
            .populate('author', 'username profilePicture')
            .lean(); // Use lean for better performance
        
        // Transform the data into notifications format
        const notifications = [];
        
        // Process each tweet to extract notifications
        userTweets.forEach(tweet => {
            // Add like notifications - one per like
            tweet.likes.forEach(liker => {
                // Don't create notification if user liked their own tweet
                if (liker._id.toString() !== user._id.toString()) {
                    notifications.push({
                        type: 'like',
                        user: liker,
                        tweet: {
                            _id: tweet._id,
                            content: tweet.content,
                            timestamp: tweet.timestamp
                        },
                        timestamp: tweet.timestamp // Using tweet timestamp as approximation
                    });
                }
            });
            
            // Add retweet notifications - one per retweet
            tweet.retweets.forEach(retweeter => {
                // Don't create notification if user retweeted their own tweet
                if (retweeter._id.toString() !== user._id.toString()) {
                    notifications.push({
                        type: 'retweet',
                        user: retweeter,
                        tweet: {
                            _id: tweet._id,
                            content: tweet.content,
                            timestamp: tweet.timestamp
                        },
                        timestamp: tweet.timestamp // Using tweet timestamp as approximation
                    });
                }
            });
        });
        
        // Sort notifications by timestamp (newest first)
        notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        return res.status(200).json(notifications);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}