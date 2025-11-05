import express from 'express';
import { TypeRestaurant } from '../models/index.js';

const router = express.Router();

// GET /api/type-restaurants - Récupérer tous les types de restaurants
router.get('/', async (req, res) => {
  try {
    const typeRestaurants = await TypeRestaurant.find()
      .sort({ nom: 1 })
      .select('nom icone');
    
    res.json({
      success: true,
      data: typeRestaurants,
      count: typeRestaurants.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des types de restaurants:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
});

// GET /api/type-restaurants/:id - Récupérer un type de restaurant par ID
router.get('/:id', async (req, res) => {
  try {
    const typeRestaurant = await TypeRestaurant.findById(req.params.id);
    
    if (!typeRestaurant) {
      return res.status(404).json({
        success: false,
        error: 'Type de restaurant non trouvé'
      });
    }
    
    res.json({
      success: true,
      data: typeRestaurant
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du type de restaurant:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
});

export default router;