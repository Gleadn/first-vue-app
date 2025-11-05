<template>
  <div class="restaurant-card" @click="handleClick">
    <div class="restaurant-image-container">
      <!-- Image du restaurant si disponible -->
      <img 
        v-if="restaurant.image" 
        :src="restaurant.image" 
        :alt="restaurant.name"
        class="restaurant-image"
      />
      <!-- Placeholder si pas d'image -->
      <div v-else class="restaurant-image-placeholder">
        📸
      </div>
    </div>
    <div class="restaurant-info">
      <h3 class="restaurant-name">{{ restaurant.name }}</h3>
      <div class="restaurant-rating">
        <div class="rating-stars">
          <svg 
            v-for="star in 5" 
            :key="star" 
            class="star-icon" 
            :class="{ 'filled': star <= Math.floor(restaurant.rating), 'half-filled': star === Math.ceil(restaurant.rating) && restaurant.rating % 1 !== 0 }"
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <span class="rating-text">{{ restaurant.rating }}</span>
        <span class="rating-votes">({{ restaurant.voteCount }})</span>
      </div>
    </div>
  </div>
</template>

<script setup>
// Définition des props
const props = defineProps({
  restaurant: {
    type: Object,
    required: true,
    validator: (value) => {
      return value && 
             typeof value.id !== 'undefined' && 
             typeof value.name === 'string' &&
             typeof value.rating === 'number' &&
             typeof value.voteCount === 'number'
    }
  }
})

// Définition des événements émis
const emit = defineEmits(['click'])

// Fonction pour gérer le clic
const handleClick = () => {
  emit('click', props.restaurant)
}
</script>

<style scoped>
/* Styles pour le RestaurantCard */
.restaurant-image-container {
  width: 100%;
  height: 200px;
  position: relative;
  overflow: hidden;
}

.restaurant-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px 12px 0 0;
  transition: transform 0.3s ease;
}

.restaurant-image:hover {
  transform: scale(1.05);
}

.restaurant-image-placeholder {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: #ccc;
  border-radius: 12px 12px 0 0;
}

/* Les autres styles sont importés depuis RestaurantGrid.css */
</style>