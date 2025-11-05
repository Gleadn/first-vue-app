<template>
  <div class="menu-item-card">
    <div class="menu-item-image">
      <!-- Image de l'item si disponible -->
      <img 
        v-if="menuItem.image" 
        :src="menuItem.image" 
        :alt="menuItem.name"
        class="item-image"
      />
      <!-- Placeholder si pas d'image -->
      <div v-else class="item-image-placeholder">
        🍽️
      </div>
    </div>
    
    <div class="menu-item-info">
      <h3 class="menu-item-name">{{ menuItem.name }}</h3>
      <p class="menu-item-description" v-if="menuItem.description">
        {{ menuItem.description }}
      </p>
      <div class="menu-item-footer">
        <span class="menu-item-price">{{ formatPrice(menuItem.price) }}€</span>
        <button class="add-btn" @click="handleAddToCart">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  menuItem: {
    type: Object,
    required: true,
    validator: (value) => {
      return value && 
             (typeof value.id !== 'undefined' || typeof value._id !== 'undefined') && 
             typeof value.name === 'string' &&
             typeof value.price === 'number'
    }
  }
})

const emit = defineEmits(['add-to-cart'])

// Fonctions
const handleAddToCart = () => {
  emit('add-to-cart', props.menuItem)
}

const formatPrice = (price) => {
  return price.toFixed(2)
}
</script>

<style scoped>
.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.item-image-placeholder {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #ccc;
  border-radius: 8px;
}

/* Styles des composants parent inclus via RestaurantMenuModal.css */
</style>