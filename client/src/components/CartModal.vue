<template>
  <Transition name="cart-modal">
    <div v-if="isVisible" class="cart-modal-overlay" @click="closeModal">
      <div class="cart-modal" @click.stop>
        <!-- Header du modal -->
        <div class="cart-modal-header">
          <h2 class="cart-title">Mon Panier</h2>
          <button class="close-btn" @click="closeModal">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <!-- Contenu du panier -->
        <div class="cart-content">
          <!-- Panier vide -->
          <div v-if="cartItems.length === 0" class="cart-empty">
            <div class="empty-icon">🛍️</div>
            <p class="empty-text">Votre panier est vide</p>
            <p class="empty-subtext">Ajoutez des articles depuis le menu des restaurants</p>
          </div>
          
          <!-- Articles du panier -->
          <div v-else class="cart-items">
            <CartItem
              v-for="item in cartItems"
              :key="item.id"
              :cart-item="item"
              @increase="increaseQuantity"
              @decrease="decreaseQuantity"
              @remove="removeFromCart"
            />
            
            <!-- Total -->
            <div class="cart-total">
              <div class="total-line">
                <span class="total-label">Total:</span>
                <span class="total-amount">{{ formatPrice(cartTotal) }}€</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer du modal -->
        <div class="cart-modal-footer">
          <button class="checkout-btn" @click="handleCheckout">
            Finaliser la commande
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import CartItem from './CartItem.vue'
import { useCart } from '@/composables/useCart'
import '@/styles/CartModal.css'

// Utiliser le composable du panier
const { cartItems, cartTotal, increaseQuantity, decreaseQuantity, removeFromCart } = useCart()

// Props
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
})

// Événements émis
const emit = defineEmits(['close', 'checkout'])

// Fonctions
const closeModal = () => {
  emit('close')
}

const handleCheckout = () => {
  console.log('Finaliser la commande')
  // Aucune logique pour l'instant comme demandé
  emit('checkout')
}

const formatPrice = (price) => {
  return price.toFixed(2)
}
</script>
