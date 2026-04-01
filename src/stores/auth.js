import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  // ── State ──────────────────────────────────────────────────
  const token = ref(localStorage.getItem('token') || null)
  const user  = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  // ── Getters ────────────────────────────────────────────────
  const isAuthenticated = computed(() => !!token.value)
  const isOAuth         = computed(() => !!user.value?.is_oauth || !!user.value?.provider)

  // ── Helpers ────────────────────────────────────────────────
  function _persist(newToken, newUser) {
    token.value = newToken
    user.value  = newUser
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  function _clear() {
    token.value = null
    user.value  = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // ── Actions ────────────────────────────────────────────────
  async function register(payload) {
    const { data } = await api.post('/register', payload)
    return data
  }

  async function login(payload) {
    const { data } = await api.post('/login', payload)
    _persist(data.token, data.user)
    return data
  }

  async function logout() {
    await api.post('/logout')
    _clear()
  }

  async function fetchProfile() {
    const { data } = await api.get('/me')
    user.value = data.user
    localStorage.setItem('user', JSON.stringify(data.user))
    return data.user
  }

  async function updateProfile(payload) {
    const { data } = await api.put('/me', payload)
    user.value = data.user
    localStorage.setItem('user', JSON.stringify(data.user))
    return data
  }

  async function updatePassword(payload) {
    const { data } = await api.put('/me/password', payload)
    // All tokens revoked server-side → clear local session
    _clear()
    return data
  }

  async function deleteAccount() {
    await api.delete('/me')
    _clear()
  }

  // OAuth: get redirect URL from API then navigate
  async function socialLogin(provider) {
    const { data } = await api.get(`/auth/${provider}/redirect`)
    window.location.href = data.url
  }

  // Called on /oauth/callback?token=... after backend redirects
  function handleOAuthCallback(newToken, newUser) {
    _persist(newToken, newUser)
  }

  return {
    token, user,
    isAuthenticated, isOAuth,
    register, login, logout,
    fetchProfile, updateProfile, updatePassword, deleteAccount,
    socialLogin, handleOAuthCallback,
  }
})