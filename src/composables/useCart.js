import { ref, computed } from 'vue'

const cartItems = ref([])

export function useCart() {
  const addToCart = (menuItem, restaurantName = 'Restaurant') => {
    const existingItem = cartItems.value.find(item => item.id === menuItem.id && item.restaurantName === restaurantName)
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cartItems.value.push({
        ...menuItem,
        quantity: 1,
        restaurantName: restaurantName
      })
    }
    
    console.log('Article ajouté au panier:', menuItem.name)
  }

  const removeFromCart = (itemId) => {
    const index = cartItems.value.findIndex(item => item.id === itemId)
    if (index > -1) {
      cartItems.value.splice(index, 1)
    }
  }

  const increaseQuantity = (itemId) => {
    const item = cartItems.value.find(item => item.id === itemId)
    if (item) {
      item.quantity += 1
    }
  }

  const decreaseQuantity = (itemId) => {
    const item = cartItems.value.find(item => item.id === itemId)
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1
      } else {
        removeFromCart(itemId)
      }
    }
  }

  const clearCart = () => {
    cartItems.value = []
  }

  const cartTotal = computed(() => {
    return cartItems.value.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)
  })

  const cartItemsCount = computed(() => {
    return cartItems.value.reduce((count, item) => {
      return count + item.quantity
    }, 0)
  })

  return {
    cartItems,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    cartTotal,
    cartItemsCount
  }
}