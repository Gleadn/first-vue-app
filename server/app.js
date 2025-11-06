import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';
import apiRoutes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les variables d'environnement depuis la racine du projet
dotenv.config({ path: path.join(__dirname, '../.env') });

// Initialiser Sentry (importer le module de configuration puis appeler init)
// Note: initSentry est explicitement appelé après dotenv.config() pour
// s'assurer que les variables d'environnement sont disponibles.
const sentryModule = await import('./config/sentry.js');
const Sentry = sentryModule.default;
sentryModule.initSentry();

// Créer l'app Express après l'initialisation de Sentry
const app = express();
const PORT = process.env.PORT || 3001;

// Connexion à la base de données avec gestion d'erreur
connectDB().catch(error => {
  console.error('Impossible de se connecter à la base de données:', error);
  process.exit(1);
});

// Middleware Sentry pour capturer les requêtes (doit être ajouté avant les routes)
// Note: avec Sentry v10+, l'intégration Express se fait dans la config, pas ici

// Middleware de sécurité
app.use(helmet());

// Configuration CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX || 100,
  message: {
    error: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
  }
});
app.use(limiter);

// Middleware pour parser JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware de logging basique
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Route de health check pour Docker
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: 'connected' // Vous pouvez ajouter une vérification MongoDB ici
  });
});

// Routes de base
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API de l\'application de restauration',
    version: '1.0.0',
    status: 'active',
    endpoints: {
      typeRestaurants: '/api/type-restaurants',
      restaurants: '/api/restaurants',
      menuItems: '/api/menu-items',
      health: '/api/health'
    }
  });
});

// Routes API
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: 'connected'
  });
});

// Servir les fichiers statiques du client (frontend)
app.use(express.static(path.join(__dirname, "../client/dist")));

// Toutes les autres routes non-API renvoient vers l'application Vue (SPA routing)
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

// Gestion des erreurs 404 pour les routes API
app.use((req, res) => {
  res.status(404).json({
    error: 'Route non trouvée',
    path: req.originalUrl
  });
});

// Middleware Sentry pour capturer les erreurs — doit être ajouté
// après les routes et avant votre handler d'erreur personnalisé
app.use(Sentry.expressErrorHandler());

// Middleware de gestion d'erreurs global (votre handler personnalisé)
app.use((err, req, res, _next) => {
  console.error('Erreur:', err.stack);
  res.status(500).json({
    error: 'Erreur interne du serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
  });
});

// Démarrage du serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 API disponible sur: http://localhost:${PORT}`);
  console.log(`📋 Documentation API: http://localhost:${PORT}/api/health`);
});

export default app;