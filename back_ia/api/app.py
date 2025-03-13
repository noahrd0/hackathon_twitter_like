from flask import Flask, request, jsonify
from deepface import DeepFace
import base64
import io
from PIL import Image
import numpy as np
import cv2
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Permet à ton frontend de faire des requêtes vers ce backend

@app.route('/api/emotion/detect', methods=['POST'])
def emotion_detection():
    # Vérifie si l'image a été envoyée
    data = request.get_json()
    if 'image' not in data:
        return jsonify({"error": "No image provided"}), 400

    # Récupère l'image en base64
    img_data = base64.b64decode(data['image'])
    
    # Convertir l'image en format utilisable par DeepFace
    image = Image.open(io.BytesIO(img_data))
    image = np.array(image)
    
    # Convertir l'image en format BGR pour OpenCV
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
    
    # Analyser l'émotion avec DeepFace
    try:
        analysis = DeepFace.analyze(image, actions=['emotion'], enforce_detection=False)
        emotion = analysis[0]['dominant_emotion']
        confidence = analysis[0]['emotion'][emotion]
        
        # Renvoyer la réponse
        return jsonify({
            "emotion": emotion,
            "confidence": confidence,
            "all_emotions": analysis[0]['emotion']
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)



