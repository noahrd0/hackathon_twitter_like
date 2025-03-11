# API TWITTER-LIKE - DOCUMENTATION COMPLETE

## INTRODUCTION
Cette API fournit les fonctionnalités essentielles d'un réseau social de type Twitter, incluant la gestion des utilisateurs, l'authentification, et les interactions avec les tweets.

## CONFIGURATION ET INSTALLATION

### PREREQUIS:
- Docker et Docker Compose
- Node.js et npm (pour le développement local)

### INSTALLATION ET DEMARRAGE:
1. Cloner le dépôt
    ```bash
    git clone https://github.com/noahrd0/hackathon_twitter_like.git
    cd hackathon_twitter_like
    ```

2. Créer un fichier `.env` avec les variables suivantes
    ```env
    PORT=3000
    MONGO_URI=mongodb://db-container:27017/twitter_like
    JWT_SECRET=votre_secret_jwt_ici
    ```

3. Démarrer l'application avec Docker
    ```bash
    ./run.sh
    ```

## AUTHENTIFICATION
Toutes les routes (sauf login/register) nécessitent un token Bearer dans l'en-tête Authorization.
Format: `Authorization: Bearer {token}`

## ROUTES UTILISATEURS

### POST /api/users/register
Crée un nouvel utilisateur.
- **Body:** `{ username, email, password }`
- **Réponse:** `{ token: "Bearer token" }`
- **Codes:** 201 (Créé), 400 (Erreur de validation), 500 (Erreur serveur)

### POST /api/users/login
Connecte un utilisateur existant.
- **Body:** `{ email, password }`
- **Réponse:** `{ token: "Bearer token" }`
- **Codes:** 200 (Succès), 400 (Identifiants invalides), 500 (Erreur serveur)

### PUT /api/users/update/:id
Met à jour les informations d'un utilisateur.
- **Paramètres URL:** `id` (ID de l'utilisateur)
- **Body:** Champs à modifier (username, email, bio, profilePicture, bannerPicture)
- **Réponse:** Objet utilisateur mis à jour
- **Codes:** 200 (Succès), 400 (Erreur de validation), 500 (Erreur serveur)

### GET /api/users/:id
Récupère les informations d'un utilisateur spécifique.
- **Paramètres URL:** `id` (ID de l'utilisateur)
- **Réponse:** Objet utilisateur
- **Codes:** 200 (Succès), 500 (Erreur serveur)

### GET /api/users
Récupère tous les utilisateurs.
- **Réponse:** Tableau d'objets utilisateurs
- **Codes:** 200 (Succès), 500 (Erreur serveur)

### DELETE /api/users/:id
Supprime un utilisateur.
- **Paramètres URL:** `id` (ID de l'utilisateur)
- **Réponse:** `{ "message": "User deleted" }`
- **Codes:** 200 (Succès), 400 (ID manquant), 500 (Erreur serveur)

### PUT /api/users/follow/:id
Suit ou se désabonne d'un utilisateur.
- **Paramètres URL:** `id` (ID de l'utilisateur à suivre/ne plus suivre)
- **Body:** `{ "userId": "ID de l'utilisateur courant" }`
- **Réponse:** `{ "message": "User followed" }` ou `{ "message": "User unfollowed" }`
- **Codes:** 200 (Succès), 400 (ID manquant), 500 (Erreur serveur)

## ROUTES DES TWEETS

### POST /api/tweets/create
Crée un nouveau tweet.
- **Body:** `{ content, image (optionnel), video (optionnel) }`
- **Notes:** 
  - Les hashtags (#) dans le contenu sont automatiquement détectés
  - Les mentions (@) dans le contenu sont automatiquement détectées
- **Réponse:** Objet tweet créé
- **Codes:** 201 (Créé), 400 (Contenu manquant), 500 (Erreur serveur)

### POST /api/tweets/reply/:id
Répond à un tweet existant.
- **Paramètres URL:** `id` (ID du tweet parent)
- **Body:** `{ content }`
- **Notes:** 
  - Les hashtags et mentions sont également détectés
- **Réponse:** Objet tweet créé avec référence au tweet parent
- **Codes:** 201 (Créé), 400 (ID ou contenu manquant), 500 (Erreur serveur)

### PUT /api/tweets/like/:id
Aime ou retire le like d'un tweet (bascule).
- **Paramètres URL:** `id` (ID du tweet)
- **Réponse:** Objet tweet mis à jour
- **Codes:** 200 (Succès), 400 (ID manquant), 500 (Erreur serveur)

### PUT /api/tweets/retweet/:id
Retweete ou annule le retweet d'un tweet (bascule).
- **Paramètres URL:** `id` (ID du tweet)
- **Réponse:** Objet tweet mis à jour
- **Codes:** 200 (Succès), 400 (ID manquant), 500 (Erreur serveur)

### PUT /api/tweets/bookmark/:id
Ajoute ou retire un tweet des signets (bascule).
- **Paramètres URL:** `id` (ID du tweet)
- **Réponse:** Objet utilisateur mis à jour avec la liste des signets
- **Codes:** 200 (Succès), 400 (ID manquant), 500 (Erreur serveur)

### GET /api/tweets/:id
Récupère un tweet spécifique.
- **Paramètres URL:** `id` (ID du tweet)
- **Réponse:** Objet tweet
- **Codes:** 200 (Succès), 500 (Erreur serveur)

### GET /api/tweets
Récupère tous les tweets.
- **Réponse:** Tableau d'objets tweets
- **Codes:** 200 (Succès), 500 (Erreur serveur)

## VERIFICATION DU STATUT DU SERVEUR

### GET /status
Vérifie si le serveur est opérationnel.
- **Réponse:** `{ "message": "Server is running" }`
- **Code:** 200 (Succès)

## MODELES DE DONNEES

### Modèle Utilisateur
```json
{
  "username": "String",       // Unique
  "email": "String",          // Unique
  "password": "String",       // Haché
  "bio": "String",
  "profilePicture": "String",
  "bannerPicture": "String",
  "followers": ["ObjectId"],  // Références aux utilisateurs
  "following": ["ObjectId"],  // Références aux utilisateurs
  "bookmarks": ["ObjectId"]   // Références aux tweets
}
```

### Modèle Tweet
```json
{
  "content": "String",
  "author": "ObjectId",       // Référence à l'utilisateur
  "image": "String",
  "video": "String",
  "hashtags": ["String"],
  "mentions": ["ObjectId"],   // Références aux utilisateurs
  "likes": ["ObjectId"],      // Références aux utilisateurs
  "retweets": ["ObjectId"],   // Références aux utilisateurs
  "replyTo": "ObjectId",      // Référence au tweet parent
  "timestamp": "Date"
}
```

## NOTES DE SECURITE
- Les mots de passe sont hachés avec bcrypt avant d'être stockés
- L'authentification utilise des tokens JWT avec une durée de validité de 1 heure