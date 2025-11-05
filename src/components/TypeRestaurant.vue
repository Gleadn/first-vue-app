<template>
  <div class="restaurant-types-bar">    
    <div class="restaurant-types-content">
      <!-- Indicateur de chargement -->
      <div v-if="loading" class="loading-indicator">
        Chargement des types de restaurants...
      </div>
      
      <!-- Message d'erreur -->
      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>
      
      <!-- Liste des types de restaurants -->
      <RestaurantTypeItem
        v-else
        v-for="restaurantType in restaurantTypes" 
        :key="restaurantType.id"
        :restaurant-type="restaurantType"
        @click="selectRestaurantType"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import RestaurantTypeItem from './RestaurantTypeItem.vue'

// Import du fichier de styles
import '@/styles/TypeRestaurant.css'

// Données des types de restaurants
const restaurantTypes = ref([])
const loading = ref(true)
const error = ref(null)

// Fonction pour récupérer les types de restaurants depuis l'API
const fetchRestaurantTypes = async () => {
  try {
    loading.value = true
    const response = await fetch('http://localhost:3000/api/type-restaurants')
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.success) {
      // Adapter les données de l'API au format attendu par le composant
      restaurantTypes.value = data.data.map(type => ({
        id: type._id,
        name: type.nom,
        icon: type.icone
      }))
    } else {
      throw new Error('Erreur lors de la récupération des données')
    }
  } catch (err) {
    error.value = err.message
    console.error('Erreur lors de la récupération des types de restaurants:', err)
    
    // Données de fallback en cas d'erreur
    restaurantTypes.value = [
      { id: 1, name: 'Français' },
      { id: 2, name: 'Italien' },
      { id: 3, name: 'Asiatique' },
      { id: 4, name: 'Mexicain' },
      { id: 5, name: 'Gastronomique' },
      { id: 6, name: 'Fast Food' },
      { id: 7, name: 'Végétarien' }
    ]
  } finally {
    loading.value = false
  }
}

// Charger les données au montage du composant
onMounted(() => {
  fetchRestaurantTypes()
})

// Définition des événements émis
const emit = defineEmits(['restaurant-type-selected'])

// Fonction pour sélectionner un type de restaurant
const selectRestaurantType = (restaurantType) => {
  console.log('Type de restaurant sélectionné:', restaurantType)
  emit('restaurant-type-selected', restaurantType)
}
</script>
