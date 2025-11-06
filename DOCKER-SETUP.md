# 🐳 Configuration Docker Hub pour CI/CD

## Secrets GitHub Requis

Pour utiliser le workflow Docker complet avec push vers Docker Hub, configurez les secrets suivants dans votre repository GitHub :

### Settings → Secrets and variables → Actions → Repository secrets

1. **DOCKERHUB_USERNAME**
   - Votre nom d'utilisateur Docker Hub
   - Exemple : `monusername`

2. **DOCKERHUB_TOKEN**
   - Token d'accès Docker Hub (pas votre mot de passe)
   - Création : Docker Hub → Account Settings → Security → Access Tokens
   - Permissions : Read, Write, Delete

## 🚀 Déclenchement des Builds

### Build Automatique (GitHub Container Registry)
- Push sur `main` ou `develop` : build automatique vers `ghcr.io`
- Pull Request vers `main` : build de test seulement

### Build avec Tags (Docker Hub + GitHub Container Registry)
```bash
# Créer et pousser un tag
git tag v1.0.0
git push origin v1.0.0
```

### Images Générées

#### GitHub Container Registry (toujours)
- `ghcr.io/gleadn/first-vue-app:main`
- `ghcr.io/gleadn/first-vue-app:develop`
- `ghcr.io/gleadn/first-vue-app:pr-123`

#### Docker Hub (sur tags seulement)
- `docker.io/gleadn/first-vue-app:v1.0.0`
- `docker.io/gleadn/first-vue-app:1.0`
- `docker.io/gleadn/first-vue-app:1`

## 🏗️ Architecture Multi-Stage

### Stage 1: Frontend Builder
```dockerfile
FROM node:20-alpine AS frontend-builder
# Build Vue.js avec Vite
```

### Stage 2: Test
```dockerfile
FROM node:20-alpine AS test
# Tests avec Jest et devDependencies
```

### Stage 3: Production (Final)
```dockerfile
FROM node:20-alpine AS production
# Image légère avec utilisateur non-root
# Seulement les dépendances runtime
```

## 🛡️ Sécurité

- ✅ **Utilisateur non-root** : `express` (UID 1001)
- ✅ **Image Alpine** : Base légère et sécurisée
- ✅ **Scan Trivy** : Analyse de vulnérabilités automatique
- ✅ **Cache optimisé** : GitHub Actions cache
- ✅ **Dépendances minimales** : `--only=production` dans l'image finale

## 📦 Utilisation des Images

### Développement Local
```bash
docker run -p 3000:3000 ghcr.io/gleadn/first-vue-app:main
```

### Production
```bash
docker run -d \
  -p 3000:3000 \
  -e MONGODB_URI="mongodb://..." \
  -e JWT_SECRET="your-secret" \
  gleadn/first-vue-app:v1.0.0
```

## 🔧 Cache Multi-Stage

Le workflow utilise GitHub Actions cache pour optimiser :
- Build times réduits
- Réutilisation des layers Docker
- Cache partagé entre builds

## 📋 Conformité Exigences

✅ **Se déclencher sur un push de tag** : `on.push.tags: ['v*']`  
✅ **Construire une image Docker** : Multi-stage build  
✅ **Pousser vers Docker Hub** : Sur tags uniquement  
✅ **Cache multi-stage** : GitHub Actions cache  
✅ **Sécurité non-root** : Utilisateur `express`  
✅ **Image légère** : `node:20-alpine` + production deps seulement