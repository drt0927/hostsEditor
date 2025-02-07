import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import './assets/fonts/d2coding/d2coding.css'
import 'element-plus/dist/index.css'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.use(ElementPlus)

app.mount('#app')
