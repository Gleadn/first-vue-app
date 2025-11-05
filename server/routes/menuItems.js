import express from 'express';
import { MenuItem, Restaurant } from '../models/index.js';

const router = express.Router();

// GET /api/menu-items - Récupérer tous les items de menu
router.get('/', async (req, res) => {
  try {
    const { restaurant, categorie, limite = 50, page = 1 } = req.query;
    const skip = (page - 1) * parseInt(limite);
    
    // Construire le filtre
    const filter = {};
    if (restaurant) {
      filter.idRestaurant = restaurant;
    }
    if (categorie) {
      filter.categorie = categorie;
    }
    
    console.log('🔍 Filtre menu-items utilisé:', filter);
    
    const menuItems = await MenuItem.find(filter)
      .populate('idRestaurant', 'nom')
      .select('nom prix description image categorie ingredientsList isVegetarien isVegan allergenes')
      .sort({ categorie: 1, nom: 1 })
      .skip(skip)
      .limit(parseInt(limite));
      
    console.log('📊 Menu items trouvés:', menuItems.length);
    console.log('🍽️ Premier menu item:', menuItems[0]);
    
    const total = await MenuItem.countDocuments(filter);
    
    console.log('📈 Total menu items en base:', total);
    
    res.json({
      success: true,
      data: menuItems,
      pagination: {
        page: parseInt(page),
        limite: parseInt(limite),
        total,
        pages: Math.ceil(total / parseInt(limite))
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des items de menu:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
});

// GET /api/menu-items/restaurant/:restaurantId - Récupérer le menu d'un restaurant
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    
    // Vérifier que le restaurant existe
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant non trouvé'
      });
    }
    
    const menuItems = await MenuItem.find({ 
      idRestaurant: restaurantId,
      isDisponible: true 
    })
      .select('nom prix description image categorie ingredientsList isVegetarien isVegan allergenes')
      .sort({ categorie: 1, nom: 1 });
    
    // Grouper par catégorie
    const menuByCategory = menuItems.reduce((acc, item) => {
      const category = item.categorie;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});
    
    res.json({
      success: true,
      data: {
        restaurant: {
          id: restaurant._id,
          nom: restaurant.nom,
          image: restaurant.image
        },
        menu: menuByCategory,
        totalItems: menuItems.length
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du menu:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
});

// GET /api/menu-items/:id - Récupérer un item de menu par ID
router.get('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id)
      .populate('idRestaurant', 'nom image');
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        error: 'Item de menu non trouvé'
      });
    }
    
    res.json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'item de menu:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
});

export default router;