FROM node:latest

WORKDIR /app
 
RUN apt -y update && apt -y upgrade
 
# Installation complète des dépendances système
RUN apt -y install curl less vim zsh python3 python3-pip python3-venv libgl1-mesa-glx libglib2.0-0
 
RUN yes | sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
 
RUN npm install -g npm@11.1.0

# Créer un environnement virtuel Python pour éviter les erreurs d'environnement géré
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Installer les dépendances Python dans le bon ordre
RUN pip install --upgrade pip wheel setuptools
RUN pip install numpy==1.24.2
RUN pip install tensorflow==2.12.0
RUN pip install opencv-python matplotlib
RUN pip install deepface==0.0.79

COPY . .

# Installation des dépendances Node.js
RUN npm install

# Créer un script de démarrage pour initialiser l'environnement virtuel
RUN echo '#!/bin/bash\nsource /opt/venv/bin/activate\nnpm run dev' > /app/start.sh
RUN chmod +x /app/start.sh

# Lancer le serveur
CMD ["/app/start.sh"]