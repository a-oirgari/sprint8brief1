<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>Créer un compte</h1>

      <form @submit.prevent="handleSubmit">
        <!-- Name -->
        <div class="field">
          <label>Nom</label>
          <input v-model="form.name" type="text" placeholder="John Doe" required />
          <span v-if="errors.name" class="error">{{ errors.name[0] }}</span>
        </div>

        <!-- Email -->
        <div class="field">
          <label>Email</label>
          <input v-model="form.email" type="email" placeholder="john@example.com" required />
          <span v-if="errors.email" class="error">{{ errors.email[0] }}</span>
        </div>

        <!-- Password -->
        <div class="field">
          <label>Mot de passe</label>
          <input v-model="form.password" type="password" placeholder="8 caractères minimum" required />
          <span v-if="errors.password" class="error">{{ errors.password[0] }}</span>
        </div>

        <!-- Confirm password -->
        <div class="field">
          <label>Confirmer le mot de passe</label>
          <input v-model="form.password_confirmation" type="password" required />
        </div>

        <p v-if="globalError" class="error global">{{ globalError }}</p>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Création...' : "S'inscrire" }}
        </button>
      </form>

      <div class="divider">ou</div>

      <SocialButtons />

      <p class="switch">Déjà un compte ? <RouterLink to="/login">Se connecter</RouterLink></p>
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

const form = ref({ name: '', email: '', password: '', password_confirmation: '' })
const errors      = ref({})
const globalError = ref('')
const loading     = ref(false)

async function handleSubmit() {
  errors.value      = {}
  globalError.value = ''
  loading.value     = true

  try {
    await auth.register(form.value)
    router.push('/login')
  } catch (err) {
    const data = err.response?.data
    if (data?.errors) {
      errors.value = data.errors
    } else {
      globalError.value = data?.message || 'Une erreur est survenue.'
    }
  } finally {
    loading.value = false
  }
}
</script>