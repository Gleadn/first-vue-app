<template>
  <div class="home-container">
    <TypeRestaurant @restaurant-type-selected="handleRestaurantTypeSelected" />
    <div class="home-content">
      <div v-if="selectedRestaurantType" class="selected-type">
        <p>Type sélectionné : <strong>{{ selectedRestaurantType.name }}</strong></p>
      </div>
      <Carrousel />
      <RestaurantGrid @restaurant-selected="handleRestaurantSelected" />
    </div>
    
    <!-- Modal du panier -->
    <CartModal 
      :isVisible="isCartModalVisible" 
      @close="closeCartModal"
      @checkout="handleCheckout"
    />
    
    <!-- Modal du menu restaurant -->
    <RestaurantMenuModal
      :isVisible="isMenuModalVisible"
      :restaurant="selectedRestaurant"
      @close="closeMenuModal"
      @add-to-cart="handleAddToCart"
    />
    
    <!-- Notification toast -->
    <NotificationToast
      :isVisible="isNotificationVisible"
      :message="notificationMessage"
      @hide="hideNotification"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCart } from '@/composables/useCart'
// Import du fichier de styles
import '@/styles/HomePage.css'
import TypeRestaurant from './TypeRestaurant.vue'
import Carrousel from './Carrousel.vue'
import RestaurantGrid from './RestaurantGrid.vue'
import CartModal from './CartModal.vue'
import RestaurantMenuModal from './RestaurantMenuModal.vue'
import NotificationToast from './NotificationToast.vue'

// Utiliser le composable du panier
const { addToCart } = useCart()

// État pour le type de restaurant sélectionné
const selectedRestaurantType = ref(null)
// État pour le restaurant sélectionné
const selectedRestaurant = ref(null)
// État pour la visibilité du modal panier
const isCartModalVisible = ref(false)
// État pour la visibilité du modal menu
const isMenuModalVisible = ref(false)
// État pour la notification
const isNotificationVisible = ref(false)
const notificationMessage = ref('')

// Fonction pour gérer la sélection d'un type de restaurant
const handleRestaurantTypeSelected = (restaurantType) => {
  console.log('Type de restaurant sélectionné dans HomePage:', restaurantType)
  selectedRestaurantType.value = restaurantType
}

// Fonction pour gérer la sélection d'un restaurant
const handleRestaurantSelected = (restaurant) => {
  console.log('Restaurant sélectionné dans HomePage:', restaurant)
  selectedRestaurant.value = restaurant
  // Ouvrir le modal du menu quand un restaurant est sélectionné
  isMenuModalVisible.value = true
}

// Fonctions pour gérer le modal panier
const openCartModal = () => {
  isCartModalVisible.value = true
}

const closeCartModal = () => {
  isCartModalVisible.value = false
}

const handleCheckout = () => {
  console.log('Procéder au checkout')
  // Logique de checkout à implémenter plus tard
}

// Fonctions pour gérer le modal menu
const closeMenuModal = () => {
  isMenuModalVisible.value = false
}

const handleAddToCart = (menuItem) => {
  console.log('Ajouter au panier:', menuItem)
  // Utiliser le composable pour ajouter l'article au panier avec le nom du restaurant
  const restaurantName = selectedRestaurant.value?.name || 'Restaurant'
  addToCart(menuItem, restaurantName)
  
  // Afficher la notification
  notificationMessage.value = `${menuItem.name} - ${menuItem.price.toFixed(2)}€`
  isNotificationVisible.value = true
}

// Fonction pour cacher la notification
const hideNotification = () => {
  isNotificationVisible.value = false
}

// Exposer la fonction openCartModal pour que le parent puisse l'utiliser
defineExpose({
  openCartModal
})
</script>