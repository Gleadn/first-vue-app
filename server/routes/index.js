import express from 'express';
import typeRestaurantsRoutes from './typeRestaurants.js';
import restaurantsRoutes from './restaurants.js';
import menuItemsRoutes from './menuItems.js';

const router = express.Router();

// Routes API
router.use('/type-restaurants', typeRestaurantsRoutes);
router.use('/restaurants', restaurantsRoutes);
router.use('/menu-items', menuItemsRoutes);

// Route de test API
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API fonctionne correctement',
    timestamp: new Date().toISOString()
  });
});

export default router;