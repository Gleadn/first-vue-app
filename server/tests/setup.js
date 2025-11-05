// Configuration globale pour Jest
beforeAll(async () => {
  // Configuration de base de données de test
  process.env.NODE_ENV = 'test'
})

afterAll(async () => {
  // Nettoyage après les tests
})