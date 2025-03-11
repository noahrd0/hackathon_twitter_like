import cv2
import numpy as np
import time
import os

def realtime_emotion_detection():
    print("Démarrage de la détection d'émotions en temps réel avec DeepFace...")
    
    # On importe DeepFace ici pour éviter les erreurs d'importation si les dépendances ne sont pas correctes
    try:
        from deepface import DeepFace
    except ImportError as e:
        print(f"Erreur: Impossible d'importer DeepFace. {e}")
        print("Essayez: pip install tensorflow==2.12.0 deepface opencv-python matplotlib")
        return
    
    # Capture vidéo
    print("Ouverture de la webcam...")
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("Erreur: Impossible d'accéder à la webcam")
        return
    
    # Détecteur de visages
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    
    # Couleurs pour chaque émotion
    emotion_colors = {
        'angry': (0, 0, 255),      # Rouge
        'disgust': (0, 140, 255),  # Orange
        'fear': (0, 69, 255),      # Orange-rouge
        'happy': (0, 255, 0),      # Vert
        'neutral': (255, 255, 0),  # Cyan
        'sad': (255, 0, 0),        # Bleu
        'surprise': (255, 0, 255)  # Magenta
    }
    
    print("Chargement des modèles DeepFace...")
    # Précharger le modèle - utilisons une image de test pour éviter les erreurs
    # Création d'une image test simple
    dummy_img = np.ones((100, 100, 3), dtype=np.uint8) * 255
    try:
        _ = DeepFace.analyze(img_path=dummy_img, actions=['emotion'], enforce_detection=False)
        print("✅ Modèle DeepFace chargé avec succès!")
    except Exception as e:
        print(f"⚠️ Avertissement lors du préchargement: {e}")
        print("La première analyse pourrait être plus lente.")
    
    print("Détection d'émotions en temps réel. Appuyez sur 'q' pour quitter.")
    
    last_analysis_time = 0
    analysis_interval = 0.5  # analyser toutes les 0.5 secondes
    last_result = None
    
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Erreur: Impossible de lire l'image de la webcam")
            break
            
        # Détection de visage
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(
            gray, 
            scaleFactor=1.1,
            minNeighbors=5, 
            minSize=(30, 30),
            flags=cv2.CASCADE_SCALE_IMAGE
        )
        
        # Afficher un message si aucun visage n'est détecté
        if len(faces) == 0:
            cv2.putText(frame, "No face detected", (20, 60), 
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        
        # Analyser avec DeepFace seulement à intervalles réguliers (pour éviter de ralentir)
        current_time = time.time()
        if current_time - last_analysis_time > analysis_interval and len(faces) > 0:
            last_analysis_time = current_time
            
            x, y, w, h = faces[0]  # Utiliser le premier visage détecté
            face_img = frame[y:y+h, x:x+w]
            
            try:
                # Analyse d'émotion avec DeepFace
                result = DeepFace.analyze(
                    img_path=face_img, 
                    actions=['emotion'], 
                    enforce_detection=False,
                    silent=True  # Réduire les messages de console
                )
                last_result = result
            except Exception as e:
                print(f"Erreur d'analyse: {e}")
        
        # Afficher les résultats
        for (x, y, w, h) in faces:
            # Rectangle autour du visage
            cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 255, 255), 2)
            
            # Afficher les émotions si on a un résultat
            if last_result is not None:
                try:
                    emotions = last_result[0]['emotion']
                    
                    # Trouver l'émotion dominante
                    dominant_emotion = max(emotions, key=emotions.get)
                    confidence = emotions[dominant_emotion]
                    
                    # Couleur en fonction de l'émotion
                    color = emotion_colors.get(dominant_emotion, (255, 255, 255))
                    
                    # Affichage du résultat
                    text = f"{dominant_emotion} ({confidence:.2f})"
                    cv2.putText(frame, text, (x, y-10), 
                               cv2.FONT_HERSHEY_SIMPLEX, 0.8, 
                               color, 2)
                               
                    # Affichage de toutes les probabilités
                    y_offset = y + h + 20
                    for emotion, score in emotions.items():
                        prob_text = f"{emotion}: {score:.2f}"
                        cv2.putText(frame, prob_text, (x, y_offset), 
                                   cv2.FONT_HERSHEY_SIMPLEX, 0.5, 
                                   (200, 200, 200), 1)
                        y_offset += 20
                except Exception as e:
                    print(f"Erreur d'affichage: {e}")
        
        # Affichage
        cv2.imshow('Emotion Detection (DeepFace)', frame)
        
        # Quitter avec 'q'
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()
    print("Détection terminée")

if __name__ == "__main__":
    realtime_emotion_detection()