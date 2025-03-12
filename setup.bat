@echo off
echo Installation de l'application Twitter-like avec détection d'émotions...
echo.

REM Vérifier si Node.js est installé
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js n'est pas installé! Téléchargez-le sur https://nodejs.org/
    exit /b
)

REM Vérifier si Python est installé
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo Python n'est pas installé! Téléchargez-le sur https://www.python.org/downloads/
    exit /b
)

REM Vérifier si MongoDB est installé
sc query MongoDB >nul 2>&1
if %errorlevel% neq 0 (
    echo MongoDB n'est pas installé! Téléchargez-le sur https://www.mongodb.com/try/download/community
    echo ou utilisez Docker pour le démarrer avec: docker run -d -p 27017:27017 mongo
)

REM Installer les dépendances Node.js
echo Installation des dépendances Node.js...
call npm install

REM Créer et configurer l'environnement virtuel Python
echo Configuration de l'environnement Python...
python -m venv .venv
call .venv\Scripts\activate.bat

REM Installer les dépendances Python dans l'ordre correct
echo Installation des dépendances Python...
pip install numpy==1.24.2
pip install tensorflow==2.12.0
pip install -r ai/requirements.txt

REM Créer le fichier .env s'il n'existe pas
if not exist .env (
    echo Création du fichier .env...
    echo MONGO_URI=mongodb://localhost:27017/twitter_like > .env
    echo JWT_SECRET=votre_secret_jwt_super_securise >> .env
    echo PORT=3000 >> .env
    echo EMOTION_ENGINE=deepface >> .env
)

REM Démarrer MongoDB si possible
echo Tentative de démarrage de MongoDB...
net start MongoDB >nul 2>&1
if %errorlevel% neq 0 (
    echo Impossible de démarrer MongoDB. Assurez-vous qu'il est installé et configuré correctement.
)

echo.
echo ========================================
echo Installation terminée!
echo.
echo Pour démarrer l'application:
echo 1. Activez l'environnement virtuel: .\.venv\Scripts\activate
echo 2. Démarrez l'application: npm run dev
echo.
echo Pour tester la détection d'émotions:
echo Dans un nouveau terminal avec l'environnement activé:
echo python ai\src\realtime_deepface.py
echo ========================================