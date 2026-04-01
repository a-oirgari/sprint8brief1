<template>
  <div class="auth-page">
    <div class="auth-card" style="text-align:center">
      <p v-if="error" class="error global">{{ error }}</p>
      <p v-else>Connexion en cours...</p>
    </div>
  </div>
</template>

<script setup>
/**
 * This page is loaded when the Laravel backend redirects back to the SPA
 * after a successful OAuth callback.
 *
 * Expected URL format:
 *   http://localhost:5173/oauth/callback?token=xxx&user=base64encodedJson
 *
 * The SocialAuthController must redirect to FRONTEND_URL/oauth/callback
 * with the token and user as query params.
 */
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth   = useAuthStore()
const error  = ref('')

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const token  = params.get('token')
  const userRaw = params.get('user')

  if (!token || !userRaw) {
    error.value = 'Authentification OAuth échouée. Réessayez.'
    setTimeout(() => router.push('/login'), 2000)
    return
  }

  try {
    const user = JSON.parse(atob(userRaw))
    auth.handleOAuthCallback(token, user)
    router.push('/profile')
  } catch {
    error.value = 'Données invalides. Redirection...'
    setTimeout(() => router.push('/login'), 2000)
  }
})
</script>