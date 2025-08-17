import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import "./style.css"
import store from "./store/index.js"


router.beforeEach((to,from) =>{
    const token = localStorage.getItem("pz_token")
    //非登录页面返回登录页面
    if(!token && to.path !== '/login'){
        return '/login'
    }else if (token && to.path === '/login'){
        //登录页面返回首页
        return '/'
    }else{
        return true
    }
})

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(router)
app.use(store)
app.mount('#app')
