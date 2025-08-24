import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import api from "./api/index.js"

const app = createApp(App)

//绑定api
app.config.globalProperties.$api = api

app.use(router)
app.mount('#app')
