# Docker pour Vue.js + Express + MongoDB

Ce projet contient tous les fichiers nécessaires pour dockeriser votre application Vue.js avec serveur Express et base de données MongoDB.

## 📁 Fichiers Docker créés

- `Dockerfile` - Configuration multi-stage pour build et production
- `docker-compose.yml` - Orchestration des services
- `.dockerignore` - Fichiers à exclure du build
- `nginx.conf` - Configuration Nginx pour la production
- `.env.docker` - Variables d'environnement template
- `server/healthcheck.js` - Script de vérification santé
- `mongo-init/init-mongo.sh` - Script d'initialisation MongoDB

## 🚀 Démarrage rapide

### 1. Préparer l'environnement

```bash
# Copier et configurer les variables d'environnement
copy .env.docker .env

# Éditer le fichier .env avec vos valeurs
```

### 2. Lancer en mode développement

```bash
# Démarrer tous les services (avec Mongo Express pour l'admin)
docker-compose --profile development up -d

# Voir les logs
docker-compose logs -f vue-app
```

### 3. Lancer en mode production

```bash
# Démarrer avec Nginx
docker-compose --profile production up -d

# Ou sans Nginx (accès direct à l'app)
docker-compose up -d vue-app mongodb
```

## 🌐 Accès aux services

| Service | URL | Description |
|---------|-----|-------------|
| Application | http://localhost:3001 | Application Vue.js + API |
| Nginx | http://localhost:80 | Proxy vers l'application |
| MongoDB | localhost:27017 | Base de données |
| Mongo Express | http://localhost:8081 | Interface admin MongoDB |

## 📋 Commandes utiles

### Gestion des conteneurs

```bash
# Construire l'image
docker-compose build

# Redémarrer un service
docker-compose restart vue-app

# Arrêter tous les services
docker-compose down

# Arrêter et supprimer les volumes
docker-compose down -v

# Voir l'état des services
docker-compose ps
```

### Logs et débogage

```bash
# Logs de l'application
docker-compose logs -f vue-app

# Logs MongoDB
docker-compose logs -f mongodb

# Entrer dans le conteneur de l'app
docker-compose exec vue-app sh

# Entrer dans MongoDB
docker-compose exec mongodb mongosh
```

### Sauvegarde et restauration

```bash
# Sauvegarder la base de données
docker-compose exec mongodb mongodump --host localhost --db bibliotheque --out /data/backup

# Restaurer la base de données
docker-compose exec mongodb mongorestore --host localhost --db bibliotheque /data/backup/bibliotheque
```

## ⚙️ Configuration

### Variables d'environnement importantes

- `MONGODB_URI` - URI de connexion MongoDB
- `JWT_SECRET` - Clé secrète pour les tokens JWT
- `CORS_ORIGIN` - Domaines autorisés pour CORS
- `NODE_ENV` - Environnement (development/production)

### Volumes Docker

- `mongodb_data` - Données persistantes MongoDB
- `./logs` - Logs de l'application

### Réseaux

- `vue-app-network` - Réseau bridge pour tous les services

## 🔒 Sécurité

### Recommandations de production

1. **Changez tous les mots de passe par défaut**
2. **Utilisez des secrets forts pour JWT**
3. **Configurez HTTPS avec des certificats SSL**
4. **Limitez l'accès aux ports externes**
5. **Activez les logs de sécurité**

### Configuration SSL

Pour activer HTTPS :

1. Placez vos certificats dans le dossier `ssl/`
2. Décommentez la configuration HTTPS dans `nginx.conf`
3. Redémarrez les services

## 🐛 Dépannage

### Problèmes courants

#### L'application ne démarre pas
```bash
# Vérifier les logs
docker-compose logs vue-app

# Vérifier la connectivité MongoDB
docker-compose exec vue-app node -e "console.log('MongoDB URI:', process.env.MONGODB_URI)"
```

#### Erreur de connexion MongoDB
```bash
# Vérifier que MongoDB est démarré
docker-compose ps mongodb

# Tester la connexion
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
```

#### Problèmes de ports
```bash
# Vérifier les ports utilisés
netstat -an | findstr "3001\|27017\|80"

# Modifier les ports dans docker-compose.yml si nécessaire
```

## 📊 Monitoring

### Healthchecks

Les services incluent des vérifications de santé :
- Application : vérifie l'endpoint `/api/health`
- MongoDB : teste la commande `ping`

### Métriques

```bash
# Utilisation des ressources
docker stats

# Espace disque des volumes
docker system df
```

## 🔄 Mise à jour

```bash
# Reconstruire et redémarrer
docker-compose up -d --build

# Mettre à jour seulement l'application
docker-compose up -d --build vue-app
```

## 📚 Documentation supplémentaire

- [Docker Compose](https://docs.docker.com/compose/)
- [MongoDB Docker](https://hub.docker.com/_/mongo)
- [Nginx Docker](https://hub.docker.com/_/nginx)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)