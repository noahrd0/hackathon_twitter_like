import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

// Définir le type de l'état 'emotion'
interface EmotionData {
    emotion: string;
    confidence: number;
    all_emotions: Record<string, number>;
}

const EmotionDetection: React.FC = () => {
    const [emotion, setEmotion] = useState<EmotionData | null>(null);  // Type de l'état
    const webcamRef = useRef<Webcam>(null);

    // Fonction pour prendre une photo de la webcam
    const capture = async () => {
        const imageSrc = webcamRef.current?.getScreenshot();

        if (imageSrc) {
            // Convertir l'image en base64 (retirer la partie du header 'data:image/jpeg;base64,')
            const base64Image = imageSrc.split(',')[1];

            // Envoyer l'image au backend pour analyse
            try {
                const response = await axios.post('http://localhost:5000/api/emotion/detect', { image: base64Image });
                if (response.data) {
                    setEmotion(response.data);  // Mettre à jour l'état avec la réponse
                }
            } catch (error) {
                console.error('Error detecting emotion:', error);
            }
        }
    };

    return (
        <div>
            <h2>Emotion Detection</h2>
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width="100%"
            />
            <button onClick={capture}>Capture Image</button>

            {emotion && (
                <div>
                    <h3>Detected Emotion: {emotion.emotion}</h3>
                    <p>Confidence: {emotion.confidence}</p>
                    <pre>{JSON.stringify(emotion.all_emotions, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default EmotionDetection;



