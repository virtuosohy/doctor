import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import api from "./api/index.js"

const app = createApp(App)

//绑定api
app.config.globalProperties.$api = api

router.beforeEach((to, from) => {
    // 返回 false 以取消导航
    if(to.path !== '/login'){
        if(!localStorage.getItem('h5_token')){
            return '/login'
        }
    }
})
app.use(router)
app.mount('#app')
