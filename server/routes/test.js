import express from 'express';
import Sentry from '../config/sentry.js';

const router = express.Router();

/**
 * GET /api/test/health
 * Route de vérification de santé du serveur
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date()
  });
});

/**
 * GET /api/test/error
 * Route pour tester la capture d'erreur par Sentry
 */
router.get('/error', (_req, _res) => {
  console.log('🧪 Test route: génération d\'une erreur intentionnelle pour Sentry...');
  // Générer intentionnellement une erreur pour que Sentry la capture
  throw new Error('Test error');
});

/**
 * GET /api/test/slow
 * Route pour tester les requêtes lentes (timeout de 3 secondes)
 */
router.get('/slow', (req, res) => {
  console.log('🧪 Test route: simulation d\'une requête lente...');
  
  // Attendre 3 secondes avant de répondre
  setTimeout(() => {
    res.json({
      status: 'slow response',
      duration: '3 seconds',
      timestamp: new Date()
    });
  }, 3000);
});

/**
 * POST /api/test/message
 * Route pour tester l'envoi de messages personnalisés à Sentry
 */
router.post('/message', (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({
      error: 'Message requis',
      example: { message: 'Votre message ici' }
    });
  }
  
  console.log('🧪 Test route: envoi d\'un message à Sentry:', message);
  
  try {
    // Envoyer le message à Sentry avec le niveau "info"
    Sentry.captureMessage(message, 'info');
    
    res.json({
      status: 'Message envoyé à Sentry',
      message: message,
      level: 'info',
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message à Sentry:', error);
    res.status(500).json({
      error: 'Erreur lors de l\'envoi du message à Sentry',
      details: error.message
    });
  }
});

export default router;