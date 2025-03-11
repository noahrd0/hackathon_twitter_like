import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/UserRoutes.js';
import emotionRoutes from './api/routes/EmotionRoutes.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://db-container:27017/twitter_like';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB Error:', err));

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/emotion', emotionRoutes);

// Base route for API testing
app.get('/', (req, res) => {
  res.json({ message: 'API is working correctly' });
});

// Add simple test routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'API de test fonctionne' });
});

// Server startup with error handling
const server = app.listen(PORT)
  .on('listening', () => {
    console.log(`Server started at http://localhost:${PORT}`);
  })
  .on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Error: Port ${PORT} is already in use`);
      console.log('👉 Try changing the PORT number in the code');
      process.exit(1);
    } else {
      console.error('Server error:', err);
    }
  });
