# Dockerfile multi-stage pour Vue.js + Express + MongoDB

# Stage 1: Build Vue.js frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copier les fichiers du workspace racine
COPY package*.json ./
COPY client/package.json ./client/

# Installer toutes les dépendances du workspace
RUN npm ci --only=production

# Forcer l'installation des binaires Rollup pour le build frontend
RUN npm rebuild && npm install @rollup/rollup-linux-x64-gnu --optional --no-save

# Copier les fichiers de configuration client
COPY client/vite.config.mjs ./client/
COPY client/jsconfig.json ./client/

# Copier le code source client
COPY client/src/ ./client/src/
COPY client/public/ ./client/public/
COPY client/index.html ./client/

# Builder le frontend
WORKDIR /app/client
RUN npm run build

# Stage 2: Test stage (optionnel pour CI)
FROM node:20-alpine AS test

WORKDIR /app

# Copier les fichiers package du workspace racine
COPY package*.json ./
COPY client/package.json ./client/
COPY server/package.json ./server/

# Installer toutes les dépendances du workspace (y compris devDependencies pour les tests)
RUN npm ci --include=dev

# Copier le code source après installation
COPY client/ ./client/
COPY server/ ./server/

# Commande par défaut pour les tests (tests backend)
WORKDIR /app/server
CMD ["npm", "test"]

# Stage 3: Production
FROM node:20-alpine AS production

# Installer dumb-init pour la gestion des signaux
RUN apk add --no-cache dumb-init

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S express -u 1001 -G nodejs

WORKDIR /app

# Changer la propriété du répertoire
RUN chown -R express:nodejs /app
USER express

# Copier les fichiers du workspace et installer toutes les dépendances
COPY --chown=express:nodejs package*.json ./
COPY --chown=express:nodejs server/package.json ./server/
RUN npm ci --only=production && npm cache clean --force

# Copier le code serveur
COPY --chown=express:nodejs server/ ./server/

# Copier le frontend buildé
COPY --from=frontend-builder --chown=express:nodejs /app/client/dist ./public

# Créer le dossier logs
RUN mkdir -p logs

# Changer vers le répertoire server pour l'exécution
WORKDIR /app/server

# Exposer le port
EXPOSE 3000

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node server/healthcheck.js || exit 1

# Utiliser dumb-init pour gérer les signaux et démarrer l'application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server/app.js"]