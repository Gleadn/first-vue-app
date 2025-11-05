<template>
  <v-app>
    <AppHeader 
      :isLoggedIn="isLoggedIn" 
      @logout="handleLogout"
      @cart-clicked="handleCartClick"
    />

    <v-main>
      <LoginRegisterForm v-if="!isLoggedIn" @login="handleLogin" />
      <HomePage v-else ref="homePageRef" />
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import LoginRegisterForm from './components/LoginRegisterForm.vue';
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import HomePage from './components/HomePage.vue';

// État de connexion
const isLoggedIn = ref(false)

// Référence vers HomePage
const homePageRef = ref(null)

// Fonction pour gérer la connexion
const handleLogin = () => {
  isLoggedIn.value = true
  console.log('Utilisateur connecté')
}

// Fonction pour gérer la déconnexion
const handleLogout = () => {
  isLoggedIn.value = false
  console.log('Utilisateur déconnecté')
}

// Fonction pour gérer le clic sur le panier
const handleCartClick = () => {
  console.log('Icône panier cliquée')
  if (homePageRef.value && homePageRef.value.openCartModal) {
    homePageRef.value.openCartModal()
  }
}
</script>
