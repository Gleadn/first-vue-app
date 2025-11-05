# Guide de Déploiement

## Architecture de Déploiement

Cette application utilise une architecture CI/CD complète avec GitHub Actions pour automatiser les tests, la construction et le déploiement.

### Structure du Projet

```
first-vue-app/
├── .github/workflows/     # Pipelines CI/CD
├── client/               # Application Vue.js frontend
├── server/               # API Express.js backend
├── docker-compose.yml    # Configuration Docker locale
├── Dockerfile           # Image Docker pour production
└── README.md           # Documentation principale
```

## Environnements

### 1. Développement Local

#### Prérequis
- Node.js 18+ 
- MongoDB 7.0+
- Docker (optionnel)

#### Installation et Démarrage

```bash
# Installation des dépendances client
cd client
npm install

# Installation des dépendances serveur
cd ../server
npm install

# Démarrage avec Docker Compose
cd ..
docker-compose up -d

# Ou démarrage manuel
cd server && npm run dev &
cd client && npm run dev
```

### 2. Staging

L'environnement de staging se déclenche automatiquement sur les pushs vers la branche `develop`.

**URL**: https://staging.votre-app.com
**Base de données**: MongoDB staging (isolée)

#### Workflow Staging
1. Push vers `develop`
2. Tests automatiques (client + serveur)
3. Build de l'image Docker
4. Déploiement automatique
5. Tests de fumée

### 3. Production

Le déploiement en production se déclenche sur les pushs vers `main` ou les tags `v*`.

**URL**: https://votre-app.com
**Base de données**: MongoDB production

#### Workflow Production
1. Push vers `main` ou tag release
2. Tests complets
3. Build et scan de sécurité
4. Déploiement automatique
5. Notifications

## Pipelines CI/CD

### 1. CI Pipeline (`ci.yml`)
- **Déclencheur**: Push/PR sur `main` et `develop`
- **Actions**:
  - Tests unitaires client (Vue.js)
  - Tests API serveur (Express.js)
  - Linting et vérification de code
  - Build de production

### 2. Docker Build (`docker-build.yml`)
- **Déclencheur**: Push sur `main`/`develop`, PR vers `main`
- **Actions**:
  - Build multi-stage Docker
  - Tests dans conteneur
  - Scan de sécurité (Trivy)
  - Push vers GitHub Container Registry

### 3. Deploy Production (`deploy.yml`)
- **Déclencheur**: Push sur `main`, tags `v*`
- **Actions**:
  - Build et push image Docker
  - Déploiement automatique
  - Notifications de statut

### 4. Deploy Staging (`staging.yml`)
- **Déclencheur**: Push sur `develop`
- **Actions**:
  - Déploiement staging
  - Tests de fumée
  - Notifications

## Configuration des Secrets

Dans GitHub → Settings → Secrets and variables → Actions, configurez:

### Secrets Requis

```
MONGODB_URI_STAGING=mongodb://...
MONGODB_URI_PRODUCTION=mongodb://...
JWT_SECRET=your-secret-key
STAGING_URL=https://staging.votre-app.com
PRODUCTION_URL=https://votre-app.com
```

### Variables d'Environnement

```
NODE_ENV=production
PORT=3000
MONGODB_DB_NAME=restaurant_db
```

## Stratégie de Branches

```
main      ──────●─────●─────●    (Production)
             ╱       ╱       ╱
develop  ●─────●─────●─────●      (Staging)
          ╲     ╲     ╲
features   ●─────●     ●─────●    (Développement)
```

### Workflow Git
1. **Feature branches**: Nouvelles fonctionnalités
2. **Develop**: Intégration et tests
3. **Main**: Code stable pour production

## Déploiement Manuel

### Via Docker

```bash
# Build de l'image
docker build -t restaurant-app .

# Lancement
docker run -d \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e MONGODB_URI=your-mongo-uri \
  restaurant-app
```

### Via Docker Compose

```bash
# Production
docker-compose -f docker-compose.prod.yml up -d

# Staging
docker-compose -f docker-compose.staging.yml up -d
```

## Monitoring et Logs

### Logs d'Application
- **Local**: `logs/app.log`
- **Production**: Intégration avec votre solution de logging

### Monitoring
- Health checks: `/health`
- Métriques: `/metrics` (à implémenter)
- Status: `/status`

## Rollback

### Rollback Automatique
Les deployments incluent des health checks. En cas d'échec, le rollback est automatique.

### Rollback Manuel

```bash
# Via Docker
docker rollback restaurant-app

# Via Git
git revert <commit-hash>
git push origin main
```

## Sécurité

### Scans Automatiques
- **Trivy**: Scan des vulnérabilités Docker
- **Dependabot**: Mise à jour des dépendances
- **CodeQL**: Analyse statique du code

### Bonnes Pratiques
- Secrets jamais en dur dans le code
- Images Docker minimales
- Principe du moindre privilège
- HTTPS obligatoire en production

## Support et Maintenance

### Mise à Jour des Dépendances
Les PRs automatiques Dependabot sont créées hebdomadairement.

### Backup Base de Données
- **Staging**: Backup quotidien (7 jours de rétention)
- **Production**: Backup quotidien (30 jours de rétention)

### Contacts
- **DevOps**: [email]
- **Équipe Dev**: [email]
- **Support**: [email]