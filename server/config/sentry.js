import * as Sentry from '@sentry/node';

/**
 * Initialise Sentry. Exported as an explicit function so the caller
 * can ensure dotenv has been loaded before initialization.
 *
 * Configs:
 * - DSN from process.env.SENTRY_DSN
 * - environment from NODE_ENV (development/production)
 * - release set to 1.0.0
 * - tracesSampleRate: 1.0 for development, 0.1 for production
 * - profilerSampleRate: 1.0
 * - Http integration with tracing enabled
 */
export function initSentry() {
  const environment = process.env.NODE_ENV || 'development';
  const tracesSampleRate = environment === 'production' ? 0.1 : 1.0;

  Sentry.init({
    dsn: process.env.SENTRY_DSN || '',
    environment,
    release: '1.0.0',
    tracesSampleRate,
    profilerSampleRate: 1.0,
    integrations: [
      Sentry.httpIntegration({ tracing: true }),
      Sentry.expressIntegration()
    ]
  });
  
  console.log(`🔍 Sentry initialisé en mode ${environment}`);
}

// Export Sentry instance for handlers usage
export default Sentry;
