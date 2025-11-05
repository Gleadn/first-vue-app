<template>
  <div 
    class="restaurant-type-card"
  >
    <div class="restaurant-type-icon">
      <!-- Affichage de l'icône si disponible -->
      <img 
        v-if="restaurantType.icon" 
        :src="restaurantType.icon" 
        :alt="restaurantType.name"
        class="icon-image"
      />
      <!-- Placeholder si pas d'icône -->
      <div v-else class="icon-placeholder"></div>
    </div>
    <p class="restaurant-type-name">{{ restaurantType.name }}</p>
  </div>
</template>

<script setup>
// Définition des props
const props = defineProps({
  restaurantType: {
    type: Object,
    required: true,
    validator: (value) => {
      return value && typeof value.id !== 'undefined' && typeof value.name === 'string'
    }
  }
})

// Définition des événements émis
const emit = defineEmits(['click'])

// Fonction pour gérer le clic
const handleClick = () => {
  emit('click', props.restaurantType)
}
</script>

<style scoped>
/* Les styles sont importés depuis TypeRestaurant.css */
.icon-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
}

.icon-placeholder {
  width: 100%;
  height: 100%;
  background-color: #333;
  border-radius: 50%;
}

.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #666;
  font-style: italic;
}

.error-message {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #e74c3c;
  font-weight: bold;
  background-color: #ffeaea;
  border-radius: 8px;
  margin: 10px;
}
</style>