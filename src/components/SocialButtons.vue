<template>
  <div class="social-buttons">
    <button
      type="button"
      class="btn-social btn-google"
      :disabled="loading === 'google'"
      @click="login('google')"
    >
      <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.84l6.09-6.09C34.46 3.1 29.5 1 24 1 14.82 1 7.07 6.54 3.96 14.41l7.08 5.5C12.7 13.67 17.91 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.52 24.5c0-1.64-.15-3.22-.42-4.75H24v9h12.7c-.55 2.96-2.2 5.47-4.67 7.16l7.18 5.57C43.38 37.27 46.52 31.34 46.52 24.5z"/>
        <path fill="#FBBC05" d="M11.04 28.09A14.6 14.6 0 0 1 9.5 24c0-1.42.24-2.8.54-4.09l-7.08-5.5A23.94 23.94 0 0 0 0 24c0 3.86.92 7.5 2.54 10.73l8.5-6.64z"/>
        <path fill="#34A853" d="M24 47c6.48 0 11.93-2.15 15.9-5.84l-7.18-5.57C30.54 37.3 27.42 38.5 24 38.5c-6.09 0-11.3-4.17-13.14-9.82l-8.5 6.64C5.9 43.18 14.26 47 24 47z"/>
      </svg>
      {{ loading === 'google' ? 'Redirection...' : 'Continuer avec Google' }}
    </button>

    <button
      type="button"
      class="btn-social btn-github"
      :disabled="loading === 'github'"
      @click="login('github')"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.42 7.86 10.95.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.04-.72.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.72-1.53-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 2.87-.39c.97 0 1.95.13 2.87.39 2.18-1.49 3.14-1.18 3.14-1.18.63 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.08 0 4.41-2.69 5.38-5.25 5.66.41.36.78 1.07.78 2.15v3.19c0 .31.21.67.8.56C20.22 21.42 23.5 17.1 23.5 12 23.5 5.65 18.35.5 12 .5z"/>
      </svg>
      {{ loading === 'github' ? 'Redirection...' : 'Continuer avec GitHub' }}
    </button>

    <p v-if="errorMsg" class="error global">{{ errorMsg }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const auth     = useAuthStore()
const loading  = ref(null)   // 'google' | 'github' | null
const errorMsg = ref('')

async function login(provider) {
  loading.value  = provider
  errorMsg.value = ''
  try {
    await auth.socialLogin(provider)
    // Page navigates away — no need to reset loading
  } catch {
    errorMsg.value = `Impossible de se connecter avec ${provider}. Réessayez.`
    loading.value  = null
  }
}
</script>