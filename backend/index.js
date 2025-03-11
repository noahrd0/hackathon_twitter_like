import express from 'express';
import { connectDB } from './config/db.js';
import UserRoutes from './routes/UserRoutes.js';
import TweetRoutes from './routes/TweetRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/api/users', UserRoutes);
app.use('/api/tweets', TweetRoutes);

app.get('/status', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
});

app.listen(PORT, () => {
    connectDB();
    console.log('Server started at http://localhost:' + PORT);
});
