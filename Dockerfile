# Dockerfile multi-stage pour Vue.js + Express + MongoDB

# Stage 1: Build Vue.js frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

COPY package*.json ./
COPY vite.config.mjs ./
COPY jsconfig.json ./

RUN npm ci

COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./

RUN npm run build

# Stage 2: Setup Express server
FROM node:20-alpine AS production

RUN apk add --no-cache dumb-init

RUN addgroup -g 1001 -S nodejs
RUN adduser -S express -u 1001

WORKDIR /app

RUN chown -R express:nodejs /app
USER express

COPY --chown=express:nodejs package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY --chown=express:nodejs server/ ./server/

COPY --from=frontend-builder --chown=express:nodejs /app/dist ./dist

RUN mkdir -p logs

EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node server/healthcheck.js || exit 1

ENTRYPOINT ["dumb-init", "--"]

CMD ["npm", "start"]