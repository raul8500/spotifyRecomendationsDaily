import { createRouter, createWebHistory } from 'vue-router'
import { useSpotifyStore } from '@/stores/spotify'
import SpotifyLogin from '@/components/SpotifyLogin.vue'
import SpotifyCallback from '@/components/SpotifyCallback.vue'
import MusicDashboard from '@/components/MusicDashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: SpotifyLogin,
      meta: { requiresAuth: false },
    },
    {
      path: '/callback',
      name: 'callback',
      component: SpotifyCallback,
      meta: { requiresAuth: false },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: MusicDashboard,
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const spotifyStore = useSpotifyStore()

  // Inicializar token si existe
  if (!spotifyStore.isAuthenticated) {
    spotifyStore.initToken()
  }

  if (to.meta.requiresAuth && !spotifyStore.isAuthenticated) {
    // Redirigir a login si requiere autenticación y no está autenticado
    next('/')
  } else if (to.name === 'login' && spotifyStore.isAuthenticated) {
    // Redirigir al dashboard si ya está autenticado
    next('/dashboard')
  } else {
    next()
  }
})

export default router
