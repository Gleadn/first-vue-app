<template>
  <div class="carousel-container">
    <!-- État de chargement -->
    <div v-if="loading" class="carousel-loading">
      <div class="loading-spinner"></div>
      <p>Chargement des restaurants en vedette...</p>
    </div>

    <!-- Erreur -->
    <div v-else-if="error" class="carousel-error">
      <p>Erreur: {{ error }}</p>
    </div>

    <!-- Carrousel -->
    <div v-else class="carousel-wrapper">
      <!-- Bouton précédent -->
      <button class="carousel-btn carousel-btn-prev" @click="previousSlide" v-if="slides.length > 1">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
      </button>

      <!-- Contenu du carrousel -->
      <div class="carousel-content" ref="carouselContent">
        <div 
          class="carousel-track" 
          :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
        >
          <div 
            v-for="(slide, index) in slides" 
            :key="slide.id || index"
            class="carousel-slide"
            :style="{ backgroundColor: slide.color }"
          >
            <!-- Image du restaurant si disponible -->
            <div v-if="slide.image" class="slide-image">
              <img :src="slide.image" :alt="slide.title" />
            </div>
            
            <div class="slide-content">
              <h3 class="slide-title">{{ slide.title }}</h3>
              <p class="slide-description">{{ slide.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Bouton suivant -->
      <button class="carousel-btn carousel-btn-next" @click="nextSlide" v-if="slides.length > 1">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
        </svg>
      </button>
    </div>

    <!-- Indicateurs de position -->
    <div v-if="slides.length > 1" class="carousel-indicators">
      <button
        v-for="(slide, index) in slides"
        :key="slide.id || index"
        class="indicator"
        :class="{ active: index === currentSlide }"
        @click="goToSlide(index)"
      ></button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import '@/styles/Carrousel.css'

// État du carrousel
const currentSlide = ref(0)
const autoPlayInterval = ref(null)
const slides = ref([])
const loading = ref(true)
const error = ref(null)

// Récupérer les restaurants populaires pour les slides
const fetchFeaturedRestaurants = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await fetch('http://localhost:3000/api/restaurants')
    if (!response.ok) {
      throw new Error('Erreur lors du chargement des restaurants')
    }
    
    const data = await response.json()
    
    // Vérifier que data contient bien un tableau de restaurants
    const restaurants = data.success ? data.data : data
    
    // S'assurer que restaurants est bien un tableau
    if (!Array.isArray(restaurants)) {
      throw new Error('Les données reçues ne sont pas au bon format')
    }
    
    // Prendre les 5 restaurants les mieux notés pour le carrousel
    const featuredRestaurants = restaurants
      .sort((a, b) => (b.note || b.rating || 0) - (a.note || a.rating || 0))
      .slice(0, 5)
    
    // Créer les slides à partir des restaurants
    slides.value = featuredRestaurants.map((restaurant, index) => ({
      id: restaurant._id,
      title: restaurant.nom || restaurant.name,
      description: `${restaurant.description || 'Découvrez notre sélection'} - Note: ${restaurant.note || restaurant.rating || 0}/5`,
      image: restaurant.image,
      color: getSlideColor(index),
      restaurant: restaurant
    }))
    
  } catch (err) {
    console.error('Erreur lors du chargement des restaurants en vedette:', err)
    error.value = err.message
    
    // Fallback avec données par défaut en cas d'erreur
    slides.value = [
      {
        title: 'Restaurants populaires',
        description: 'Découvrez les meilleurs restaurants près de chez vous',
        color: '#FF6B6B'
      },
      {
        title: 'Livraison rapide', 
        description: 'Commandez et recevez vos plats en 30 minutes',
        color: '#4ECDC4'
      },
      {
        title: 'Promotions spéciales',
        description: 'Profitez de nos offres exceptionnelles',
        color: '#45B7D1'
      }
    ]
  } finally {
    loading.value = false
  }
}

// Couleurs pour les slides
const getSlideColor = (index) => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
  return colors[index % colors.length]
}

// Navigation
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length
  resetAutoPlay()
}

const previousSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? slides.value.length - 1 : currentSlide.value - 1
  resetAutoPlay()
}

const goToSlide = (index) => {
  currentSlide.value = index
  resetAutoPlay()
}

// Auto-play
const startAutoPlay = () => {
  autoPlayInterval.value = setInterval(() => {
    nextSlide()
  }, 10000) // 10 secondes
}

const stopAutoPlay = () => {
  if (autoPlayInterval.value) {
    clearInterval(autoPlayInterval.value)
    autoPlayInterval.value = null
  }
}

const resetAutoPlay = () => {
  stopAutoPlay()
  startAutoPlay()
}

// Lifecycle
onMounted(async () => {
  await fetchFeaturedRestaurants()
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>
