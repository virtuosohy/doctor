import Layout from "../views/Main.vue";
import Login from "../views/login/index.vue";

import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
    {
        path:"/",
        component: Layout
    },
    {
        path:"/login",
        component: Login
    }
]

const router = createRouter({
    routes,
    history: createWebHashHistory()
})

export default router;
