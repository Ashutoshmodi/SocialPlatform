import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
    { path: '/', name: 'feed', component: () => import('@/pages/FeedPage.vue'), meta: { requiresAuth: true } },
    { path: '/search', name: 'search', component: () => import('@/pages/SearchPage.vue'), meta: { requiresAuth: true } },
    { path: '/profile/:id', name: 'profile', component: () => import('@/pages/ProfilePage.vue'), meta: { requiresAuth: true } },
    {
        path: '/profile/:id/:kind(followers|following)',
        name: 'follow-list',
        component: () => import('@/pages/FollowListPage.vue'),
        meta: { requiresAuth: true },
    },
    { path: '/login', name: 'login', component: () => import('@/pages/LoginPage.vue'), meta: { guestOnly: true } },
    { path: '/register', name: 'register', component: () => import('@/pages/RegisterPage.vue'), meta: { guestOnly: true } },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/pages/NotFoundPage.vue') },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to) => {
    const auth = useAuthStore()

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        auth.logout()
        return { name: 'login', query: { redirect: to.fullPath } }
    }
    if (to.meta.guestOnly && auth.isAuthenticated) {
        return { name: 'feed' }
    }
})

export default router