<template>
  <header class="app-header">
    <div class="header-content">

      <div class="logo-section">
        <div class="logo-placeholder"></div>
        <h1 class="app-name">App Vuetify</h1>
      </div>

      <div v-if="isLoggedIn" class="search-section">
        <div class="search-container">
          <svg class="search-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input 
            type="text" 
            class="search-input" 
            placeholder="Rechercher un restaurant..."
            v-model="searchQuery"
            @input="handleSearch"
          />
        </div>
        <button class="cart-btn" @click="handleCartClick">
          <svg class="cart-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z"/>
          </svg>
        </button>
      </div>

      <div v-if="isLoggedIn" class="actions-section">
        <button class="header-btn profile-btn" @click="goToProfile">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          Profil
        </button>
        
        <button class="header-btn logout-btn" @click="handleLogout">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
          </svg>
          Déconnexion
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import '@/styles/AppHeader.css'

const props = defineProps({
  isLoggedIn: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['logout', 'search', 'cart-clicked'])

// État pour la recherche
const searchQuery = ref('')

const goToProfile = () => {
  console.log('Redirection vers le profil')
  // Ici vous pouvez ajouter la logique de navigation vers le profil
}

const handleLogout = () => {
  console.log('Déconnexion de l\'utilisateur')
  // Émettre l'événement de déconnexion vers le composant parent
  emit('logout')
}

const handleSearch = () => {
  console.log('Recherche:', searchQuery.value)
  // Émettre l'événement de recherche vers le composant parent
  emit('search', searchQuery.value)
}

const handleCartClick = () => {
  console.log('Clic sur le panier')
  // Émettre l'événement de clic sur le panier vers le composant parent
  emit('cart-clicked')
}
</script>
