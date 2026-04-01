<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>Connexion</h1>

      <form @submit.prevent="handleSubmit">
        <div class="field">
          <label>Email</label>
          <input v-model="form.email" type="email" placeholder="john@example.com" required />
        </div>

        <div class="field">
          <label>Mot de passe</label>
          <input v-model="form.password" type="password" required />
        </div>

        <p v-if="errorMsg" class="error global">{{ errorMsg }}</p>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>

      <div class="divider">ou</div>

      <SocialButtons />

      <p class="switch">Pas encore de compte ? <RouterLink to="/register">S'inscrire</RouterLink></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import SocialButtons from '../components/SocialButtons.vue'

const router  = useRouter()
const auth    = useAuthStore()

const form     = ref({ email: '', password: '' })
const errorMsg = ref('')
const loading  = ref(false)

async function handleSubmit() {
  errorMsg.value = ''
  loading.value  = true

  try {
    await auth.login(form.value)
    router.push('/profile')
  } catch (err) {
    const status = err.response?.status
    if (status === 401) {
      errorMsg.value = 'Email ou mot de passe incorrect.'
    } else if (status === 422) {
      errorMsg.value = 'Veuillez remplir tous les champs correctement.'
    } else {
      errorMsg.value = 'Une erreur est survenue. Réessayez.'
    }
  } finally {
    loading.value = false
  }
}
</script>