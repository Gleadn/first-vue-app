<template>
  <Transition name="menu-modal">
    <div v-if="isVisible" class="menu-modal-overlay" @click="closeModal">
      <div class="menu-modal" @click.stop>
        <!-- Header du modal -->
        <div class="menu-modal-header">
          <div class="restaurant-info">
            <h2 class="restaurant-name">{{ restaurant?.name || 'Restaurant' }}</h2>
          </div>
          <button class="close-btn" @click="closeModal">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <!-- Contenu du menu -->
        <div class="menu-content">
          <!-- État de chargement -->
          <div v-if="loading" class="menu-loading">
            <div class="loading-spinner"></div>
            <p>Chargement du menu...</p>
          </div>

          <!-- Erreur -->
          <div v-else-if="error" class="menu-error">
            <p>Erreur: {{ error }}</p>
          </div>

          <!-- Menu items -->
          <div v-else-if="menuItems.length > 0" class="menu-grid">
            <MenuItemCard
              v-for="menuItem in menuItems"
              :key="menuItem._id || menuItem.id"
              :menu-item="menuItem"
              @add-to-cart="handleAddToCart"
            />
          </div>

          <!-- Aucun item -->
          <div v-else class="menu-empty">
            <p>Aucun élément de menu disponible pour ce restaurant.</p>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import MenuItemCard from './MenuItemCard.vue'
import '@/styles/RestaurantMenuModal.css'

// Props
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  restaurant: {
    type: Object,
    default: null
  }
})

// Événements émis
const emit = defineEmits(['close', 'add-to-cart'])

// État du composant
const menuItems = ref([])
const loading = ref(false)
const error = ref(null)

// Charger les items du menu depuis l'API
const fetchMenuItems = async (restaurantId) => {
  try {
    console.log('🍽️ Début fetchMenuItems pour restaurant:', restaurantId)
    loading.value = true
    error.value = null
    
    const response = await fetch(`http://localhost:3000/api/menu-items`)
    if (!response.ok) {
      throw new Error('Erreur lors du chargement du menu')
    }
    
    const data = await response.json()
    console.log('📊 Data menu reçue:', data)
    
    // Vérifier la structure des données (comme pour les autres API)
    const allMenuItems = data.success ? data.data : data
    
    // S'assurer que allMenuItems est bien un tableau
    if (!Array.isArray(allMenuItems)) {
      console.error('❌ Les données du menu ne sont pas un tableau:', allMenuItems)
      throw new Error('Les données du menu ne sont pas au bon format')
    }
    
    console.log('📈 Nombre total d\'items de menu:', allMenuItems.length)
    
    // Filtrer les items par restaurant ou prendre tous les items si pas de restaurant spécifique
    if (restaurantId) {
      // Filtrer les items qui appartiennent à ce restaurant
      const filteredItems = allMenuItems.filter(item => 
        item.idRestaurant && 
        (item.idRestaurant._id === restaurantId || item.idRestaurant === restaurantId)
      )
      console.log('🔍 Items filtrés pour le restaurant:', filteredItems.length)
      
      // Mapper les données pour correspondre au format attendu par MenuItemCard
      menuItems.value = filteredItems.map(item => ({
        _id: item._id,
        name: item.nom,
        price: item.prix,
        description: item.description,
        image: item.image,
        category: item.categorie,
        ingredients: item.ingredientsList || []
      }))
    } else {
      // Si pas de restaurant spécifique, prendre des items aléatoires et les mapper
      const randomItems = allMenuItems.slice(0, 8)
      console.log('🎲 Items aléatoires sélectionnés:', randomItems.length)
      
      menuItems.value = randomItems.map(item => ({
        _id: item._id,
        name: item.nom,
        price: item.prix,
        description: item.description,
        image: item.image,
        category: item.categorie,
        ingredients: item.ingredientsList || []
      }))
    }
    
    console.log('🍽️ Menu items final mappé:', menuItems.value)
    
  } catch (err) {
    console.error('Erreur lors du chargement du menu:', err)
    error.value = err.message
    
    // Fallback avec données par défaut
    menuItems.value = [
      {
        _id: 'fallback-1',
        name: 'Menu non disponible',
        price: 0,
        description: 'Impossible de charger le menu pour le moment'
      }
    ]
  } finally {
    loading.value = false
  }
}

// Fonctions
const closeModal = () => {
  console.log('🚪 Fermeture du modal menu demandée')
  emit('close')
}

const handleAddToCart = (menuItem) => {
  console.log('Ajouter au panier:', menuItem)
  emit('add-to-cart', menuItem)
}

// Watcher pour charger le menu du restaurant sélectionné
watch(() => props.restaurant, async (newRestaurant) => {
  if (newRestaurant) {
    console.log('🏪 Chargement du menu pour restaurant:', newRestaurant)
    console.log('🔑 ID du restaurant:', newRestaurant.id)
    await fetchMenuItems(newRestaurant.id)
  }
}, { immediate: true })

// Charger un menu par défaut si pas de restaurant spécifique
watch(() => props.isVisible, async (isVisible) => {
  if (isVisible && !props.restaurant) {
    await fetchMenuItems(null)
  }
})
</script>
