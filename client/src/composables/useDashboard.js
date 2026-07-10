import { ref } from 'vue'
import { api } from '../api.js'

const teams = ref([])
const topPeople = ref([])
const latestEntry = ref(null)
const loading = ref(true)
const error = ref('')

async function fetchDashboard() {
  loading.value = true
  error.value = ''
  try {
    const data = await api.get('/api/public/dashboard')
    teams.value = data.teams
    topPeople.value = data.topPeople
    latestEntry.value = data.latestEntry
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

export function useDashboard() {
  return { teams, topPeople, latestEntry, loading, error, fetchDashboard }
}
