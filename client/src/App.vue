<template>
  <v-app>
    <!-- Wrapper Sentry ErrorBoundary pour capturer les erreurs Vue (temporairement désactivé) -->
    <!-- <SentryErrorBoundary :fallback="ErrorFallback" :before-capture="beforeCapture"> -->
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
    <!-- </SentryErrorBoundary> -->
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
// import { Sentry } from '@/plugins/sentry'
import LoginRegisterForm from './components/LoginRegisterForm.vue';
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import HomePage from './components/HomePage.vue';

// Composant Sentry ErrorBoundary (temporairement désactivé)
// const SentryErrorBoundary = Sentry.ErrorBoundary

// État de connexion
const isLoggedIn = ref(false)

// Référence vers HomePage
const homePageRef = ref(null)

// Composant de fallback en cas d'erreur
const ErrorFallback = {
  template: `
    <v-container class="text-center pa-8">
      <v-icon size="64" color="error">mdi-alert-circle</v-icon>
      <h2 class="mt-4 mb-2">Une erreur s'est produite</h2>
      <p class="mb-4">Nous avons été notifiés de ce problème et nous travaillons à le résoudre.</p>
      <v-btn color="primary" @click="reload">Recharger la page</v-btn>
    </v-container>
  `,
  methods: {
    reload() {
      window.location.reload()
    }
  }
}

// Fonction appelée avant la capture d'erreur par Sentry
const beforeCapture = (scope, hint) => {
  console.log('🚨 Erreur capturée par Sentry ErrorBoundary:', hint.originalException)
  scope.setTag('component', 'App.vue')
  scope.setContext('userState', {
    isLoggedIn: isLoggedIn.value
  })
}

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
