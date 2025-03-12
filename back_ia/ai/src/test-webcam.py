import cv2

def test_webcam():
    print("Test d'accès à la webcam...")
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("❌ Erreur: Impossible d'accéder à la webcam")
        return False
        
    # Lire une image
    ret, frame = cap.read()
    if not ret:
        print("❌ Erreur: Impossible de lire l'image de la webcam")
        cap.release()
        return False
    
    # Afficher l'image pendant 3 secondes
    print("✅ Webcam accessible! Affichage de 3 secondes...")
    cv2.imshow('Test Webcam', frame)
    cv2.waitKey(3000)
    
    cap.release()
    cv2.destroyAllWindows()
    print("✅ Test de webcam réussi!")
    return True

if __name__ == "__main__":
    test_webcam()