import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterView.vue'),
    meta: { guest: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { guest: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/ProfileView.vue'),
    meta: { requiresAuth: true },
  },
  {
    // Page de retour OAuth : /oauth/callback?token=xxx&user=yyy
    path: '/oauth/callback',
    name: 'OAuthCallback',
    component: () => import('../views/OAuthCallbackView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ── Route Guards ──────────────────────────────────────────────
router.beforeEach((to) => {
  const token = localStorage.getItem('token')

  // Protected route → redirect to login if no token
  if (to.meta.requiresAuth && !token) {
    return { name: 'Login' }
  }

  // Guest-only route (login/register) → redirect to profile if already logged in
  if (to.meta.guest && token) {
    return { name: 'Profile' }
  }
})

export default router