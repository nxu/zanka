import { ref } from 'vue'
import { api } from '../api.js'

const teams = ref([])
const people = ref([])
const loading = ref(false)

async function fetchStandings() {
  loading.value = true
  try {
    const data = await api.get('/api/admin/standings')
    teams.value = data.teams
    people.value = data.people
  } finally {
    loading.value = false
  }
}

export function useStandings() {
  return { teams, people, loading, fetchStandings }
}
