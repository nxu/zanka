import { ref } from 'vue'
import { api } from '../api.js'

const teams = ref([])
const topPeople = ref([])
const allPeople = ref([])
const latestEntries = ref([])
const loading = ref(true)
const error = ref('')

async function fetchDashboard() {
  loading.value = true
  error.value = ''
  try {
    const data = await api.get('/api/public/dashboard')
    teams.value = data.teams
    topPeople.value = data.topPeople
    allPeople.value = data.allPeople
    latestEntries.value = data.latestEntries
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

export function useDashboard() {
  return { teams, topPeople, allPeople, latestEntries, loading, error, fetchDashboard }
}
