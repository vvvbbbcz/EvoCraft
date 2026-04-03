import { createRouter, createWebHistory } from 'vue-router'
import Bots from '../views/Bots.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Home',
            redirect: '/bots',
        },
        {
            path: '/bots',
            name: 'Bots',
            component: Bots,
        },
        {
            path: '/skills',
            name: 'Skills',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/Skills.vue'),
        },
    ],
})

export default router
