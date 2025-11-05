import express from 'express';
import { Restaurant, TypeRestaurant } from '../models/index.js';

const router = express.Router();

// GET /api/restaurants - Récupérer tous les restaurants
router.get('/', async (req, res) => {
  try {
    const { typeRestaurant, limite = 20, page = 1 } = req.query;
    const skip = (page - 1) * parseInt(limite);
    
    // Construire le filtre
    const filter = {};
    if (typeRestaurant) {
      filter.idTypeRestaurant = typeRestaurant;
    }
    
    console.log('🔍 Filtre utilisé:', filter);
    
    const restaurants = await Restaurant.find(filter)
      .populate('idTypeRestaurant', 'nom icone')
      .select('nom image note votes description adresse fraisLivraison commandeMinimale')
      .sort({ note: -1 })
      .skip(skip)
      .limit(parseInt(limite));
      
    console.log('📊 Restaurants trouvés:', restaurants.length);
    console.log('🏪 Premier restaurant:', restaurants[0]);
    
    const total = await Restaurant.countDocuments(filter);
    
    console.log('📈 Total restaurants en base:', total);
    
    res.json({
      success: true,
      data: restaurants,
      pagination: {
        page: parseInt(page),
        limite: parseInt(limite),
        total,
        pages: Math.ceil(total / parseInt(limite))
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des restaurants:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
});

// GET /api/restaurants/:id - Récupérer un restaurant par ID
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate('idTypeRestaurant', 'nom icone');
    
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant non trouvé'
      });
    }
    
    res.json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du restaurant:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
});

export default router;