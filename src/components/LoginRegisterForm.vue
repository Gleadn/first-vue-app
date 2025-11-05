<template>
  <div class="auth-container">
    <div class="auth-form">
      <h2 v-if="!isRegister">Connexion</h2>
      <h2 v-else>Inscription</h2>

      <form @submit.prevent="isRegister ? handleRegister() : handleLogin()">
        <div class="input-group">
          <label for="email">Email</label>
          <input 
            id="email"
            type="email" 
            v-model="email" 
            placeholder="Entrez votre email"
            required 
          />
        </div>

        <div class="input-group">
          <label for="password">Mot de passe</label>
          <input 
            id="password"
            type="password" 
            v-model="password" 
            placeholder="Entrez votre mot de passe"
            required 
          />
        </div>

        <div v-if="isRegister" class="input-group">
          <label for="confirmPassword">Confirmer le mot de passe</label>
          <input 
            id="confirmPassword"
            type="password" 
            v-model="confirmPassword" 
            placeholder="Confirmez votre mot de passe"
            required 
          />
        </div>

        <button type="submit" class="submit-btn">
          {{ isRegister ? "S'inscrire" : "Se connecter" }}
        </button>
      </form>

      <button type="button" @click="toggleMode" class="toggle-btn">
        {{ isRegister ? "Déjà un compte ? Se connecter" : "Pas encore inscrit ? S'inscrire" }}
      </button>

      <div v-if="message" class="message" :class="messageType">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Import du fichier de styles
import '@/styles/LoginRegisterForm.css'

// Définition des événements émis
const emit = defineEmits(['login'])

// Variables réactives
const isRegister = ref(false)
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const message = ref('')
const messageType = ref('')

// Fonctions
const toggleMode = () => {
  isRegister.value = !isRegister.value
  clearForm()
  clearMessage()
}

const clearForm = () => {
  email.value = ''
  password.value = ''
  confirmPassword.value = ''
}

const clearMessage = () => {
  message.value = ''
  messageType.value = ''
}

const showMessage = (text, type) => {
  message.value = text
  messageType.value = type
  setTimeout(() => {
    clearMessage()
  }, 3000)
}

const handleLogin = () => {
  clearMessage()
  
  if (!email.value || !password.value) {
    showMessage('Veuillez remplir tous les champs', 'error')
    return
  }

  // Simulation de la connexion
  console.log('Tentative de connexion:', { email: email.value, password: password.value })
  showMessage('Connexion réussie !', 'success')
  
  // Émettre l'événement de connexion vers le composant parent
  setTimeout(() => {
    emit('login')
    clearForm()
  }, 1000) // Délai pour voir le message de succès
}

const handleRegister = () => {
  clearMessage()
  
  if (!email.value || !password.value || !confirmPassword.value) {
    showMessage('Veuillez remplir tous les champs', 'error')
    return
  }

  if (password.value !== confirmPassword.value) {
    showMessage('Les mots de passe ne correspondent pas', 'error')
    return
  }

  if (password.value.length < 6) {
    showMessage('Le mot de passe doit contenir au moins 6 caractères', 'error')
    return
  }

  // Simulation de l'inscription
  console.log('Tentative d\'inscription:', { email: email.value, password: password.value })
  showMessage('Inscription réussie !', 'success')
  clearForm()
}
</script>
