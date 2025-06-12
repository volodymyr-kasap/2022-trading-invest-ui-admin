import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Confirm from '@/components/Confirm.vue'
import { refreshTokenPlugin } from '@/plugins'
import ElementPlus from 'element-plus'
import ruLocale from 'element-plus/dist/locale/ru'

const pinia = createPinia()
const app = createApp(App)

import App from './App.vue'
import router from './router'

import '@/styles/index.scss'

app.use(pinia)
app.use(router)
app.use(refreshTokenPlugin)
app.use(ElementPlus, { size: 'small', zIndex: 3000, locale: ruLocale })
app.component('Confirm', Confirm)

app.mount('#app')
