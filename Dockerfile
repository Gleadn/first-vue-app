# Dockerfile multi-stage pour Vue.js + Express + MongoDB

# Stage 1: Build Vue.js frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/client

# Copier les fichiers de configuration client
COPY client/package*.json ./
COPY client/vite.config.mjs ./
COPY client/jsconfig.json ./

# Installer les dépendances client
RUN npm ci --only=production

# Copier le code source client
COPY client/src/ ./src/
COPY client/public/ ./public/
COPY client/index.html ./

# Builder le frontend
RUN npm run build

# Stage 2: Test stage (optionnel pour CI)
FROM node:20-alpine AS test

WORKDIR /app

# Installer les dépendances server pour les tests
COPY server/package*.json ./server/
RUN cd server && npm ci

# Installer les dépendances client pour les tests
COPY client/package*.json ./client/
RUN cd client && npm ci

# Copier le code source
COPY server/ ./server/
COPY client/ ./client/

# Copier le build frontend
COPY --from=frontend-builder /app/client/dist ./client/dist

# Commande par défaut pour les tests
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

# Copier et installer les dépendances serveur
COPY --chown=express:nodejs server/package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copier le code serveur
COPY --chown=express:nodejs server/ ./

# Copier le frontend buildé
COPY --from=frontend-builder --chown=express:nodejs /app/client/dist ./public

# Créer le dossier logs
RUN mkdir -p logs

# Exposer le port
EXPOSE 3000

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js || exit 1

# Utiliser dumb-init pour gérer les signaux et démarrer l'application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "app.js"]