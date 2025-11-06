# Déploiement sur Railway

## Instructions de déploiement

### 1. Configuration des variables d'environnement sur Railway

Dans Railway Dashboard, configurez ces variables d'environnement :

```bash
NODE_ENV=production
PORT=3001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secure_jwt_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
CORS_ORIGIN=https://your-domain.railway.app
RATE_LIMIT_MAX=100
```

### 2. Configuration MongoDB

#### Option A : MongoDB Atlas (Recommandé)
1. Créez un cluster MongoDB Atlas
2. Obtenez l'URI de connexion
3. Configurez `MONGODB_URI` avec cette URI

#### Option B : Railway MongoDB Plugin
1. Ajoutez le plugin MongoDB dans Railway
2. Railway configurera automatiquement `MONGODB_URI`

### 3. Build et déploiement

Railway détectera automatiquement votre application Node.js et utilisera :
- `npm install` pour installer les dépendances
- `npm start` pour démarrer l'application

### 4. Variables d'environnement critiques

- **MONGODB_URI** : URI de connexion à MongoDB
- **JWT_SECRET** : Secret pour les tokens JWT (générez un secret fort)
- **CORS_ORIGIN** : Domaine de votre frontend déployé

### 5. Debugging

Si le déploiement échoue, vérifiez :
1. Les logs Railway pour les erreurs de connexion MongoDB
2. Que toutes les variables d'environnement sont configurées
3. Que MongoDB est accessible depuis Railway

### 6. Domaine custom

Une fois déployé, configurez votre domaine custom dans Railway et mettez à jour `CORS_ORIGIN`.