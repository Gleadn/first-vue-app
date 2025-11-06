# 🚀 Guide de Déploiement - Restaurant App

## Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Processus de Déploiement Automatisé](#processus-de-déploiement-automatisé)
- [Secrets Requis](#secrets-requis)
- [Déploiement Manuel](#déploiement-manuel)
- [Rollback](#rollback)
- [Environnements](#environnements)
- [Monitoring et Logs](#monitoring-et-logs)
- [Troubleshooting](#troubleshooting)

## Vue d'ensemble

Cette application utilise un pipeline CI/CD automatisé avec GitHub Actions pour déployer :
- **Frontend** : Application Vue.js 
- **Backend** : API Express.js
- **Base de données** : MongoDB
- **Infrastructure** : Docker + Railway/Vercel

### Architecture de Déploiement

```mermaid
graph TB
    A[👨‍💻 Développeur] --> B[📤 Push vers GitHub]
    B --> C[🔄 GitHub Actions CI]
    C --> D[🧪 Tests & Lint]
    D --> E[🏗️ Build]
    E --> F[🐳 Docker Build]
    F --> G[🚀 Deploy to Railway]
    G --> H[🌐 Production Live]
    
    subgraph "Environnements"
    I[🧪 Staging] --> J[📋 Tests manuels]
    J --> K[✅ Approval]
    K --> H
    end
```

## Processus de Déploiement Automatisé

### 🔄 Déclencheurs Automatiques

Le déploiement se déclenche automatiquement sur :

1. **Push vers `main`** : Déploiement en production
2. **Push vers `develop`** : Déploiement en staging
3. **Pull Request** : Déploiement de preview

### 📋 Pipeline de Déploiement

#### 1. **Pré-validation** (`pre-deployment-validation`)
```yaml
Étapes :
✅ Vérification du statut CI
✅ Validation des conditions de déploiement
✅ Contrôle des permissions (environment: production)
```

#### 2. **Build et Préparation** (`build-and-prepare`)
```yaml
Étapes :
🏗️ Build du frontend (Vue.js)
📦 Préparation des artefacts
🏷️ Génération de la version
🐳 Construction des images Docker
```

#### 3. **Déploiement Backend** (`deploy-backend`)
```yaml
Étapes :
🚀 Déploiement sur Railway
🔧 Configuration des variables d'environnement
🔍 Tests de santé (healthcheck)
📊 Vérification des métriques
```

#### 4. **Déploiement Frontend** (`deploy-frontend`)
```yaml
Étapes :
🌐 Déploiement sur Vercel/Netlify
🔗 Mise à jour des liens API
🧪 Tests end-to-end
```

#### 5. **Post-déploiement** (`post-deployment`)
```yaml
Étapes :
📈 Vérification des services
🔔 Notifications d'équipe
📝 Mise à jour de la documentation
```

## Secrets Requis

### 🔐 Configuration dans GitHub Secrets

Naviguez vers `Settings > Secrets and variables > Actions` dans votre repository GitHub.

#### **Secrets Production** (Environment: `production`)

| Secret | Description | Exemple |
|--------|-------------|---------|
| `MONGODB_URI` | URI de connexion MongoDB Atlas | `mongodb+srv://user:pass@cluster.mongodb.net/restaurant_db` |
| `JWT_SECRET` | Clé secrète JWT (32+ caractères) | `your-super-secure-jwt-secret-key-2024` |
| `JWT_REFRESH_SECRET` | Clé secrète pour refresh tokens | `your-refresh-token-secret-key-2024` |
| `RAILWAY_TOKEN` | Token d'API Railway | `railway_live_xxxxxxxx` |
| `PROD_API_URL` | URL de l'API en production | `https://api.restaurant-app.railway.app` |
| `VERCEL_TOKEN` | Token d'API Vercel | `vercel_xxxxxxxx` |
| `DISCORD_WEBHOOK_URL` | Webhook pour notifications Discord | `https://discord.com/api/webhooks/...` |

#### **Secrets Staging** (Environment: `staging`)

| Secret | Description |
|--------|-------------|
| `STAGING_MONGODB_URI` | URI MongoDB pour staging |
| `STAGING_JWT_SECRET` | JWT secret pour staging |
| `STAGING_API_URL` | URL API staging |

### 🛠️ Comment Configurer les Secrets

#### 1. **MongoDB Atlas**
```bash
# 1. Créer un cluster MongoDB Atlas
# 2. Créer un utilisateur database
# 3. Récupérer l'URI de connexion
# Format: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
```

#### 2. **JWT Secrets**
```bash
# Générer des secrets sécurisés
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 3. **Railway Configuration**
```bash
# 1. Installer Railway CLI
npm install -g @railway/cli

# 2. Login et récupérer le token
railway login
railway whoami
```

#### 4. **Vercel Configuration**
```bash
# 1. Installer Vercel CLI
npm install -g vercel

# 2. Login et récupérer le token
vercel login
vercel whoami
```

## Déploiement Manuel

### 🎯 Déclenchement Manuel via GitHub Actions

#### 1. **Via Interface GitHub**
1. Aller dans `Actions > Production Deployment`
2. Cliquer sur `Run workflow`
3. Choisir les options :
   - **Version** : SHA commit ou tag (défaut: `main`)
   - **Skip tests** : Ignorer les vérifications (défaut: `false`)

#### 2. **Via GitHub CLI**
```bash
# Déploiement standard
gh workflow run deploy.yml

# Déploiement d'une version spécifique
gh workflow run deploy.yml -f version=v1.2.3

# Déploiement d'urgence (skip tests)
gh workflow run deploy.yml -f skip_tests=true
```

### 🖥️ Déploiement Local d'Urgence

#### **Prérequis**
```bash
# Variables d'environnement requises
export RAILWAY_TOKEN="your_railway_token"
export VERCEL_TOKEN="your_vercel_token"
```

#### **Script de Déploiement**
```bash
# 1. Build de l'application
npm run build

# 2. Déploiement backend sur Railway
railway login
railway link your-project-id
railway up

# 3. Déploiement frontend sur Vercel
vercel login
vercel --prod

# 4. Vérification
curl -f https://api.restaurant-app.railway.app/health
```

### 📱 Déploiement Staging

```bash
# Push vers develop pour déployer en staging
git checkout develop
git merge main
git push origin develop

# Ou directement
gh workflow run staging.yml
```

## Rollback

### 🔄 Processus de Rollback

#### **1. Rollback Automatique**
Le système détecte automatiquement les échecs et effectue un rollback si :
- ❌ Les tests de santé échouent après 5 minutes
- ❌ Le taux d'erreur dépasse 5%
- ❌ Le temps de réponse dépasse 10 secondes

#### **2. Rollback Manuel Rapide**

##### **Via GitHub Actions**
```bash
# Déployer la version précédente
gh workflow run deploy.yml -f version=<previous-commit-sha>
```

##### **Via Railway CLI**
```bash
# Lister les déploiements
railway status

# Rollback vers un déploiement précédent
railway rollback <deployment-id>
```

##### **Via Interface Web**
1. **Railway Dashboard** : `Deployments > Select Previous > Redeploy`
2. **Vercel Dashboard** : `Deployments > Previous Deployment > Promote to Production`

#### **3. Rollback Complet de Base de Données**

⚠️ **ATTENTION** : Seulement en cas d'urgence critique

```bash
# 1. Connexion à MongoDB Atlas
mongosh "mongodb+srv://cluster.mongodb.net/restaurant_db"

# 2. Restaurer depuis backup
mongorestore --uri="mongodb+srv://..." --archive=backup_YYYY-MM-DD.gz

# 3. Redémarrer les services
railway restart
```

### 📋 Checklist Post-Rollback

- [ ] ✅ Vérifier la santé des services
- [ ] 📊 Contrôler les métriques de performance
- [ ] 🔍 Analyser les logs d'erreur
- [ ] 📝 Documenter la cause du rollback
- [ ] 🔔 Notifier l'équipe
- [ ] 🛠️ Planifier le correctif

## Environnements

### 🏗️ Infrastructure

| Environnement | Frontend | Backend | Database | URL |
|---------------|----------|---------|----------|-----|
| **Production** | Vercel | Railway | MongoDB Atlas | https://restaurant-app.vercel.app |
| **Staging** | Vercel Preview | Railway Staging | MongoDB Atlas (staging) | https://staging.restaurant-app.vercel.app |
| **Development** | Local (Vite) | Local (Express) | Local (Docker) | http://localhost:5173 |

### 🔧 Variables d'Environnement par Environnement

#### **Production**
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://prod-cluster.mongodb.net/restaurant_db
JWT_SECRET=super-secure-production-secret
CORS_ORIGIN=https://restaurant-app.vercel.app
RATE_LIMIT_MAX=100
```

#### **Staging**
```env
NODE_ENV=staging
PORT=3000
MONGODB_URI=mongodb+srv://staging-cluster.mongodb.net/restaurant_db_staging
JWT_SECRET=staging-secret
CORS_ORIGIN=https://staging.restaurant-app.vercel.app
RATE_LIMIT_MAX=1000
```

#### **Development**
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/restaurant_db
JWT_SECRET=dev-secret
CORS_ORIGIN=http://localhost:5173
```

## Monitoring et Logs

### 📊 Surveillance

#### **Métriques Surveillées**
- 🟢 **Santé des services** : Healthchecks toutes les 30s
- ⚡ **Performance** : Temps de réponse < 2s
- 🛡️ **Erreurs** : Taux d'erreur < 1%
- 💾 **Ressources** : CPU < 80%, RAM < 90%

#### **Alertes Configurées**
```yaml
Alertes critiques :
- 🚨 Service down > 2 minutes
- 🚨 Erreur rate > 5% sur 5 minutes
- 🚨 Response time > 10s sur 3 minutes

Alertes importantes :
- ⚠️ CPU > 80% sur 10 minutes
- ⚠️ Erreur rate > 2% sur 10 minutes
- ⚠️ Disk usage > 90%
```

### 📝 Accès aux Logs

#### **Logs de Production**
```bash
# Railway CLI
railway logs --tail

# Logs spécifiques par service
railway logs --service backend --tail
railway logs --service frontend --tail

# Filtrage par niveau
railway logs --level error --tail
```

#### **Logs Locaux**
```bash
# Logs serveur Express
tail -f server/logs/app.log
tail -f server/logs/error.log

# Logs de développement
npm run dev:server  # Logs en temps réel
```

### 🔍 Debugging en Production

```bash
# 1. Vérifier le statut des services
curl -f https://api.restaurant-app.railway.app/health

# 2. Vérifier les métriques MongoDB
mongosh "mongodb+srv://..." --eval "db.stats()"

# 3. Analyser les logs d'erreur
railway logs --service backend --level error | head -50

# 4. Vérifier les variables d'environnement
railway variables
```

## Troubleshooting

### 🔧 Problèmes Courants

#### **1. Échec de Déploiement**

**Symptôme** : Pipeline CI/CD échoue
```bash
# Diagnostic
gh run list --limit 5
gh run view <run-id>

# Solutions
✅ Vérifier les secrets GitHub
✅ Contrôler les logs de build
✅ Valider les variables d'environnement
```

#### **2. Problème de Connexion Base de Données**

**Symptôme** : `MongoServerError: Authentication failed`
```bash
# Diagnostic
mongosh "mongodb+srv://..." --eval "db.adminCommand('ping')"

# Solutions
✅ Vérifier MONGODB_URI
✅ Contrôler les IP whitelisted
✅ Valider les credentials MongoDB
```

#### **3. Erreurs CORS**

**Symptôme** : `Access to XMLHttpRequest has been blocked by CORS policy`
```bash
# Diagnostic
curl -H "Origin: https://restaurant-app.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS https://api.restaurant-app.railway.app/api/

# Solutions
✅ Vérifier CORS_ORIGIN dans Railway
✅ Contrôler la configuration Express CORS
✅ Valider les domaines autorisés
```

#### **4. Build Frontend qui Échoue**

**Symptôme** : `Error: Rollup failed to resolve import`
```bash
# Diagnostic
cd client && npm run build

# Solutions
✅ Nettoyer node_modules et package-lock.json
✅ Vérifier les dépendances dans package.json
✅ Contrôler la configuration Vite
```

### 🆘 Contacts d'Urgence

#### **Support Escalation**
1. **🔴 Niveau 1** : Développeur Principal
2. **🟠 Niveau 2** : Chef de Projet
3. **🔴 Niveau 3** : Administrateur Infrastructure

#### **Resources Utiles**
- 📚 [Documentation Railway](https://docs.railway.app/)
- 📚 [Documentation Vercel](https://vercel.com/docs)
- 🐛 [Issues GitHub](https://github.com/your-org/restaurant-app/issues)
- 💬 [Channel Discord #deployments](https://discord.gg/your-server)

---

## 📋 Checklist de Déploiement

### Avant Déploiement
- [ ] ✅ Tests CI passent à 100%
- [ ] 📝 Documentation mise à jour
- [ ] 🔍 Code review approuvé
- [ ] 🧪 Tests manuels en staging
- [ ] 💾 Backup de la base de données
- [ ] 🔔 Équipe notifiée

### Pendant le Déploiement
- [ ] 📊 Surveillance des métriques
- [ ] 🔍 Monitoring des logs
- [ ] ⏱️ Respect du timing prévu
- [ ] 🔄 Validation des étapes

### Après Déploiement
- [ ] ✅ Tests de santé OK
- [ ] 🧪 Tests de smoke complets
- [ ] 📈 Métriques dans les normes
- [ ] 🔔 Confirmation déploiement réussi
- [ ] 📝 Documentation mise à jour

---

*Dernière mise à jour : Novembre 2024*
*Version : 1.0.0*
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