import * as Sentry from '@sentry/vue';

/**
 * Plugin Sentry pour Vue.js
 * 
 * Configuration:
 * - DSN depuis import.meta.env.VITE_SENTRY_DSN_FRONTEND
 * - Environment automatique (development/production)
 * - Release: "1.0.0"
 * - tracesSampleRate: 1.0
 * - Intégration simplifiée pour compatibilité
 */

export default function configureSentry(app) {
  const environment = import.meta.env.MODE || 'development';
  
  try {
    Sentry.init({
      app,
      dsn: import.meta.env.VITE_SENTRY_DSN_FRONTEND || '',
      environment,
      release: '1.0.0',
      tracesSampleRate: 1.0,
      // Configuration simplifiée sans BrowserTracing pour éviter les conflits de version
    });

    console.log(`🔍 Sentry Vue initialisé en mode ${environment}`);
  } catch (error) {
    console.warn('⚠️ Erreur lors de l\'initialisation de Sentry:', error);
  }
}

// Export Sentry instance pour utilisation dans les composants
export { Sentry };