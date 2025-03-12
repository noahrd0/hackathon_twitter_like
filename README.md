# Twitter-like App with Emotion Recognition

Cette application Twitter-like inclut une fonctionnalité de reconnaissance d'émotions faciales qui utilise DeepFace pour déterminer l'émotion d'un utilisateur depuis une image.

## Fonctionnalités

- API REST complète pour gérer les utilisateurs
- Authentification avec JWT
- Reconnaissance des émotions faciales via DeepFace
- Stockage des émotions détectées dans MongoDB

## Méthodes d'installation

Choisissez **une** des deux méthodes suivantes:

### Méthode 1: Installation locale (sans Docker)

#### Prérequis
- Node.js v14+ ([Télécharger](https://nodejs.org/))
- Python 3.8+ ([Télécharger](https://www.python.org/downloads/))
- MongoDB ([Télécharger](https://www.mongodb.com/try/download/community))

#### Installation automatique (Windows)
```bash
# Exécutez ce script pour installer automatiquement
setup.bat
```

#### Installation manuelle
1. **Cloner le projet**
   ```bash
   git clone https://github.com/votre-user/hackathon_twitter_like.git
   cd hackathon_twitter_like
   ```

2. **Installer les dépendances Node.js**
   ```bash
   npm install
   ```

3. **Configurer Python et DeepFace**
   ```bash
   # Créer et activer l'environnement virtuel
   python -m venv .venv
   
   # Sur Windows:
   .\.venv\Scripts\activate
   # Sur Linux/Mac:
   source .venv/bin/activate
   
   # Installer les dépendances Python
   pip install -r ai/requirements.txt
   ```

4. **Configurer MongoDB**
   - Démarrez MongoDB localement
   - Vérifiez qu'il fonctionne sur le port 27017

5. **Créer le fichier .env**
   ```
   MONGO_URI=mongodb://localhost:27017/twitter_like
   JWT_SECRET=votre_secret_jwt_super_securise
   PORT=3000
   EMOTION_ENGINE=deepface
   ```

6. **Démarrer l'application**
   ```bash
   # Dans un terminal (avec l'environnement virtuel activé)
   npm run dev
   ```

7. **Tester la détection d'émotions**
   ```bash
   # Dans un autre terminal (avec l'environnement virtuel activé)
   python ai/src/realtime_deepface.py
   ```

### Méthode 2: Installation avec Docker

#### Prérequis
- Docker Desktop ([Télécharger](https://www.docker.com/products/docker-desktop))

#### Installation et lancement
```bash
# Cloner le projet
git clone https://github.com/votre-user/hackathon_twitter_like.git
cd hackathon_twitter_like

# Lancer avec Docker
./run.sh  # Sur Linux/Mac
# OU
run.bat  # Sur Windows
```

## Tester l'API

### Test avec Postman ou Insomnia
1. Créer un utilisateur:
   - POST http://localhost:3000/api/users/register
   - Body: `{"username":"test", "email":"test@test.com", "password":"test123"}`

2. Se connecter:
   - POST http://localhost:3000/api/users/login
   - Body: `{"email":"test@test.com", "password":"test123"}`
   - Enregistrer le token JWT retourné

3. Détecter une émotion:
   - POST http://localhost:3000/api/emotion/detect
   - Header: `Authorization: Bearer <votre_token_jwt>`
   - Body: `{"image":"<base64_de_l'image>"}`

### Test en ligne de commande (PowerShell)

```powershell
# Créer un utilisateur
$headers = @{ "Content-Type" = "application/json" }
$body = @{
    username = "test"
    email = "test@test.com"
    password = "test123"
} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:3000/api/users/register" -Method Post -Headers $headers -Body $body

# Se connecter
$loginBody = @{
    email = "test@test.com"
    password = "test123"
} | ConvertTo-Json
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/users/login" -Method Post -Headers $headers -Body $loginBody
$token = ($response.Content | ConvertFrom-Json).token
```

## Résolution des problèmes courants

### Problème: "Cannot find module"
```bash
npm install
```

### Problème: "Error: haarcascade_frontalface_default.xml not found"
```bash
# Télécharger manuellement le fichier cascade
curl -o ai/src/haarcascade_frontalface_default.xml https://raw.githubusercontent.com/opencv/opencv/master/data/haarcascades/haarcascade_frontalface_default.xml
```

### Problème: "MongoDB connection error"
```bash
# Vérifier que MongoDB est en cours d'exécution
# Sur Windows:
net start MongoDB
# Sur Linux:
sudo systemctl start mongod
```