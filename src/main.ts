import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { vMagnetic } from '@/composables/useMagnetic'

import './styles/main.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.directive('magnetic', vMagnetic)

app.mount('#app')
