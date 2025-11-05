<template>
  <div class="restaurant-grid-container">
    <!-- Indicateur de chargement -->
    <div v-if="loading" class="loading-indicator">
      <p>Chargement des restaurants...</p>
    </div>
    
    <!-- Message d'erreur -->
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>
    
    <!-- Grille des restaurants -->
    <div v-else class="restaurant-grid">
      <RestaurantCard
        v-for="restaurant in restaurants"
        :key="restaurant.id"
        :restaurant="restaurant"
        @click="handleRestaurantClick"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import RestaurantCard from './RestaurantCard.vue'
import '@/styles/RestaurantGrid.css'

// État des données
const restaurants = ref([])
const loading = ref(true)
const error = ref(null)

// Fonction pour récupérer les restaurants depuis l'API
const fetchRestaurants = async () => {
  try {
    console.log('🔄 Début fetchRestaurants')
    loading.value = true
    error.value = null
    
    const response = await fetch('http://localhost:3000/api/restaurants')
    console.log('📡 Response status:', response.status)
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('📊 Data reçue:', data)
    
    if (data.success) {
      console.log('✅ Data.data:', data.data)
      console.log('📈 Nombre de restaurants:', data.data?.length)
      
      // Adapter les données de l'API au format attendu par le composant
      restaurants.value = data.data.map(restaurant => ({
        id: restaurant._id,
        name: restaurant.nom,
        rating: parseFloat(restaurant.note) || 0,
        voteCount: restaurant.votes || 0,
        image: restaurant.image,
        types: restaurant.idTypeRestaurant || []
      }))
      
      console.log('🏪 Restaurants mappés:', restaurants.value)
    } else {
      throw new Error('Erreur lors de la récupération des données')
    }
  } catch (err) {
    error.value = err.message
    console.error('❌ Erreur lors de la récupération des restaurants:', err)
    
    // Données de fallback en cas d'erreur
    restaurants.value = [
      { id: 1, name: 'Le Petit Bistro', rating: 4.5, voteCount: 156 },
      { id: 2, name: 'Pizza Mario', rating: 4.2, voteCount: 89 },
      { id: 3, name: 'Sushi Zen', rating: 4.8, voteCount: 234 },
      { id: 4, name: 'Burger Palace', rating: 4.0, voteCount: 67 },
      { id: 5, name: 'La Trattoria', rating: 4.6, voteCount: 198 },
      { id: 6, name: 'Café de la Paix', rating: 4.3, voteCount: 112 }
    ]
  } finally {
    loading.value = false
  }
}

// Charger les données au montage du composant
onMounted(() => {
  fetchRestaurants()
})

// Définition des événements émis
const emit = defineEmits(['restaurant-selected'])

// Fonction pour gérer le clic sur un restaurant
const handleRestaurantClick = (restaurant) => {
  console.log('Restaurant sélectionné:', restaurant)
  emit('restaurant-selected', restaurant)
}
</script>

<style scoped>
.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #666;
  font-style: italic;
}

.error-message {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #e74c3c;
  font-weight: bold;
  background-color: #ffeaea;
  border-radius: 8px;
  margin: 20px;
}
</style>
