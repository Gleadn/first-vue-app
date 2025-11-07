# 🚨 Guide de Configuration des Alertes Sentry

## Configuration dans le Dashboard Sentry

### 1. Accès aux alertes
1. Connectez-vous à https://sentry.io
2. Sélectionnez votre projet backend
3. Allez dans **"Alerts"** dans le menu de gauche
4. Cliquez sur **"Create Alert Rule"**

### 2. Configuration des 4 alertes

#### 🔴 Alerte 1 - Nouvelles erreurs
```
Name: Nouvelles erreurs détectées
Condition: A new issue is created
Action: Send a notification via Email
Environment: All Environments
```

#### 📊 Alerte 2 - Taux d'erreur élevé
```
Name: Taux d'erreur élevé
Condition: The error rate is above 5%
Time Window: 5 minutes
Action: Send a notification via Email
Environment: All Environments
```

#### ⏱️ Alerte 3 - Requêtes lentes
```
Name: Requêtes lentes détectées
Condition: The average response time is above 2000ms
Time Window: 1 minute
Action: Send a notification via Email
Environment: All Environments
```

#### 📈 Alerte 4 - Pic de requêtes lentes
```
Name: Pic de requêtes lentes
Condition: 10% of transactions have a duration above 2000ms
Time Window: 5 minutes
Action: Send a notification via Email
Environment: All Environments
```

## Tests Automatisés

### 🧪 Test complet de toutes les alertes
```powershell
.\test-sentry-alerts.ps1
```

### 🎯 Test d'une alerte spécifique
```powershell
# Test alerte 1 (nouvelle erreur)
.\test-single-alert.ps1 -AlertNumber 1

# Test alerte 2 (taux d'erreur élevé)
.\test-single-alert.ps1 -AlertNumber 2

# Test alerte 3 (requête lente)
.\test-single-alert.ps1 -AlertNumber 3

# Test alerte 4 (pic de requêtes lentes)
.\test-single-alert.ps1 -AlertNumber 4

# Test de toutes les alertes
.\test-single-alert.ps1 -AlertNumber all
```

### 📋 Tests manuels avec curl/browser
```bash
# Alerte 1: Nouvelle erreur
curl http://localhost:3001/api/test/error

# Alerte 2: Répéter 10 fois rapidement
for i in {1..10}; do curl http://localhost:3001/api/test/error; done

# Alerte 3 & 4: Requêtes lentes
curl http://localhost:3001/api/test/slow
```

## Routes de test disponibles

- `GET /api/test/health` - Vérification de santé
- `GET /api/test/error` - Génère une erreur
- `GET /api/test/slow` - Requête lente (3s)
- `POST /api/test/message` - Envoie un message à Sentry

## 📧 Vérification des alertes

1. **Délai d'arrivée**: Les emails peuvent prendre 1-5 minutes
2. **Vérifiez votre boîte email** (et le dossier spam)
3. **Dashboard Sentry**: Vérifiez les alertes dans l'interface
4. **Logs du serveur**: Observez les erreurs en temps réel

## 🔧 Dépannage

### Serveur non accessible
```powershell
cd C:\Users\TheQu\source\repos\VueApp\first-vue-app\server
node app.js
```

### Pas d'emails reçus
- Vérifiez la configuration email dans Sentry
- Contrôlez les paramètres de notification
- Regardez l'historique des alertes dans le dashboard

### Erreurs dans les scripts
- Assurez-vous que PowerShell est en mode d'exécution autorisé
- Vérifiez que le serveur backend est démarré
- Testez d'abord avec une alerte individuelle

## 📊 Métriques à surveiller

Après les tests, vérifiez dans Sentry :
- **Issues**: Nouvelles erreurs créées
- **Performance**: Temps de réponse des transactions
- **Alerts**: Historique des déclenchements
- **Email**: Réception des notifications