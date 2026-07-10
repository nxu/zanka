import { ref } from 'vue'
import { api } from '../api.js'

const isAdmin = ref(false)
const checked = ref(false)

async function checkSession() {
  const data = await api.get('/api/auth/session')
  isAdmin.value = data.isAdmin
  checked.value = true
}

async function login(password) {
  await api.post('/api/auth/login', { password })
  isAdmin.value = true
}

async function logout() {
  await api.post('/api/auth/logout')
  isAdmin.value = false
}

export function useAuth() {
  return { isAdmin, checked, checkSession, login, logout }
}
