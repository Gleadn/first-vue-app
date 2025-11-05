<template>
  <div class="cart-item">
    <div class="cart-item-info">
      <p class="cart-item-restaurant">{{ cartItem.restaurantName }}</p>
      <div class="cart-item-details">
        <h4 class="cart-item-name">{{ cartItem.name }}</h4>
        <span class="cart-item-price">{{ formatPrice(cartItem.price) }}€</span>
      </div>
    </div>
    
    <div class="cart-item-controls">
      <div class="quantity-controls">
        <button class="quantity-btn" @click="decreaseQuantity">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13H5v-2h14v2z"/>
          </svg>
        </button>
        <span class="quantity">{{ cartItem.quantity }}</span>
        <button class="quantity-btn" @click="increaseQuantity">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
        </button>
      </div>
      
      <button class="remove-btn" @click="removeItem">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
// Props
const props = defineProps({
  cartItem: {
    type: Object,
    required: true
  }
})

// Événements
const emit = defineEmits(['increase', 'decrease', 'remove'])

// Fonctions
const increaseQuantity = () => {
  emit('increase', props.cartItem.id)
}

const decreaseQuantity = () => {
  emit('decrease', props.cartItem.id)
}

const removeItem = () => {
  emit('remove', props.cartItem.id)
}

const formatPrice = (price) => {
  return price.toFixed(2)
}
</script>

<style scoped>
/* Les styles sont dans CartModal.css */
</style>