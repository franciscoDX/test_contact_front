import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('jwt_token')

    if (to.meta.requiresAuth && !token) {
        next('/')
    } else {
        next()
    }
})

export default router
