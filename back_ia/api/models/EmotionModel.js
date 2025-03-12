import mongoose from 'mongoose';

const emotionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    emotion: {
        type: String,
        required: true,
        enum: ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']
    },
    confidence: {
        type: Number,
        required: true
    },
    allEmotions: {
        type: Map,
        of: Number,
        required: false
    },
    imageHash: {
        type: String,
        required: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Emotion', emotionSchema);