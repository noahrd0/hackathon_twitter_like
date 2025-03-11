import { spawn } from 'child_process';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import EmotionModel from '../models/EmotionModel.js';

// Obtenir le chemin absolu du répertoire actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

export const detectEmotion = async (req, res) => {
    if (!req.body.image) {
        return res.status(400).json({ message: 'Image required' });
    }

    try {
        // Créer un hash de l'image pour référence
        const imageHash = crypto
            .createHash('md5')
            .update(req.body.image.substring(0, 1000))
            .digest('hex');
            
        console.log("Démarrage de l'analyse d'émotion avec DeepFace...");

        // Utiliser le script DeepFace
        const pythonScript = path.join(rootDir, 'ai', 'src', 'predict_deepface.py');
        console.log(`Script Python: ${pythonScript}`);
        
        // Enregistrer l'image dans un fichier temporaire
        const tempImagePath = path.join(rootDir, 'temp_image.txt');
        fs.writeFileSync(tempImagePath, req.body.image);
        
        // Lancer le processus Python
        const pythonProcess = spawn('python3', [
            pythonScript,
            tempImagePath
        ]);

        let result = '';
        let errorOutput = '';

        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
            console.log(`Sortie Python: ${data}`);
        });

        pythonProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
            console.error(`Erreur Python: ${data}`);
        });

        pythonProcess.on('close', async (code) => {
            // Supprimer le fichier temporaire
            try {
                fs.unlinkSync(tempImagePath);
            } catch (err) {
                console.error("Erreur lors de la suppression du fichier temporaire:", err);
            }
            
            if (code !== 0) {
                console.error(`Processus Python terminé avec code: ${code}`);
                console.error(`Erreur: ${errorOutput}`);
                return res.status(500).json({ 
                    message: 'Error processing image',
                    error: errorOutput
                });
            }
            
            try {
                const emotionData = JSON.parse(result);
                
                // Si une émotion valide a été détectée
                if (emotionData.emotion && emotionData.emotion !== 'No face detected') {
                    // Enregistrer l'émotion détectée dans la base de données
                    const emotion = new EmotionModel({
                        userId: req.userId,
                        emotion: emotionData.emotion,
                        confidence: emotionData.confidence || 0,
                        imageHash: imageHash
                    });
                    
                    await emotion.save();
                }
                
                return res.status(200).json(emotionData);
            } catch (error) {
                console.error('Error parsing emotion data:', error);
                console.error('Raw result:', result);
                return res.status(500).json({ 
                    message: 'Error processing emotion data',
                    error: error.message,
                    raw: result
                });
            }
        });

    } catch (error) {
        console.error("Error in detectEmotion:", error);
        return res.status(500).json({ message: error.message });
    }
};

export const getEmotionHistory = async (req, res) => {
    try {
        const emotions = await EmotionModel.find({ userId: req.userId })
            .sort({ timestamp: -1 })
            .limit(10);
        
        return res.status(200).json(emotions);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};