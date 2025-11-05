import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '@/App.vue'

describe('App.vue', () => {
  it('renders correctly', () => {
    const wrapper = mount(App)
    expect(wrapper.exists()).toBe(true)
  })

  it('has the correct title', () => {
    const wrapper = mount(App)
    // Ajoutez vos tests spécifiques ici
    expect(wrapper.find('h1').exists()).toBe(true)
  })
})