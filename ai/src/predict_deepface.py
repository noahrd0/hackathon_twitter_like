import sys
import json
import base64
import numpy as np
import cv2
import os
from deepface import DeepFace

def predict_emotion_with_deepface(image_path_or_base64):
    try:
        # Vérifier si l'entrée est un chemin de fichier
        if os.path.exists(image_path_or_base64):
            with open(image_path_or_base64, 'r') as f:
                image_base64 = f.read()
        else:
            image_base64 = image_path_or_base64
            
        # Décodage de l'image
        try:
            image_bytes = base64.b64decode(image_base64)
            np_arr = np.frombuffer(image_bytes, np.uint8)
            image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        except Exception as e:
            return {"error": f"Failed to decode image: {str(e)}"}
        
        if image is None:
            return {"error": "Failed to decode image, result is None"}
            
        # Analyse d'émotion avec DeepFace
        result = DeepFace.analyze(
            img_path=image,
            actions=['emotion'],
            enforce_detection=False,
            silent=True
        )
        
        if not result:
            return {"emotion": "No face detected", "confidence": 0}
            
        # Extraction de l'émotion dominante
        emotions = result[0]['emotion']
        dominant_emotion = max(emotions, key=emotions.get)
        confidence = emotions[dominant_emotion]
        
        return {
            "emotion": dominant_emotion,
            "confidence": confidence,
            "all_emotions": emotions
        }
        
    except Exception as e:
        import traceback
        return {"error": str(e), "traceback": traceback.format_exc()}

if __name__ == "__main__":
    if len(sys.argv) > 1:
        result = predict_emotion_with_deepface(sys.argv[1])
        print(json.dumps(result))
    else:
        print(json.dumps({"error": "No image path provided"}))