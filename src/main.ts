import { createApp } from 'vue'
import { createPinia } from 'pinia'

import Vant from 'vant'

import App from './App.vue'
import router from './router'

import './assets/main.css'
import 'vant/lib/index.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Vant)

app.mount('#app')
