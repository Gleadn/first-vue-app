# Workflow CI/CD - Documentation

## 🚀 Pipeline d'Intégration Continue

Notre pipeline CI/CD est composée de **6 jobs** qui s'exécutent automatiquement sur chaque push/PR vers `main` ou `develop`.

### 📊 Architecture du Workflow

```mermaid
graph TB
    A[🔍 Lint] --> B[🧪 Tests Backend]
    A --> C[🧪 Tests Frontend] 
    A --> D[🏗️ Build]
    E[🔒 Security Audit] --> F[📢 Notification]
    B --> F
    C --> F
    D --> F
```

### 📝 Description des Jobs

#### 🔍 **Job 1 : Lint**
- **Objectif** : Vérification de la qualité du code
- **Actions** :
  - Lint du code backend (ESLint)
  - Lint du code frontend (ESLint + Vue.js rules)
- **Dépendances** : Aucune
- **Échec bloquant** : ❌ Oui

#### 🧪 **Job 2 : Tests Backend**
- **Objectif** : Exécution des tests serveur Node.js
- **Actions** :
  - Configuration MongoDB 6.0 comme service
  - Installation des dépendances
  - Exécution des tests avec couverture
  - Upload du rapport de couverture (30 jours)
- **Dépendances** : ✅ Lint doit réussir
- **Échec bloquant** : ❌ Oui

#### 🧪 **Job 3 : Tests Frontend**
- **Objectif** : Exécution des tests Vue.js
- **Actions** :
  - Installation des dépendances
  - Exécution des tests avec couverture
  - Upload du rapport de couverture (30 jours)
- **Dépendances** : ✅ Lint doit réussir
- **Échec bloquant** : ❌ Oui

#### 🏗️ **Job 4 : Build**
- **Objectif** : Construction de l'application frontend
- **Actions** :
  - Build de production avec Vite
  - Upload des artefacts de build (30 jours)
- **Dépendances** : ✅ Lint doit réussir
- **Échec bloquant** : ❌ Oui

#### 🔒 **Job 5 : Security Audit**
- **Objectif** : Audit de sécurité des dépendances
- **Actions** :
  - `npm audit` sur backend et frontend
  - Détection des vulnérabilités niveau modéré+
- **Dépendances** : Aucune (parallèle)
- **Échec bloquant** : ✅ Non (`continue-on-error: true`)

#### 📢 **Job 6 : Notification**
- **Objectif** : Notification du statut final
- **Actions** :
  - Message de succès si tous les jobs réussissent
  - Message d'échec avec détails des jobs en erreur
- **Dépendances** : Tous les jobs principaux
- **Échec bloquant** : ✅ Oui si échec

### ⚡ Optimisations Implémentées

#### **Tests Parallélisés**
- ✅ Tests Backend et Frontend s'exécutent en **parallèle**
- ✅ Build s'exécute en **parallèle** des tests
- ✅ Security Audit en **parallèle** complet

#### **Cache NPM**
- ✅ Cache activé sur Node.js setup
- ✅ Réduction du temps d'installation des dépendances

#### **Artefacts et Rapports**
- ✅ Rapports de couverture (backend + frontend)
- ✅ Build artifacts de production
- ✅ Rétention de 30 jours

### 🌟 Badge de Statut

[![CI Status](https://github.com/Gleadn/first-vue-app/workflows/CI%20-%20Lint,%20Tests%20et%20Build/badge.svg)](https://github.com/Gleadn/first-vue-app/actions)

### 🔧 Configuration Technique

| Composant | Version |
|-----------|---------|
| Node.js   | 18      |
| MongoDB   | 6.0     |
| Ubuntu    | latest  |

### 📈 Variables d'Environnement

#### Tests Backend
```env
NODE_ENV=test
MONGODB_URI=mongodb://admin:password@localhost:27017/restaurant_db_test?authSource=admin
JWT_SECRET=test-jwt-secret-key-for-ci
```

#### Tests Frontend
```env
NODE_ENV=test
```

### 🎯 Déclencheurs

- ✅ Push vers `main`
- ✅ Push vers `develop`
- ✅ Pull Request vers `main`
- ✅ Pull Request vers `develop`

### 📊 Métriques de Performance

**Temps d'exécution estimé** : ~3-5 minutes

| Job | Temps estimé |
|-----|--------------|
| Lint | ~30s |
| Tests Backend | ~1-2min |
| Tests Frontend | ~1min |
| Build | ~1min |
| Security Audit | ~30s |
| Notification | ~5s |

### 🔗 Liens Utiles

- [Actions GitHub](https://github.com/Gleadn/first-vue-app/actions)
- [Artefacts de build](https://github.com/Gleadn/first-vue-app/actions/workflows/ci.yml)
- [Rapports de couverture](https://github.com/Gleadn/first-vue-app/actions/workflows/ci.yml)