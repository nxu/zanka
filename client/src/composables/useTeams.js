import { ref } from 'vue'
import { api } from '../api.js'

const teams = ref([])
const loading = ref(false)

async function fetchTeams() {
  loading.value = true
  try {
    teams.value = await api.get('/api/admin/teams')
  } finally {
    loading.value = false
  }
}

async function createTeam(data) {
  const team = await api.post('/api/admin/teams', data)
  teams.value.push(team)
}

async function updateTeam(id, data) {
  const updated = await api.put(`/api/admin/teams/${id}`, data)
  const idx = teams.value.findIndex((t) => t.id === id)
  if (idx !== -1) teams.value[idx] = updated
}

async function deleteTeam(id) {
  await api.del(`/api/admin/teams/${id}`)
  teams.value = teams.value.filter((t) => t.id !== id)
}

export function useTeams() {
  return { teams, loading, fetchTeams, createTeam, updateTeam, deleteTeam }
}
