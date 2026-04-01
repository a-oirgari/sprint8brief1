<template>
  <div class="profile-page">
    <div class="profile-card">
      <header>
        <h1>Mon profil</h1>
        <button class="btn-danger-outline" @click="handleLogout">Déconnexion</button>
      </header>

      <!-- Loader -->
      <div v-if="loading" class="loader">Chargement...</div>

      <template v-else>
       
        <section>
          <h2>Informations</h2>
          <form @submit.prevent="handleUpdateProfile">
            <div class="field">
              <label>Nom</label>
              <input v-model="profileForm.name" type="text" required />
              <span v-if="profileErrors.name" class="error">{{ profileErrors.name[0] }}</span>
            </div>
            <div class="field">
              <label>Email</label>
              <input v-model="profileForm.email" type="email" required />
              <span v-if="profileErrors.email" class="error">{{ profileErrors.email[0] }}</span>
            </div>
            <p v-if="profileSuccess" class="success">{{ profileSuccess }}</p>
            <p v-if="profileError"  class="error global">{{ profileError }}</p>
            <button type="submit" :disabled="profileLoading">
              {{ profileLoading ? 'Mise à jour...' : 'Mettre à jour' }}
            </button>
          </form>
        </section>

        
        <section>
          <h2>Mot de passe</h2>

          <!-- Disabled for OAuth accounts -->
          <p v-if="auth.isOAuth" class="info">
            Votre compte est lié à {{ auth.user?.provider }}. Le changement de mot de passe n'est pas disponible.
          </p>

          <form v-else @submit.prevent="handleUpdatePassword">
            <div class="field">
              <label>Mot de passe actuel</label>
              <input v-model="passwordForm.current_password" type="password" required />
            </div>
            <div class="field">
              <label>Nouveau mot de passe</label>
              <input v-model="passwordForm.new_password" type="password" required />
              <span v-if="passwordErrors.new_password" class="error">{{ passwordErrors.new_password[0] }}</span>
            </div>
            <div class="field">
              <label>Confirmer le nouveau mot de passe</label>
              <input v-model="passwordForm.new_password_confirmation" type="password" required />
            </div>
            <p v-if="passwordSuccess" class="success">{{ passwordSuccess }}</p>
            <p v-if="passwordError"  class="error global">{{ passwordError }}</p>
            <button type="submit" :disabled="passwordLoading">
              {{ passwordLoading ? 'Mise à jour...' : 'Changer le mot de passe' }}
            </button>
          </form>
        </section>

        
        <section class="danger-zone">
          <h2>Zone de danger</h2>
          <button class="btn-danger" @click="showDeleteModal = true">Supprimer mon compte</button>
        </section>
      </template>
    </div>

    
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal">
        <h3>Supprimer mon compte ?</h3>
        <p>Cette action est irréversible. Toutes vos données seront perdues.</p>
        <div class="modal-actions">
          <button @click="showDeleteModal = false">Annuler</button>
          <button class="btn-danger" :disabled="deleteLoading" @click="handleDeleteAccount">
            {{ deleteLoading ? 'Suppression...' : 'Confirmer la suppression' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth   = useAuthStore()

const loading = ref(true)

// Profile form
const profileForm    = ref({ name: '', email: '' })
const profileErrors  = ref({})
const profileError   = ref('')
const profileSuccess = ref('')
const profileLoading = ref(false)

// Password form
const passwordForm    = ref({ current_password: '', new_password: '', new_password_confirmation: '' })
const passwordErrors  = ref({})
const passwordError   = ref('')
const passwordSuccess = ref('')
const passwordLoading = ref(false)

// Delete modal
const showDeleteModal = ref(false)
const deleteLoading   = ref(false)

onMounted(async () => {
  try {
    const user = await auth.fetchProfile()
    profileForm.value.name  = user.name
    profileForm.value.email = user.email
  } finally {
    loading.value = false
  }
})

async function handleUpdateProfile() {
  profileErrors.value  = {}
  profileError.value   = ''
  profileSuccess.value = ''
  profileLoading.value = true

  try {
    await auth.updateProfile(profileForm.value)
    profileSuccess.value = 'Profil mis à jour avec succès.'
  } catch (err) {
    const data = err.response?.data
    if (data?.errors) profileErrors.value = data.errors
    else profileError.value = data?.message || 'Erreur lors de la mise à jour.'
  } finally {
    profileLoading.value = false
  }
}

async function handleUpdatePassword() {
  passwordErrors.value  = {}
  passwordError.value   = ''
  passwordSuccess.value = ''
  passwordLoading.value = true

  try {
    await auth.updatePassword(passwordForm.value)
    // Token revoked → redirected to login
    router.push('/login')
  } catch (err) {
    const data = err.response?.data
    if (data?.errors) passwordErrors.value = data.errors
    else passwordError.value = data?.message || 'Erreur lors du changement.'
  } finally {
    passwordLoading.value = false
  }
}

async function handleLogout() {
  await auth.logout()
  router.push('/login')
}

async function handleDeleteAccount() {
  deleteLoading.value = true
  try {
    await auth.deleteAccount()
    router.push('/login')
  } finally {
    deleteLoading.value = false
    showDeleteModal.value = false
  }
}
</script>