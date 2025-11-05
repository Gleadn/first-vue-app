<template>
  <Transition name="notification">
    <div v-if="isVisible" class="notification-toast">
      <div class="notification-icon">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 16.17L5.53 12.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L8.47 18.46c.39.39 1.02.39 1.41 0L20.24 8.11c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L9 16.17z"/>
        </svg>
      </div>
      <div class="notification-content">
        <p class="notification-title">Ajouté au panier !</p>
        <p class="notification-message">{{ message }}</p>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import '@/styles/NotificationToast.css'

// Props
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 3000 // 3 secondes par défaut
  }
})

// Événements émis
const emit = defineEmits(['hide'])

// Auto-hide après la durée spécifiée
let hideTimeout = null

watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    // Effacer le timeout précédent s'il existe
    if (hideTimeout) {
      clearTimeout(hideTimeout)
    }
    
    // Programmer la disparition automatique
    hideTimeout = setTimeout(() => {
      emit('hide')
    }, props.duration)
  } else {
    // Nettoyer le timeout si la notification est cachée manuellement
    if (hideTimeout) {
      clearTimeout(hideTimeout)
      hideTimeout = null
    }
  }
})

// Nettoyage lors de la destruction du composant
import { onUnmounted } from 'vue'
onUnmounted(() => {
  if (hideTimeout) {
    clearTimeout(hideTimeout)
  }
})
</script>