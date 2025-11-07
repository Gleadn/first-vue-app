/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'
import configureSentry from '@/plugins/sentry'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Styles
import 'unfonts.css'
import '@/styles/index.css'

const app = createApp(App)

// Initialiser Sentry AVANT les autres plugins
configureSentry(app)

registerPlugins(app)

app.mount('#app')
