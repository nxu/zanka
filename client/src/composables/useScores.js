import { ref } from 'vue'
import { api } from '../api.js'

const entries = ref([])
const loading = ref(false)

async function fetchEntries() {
  loading.value = true
  try {
    entries.value = await api.get('/api/admin/scores')
  } finally {
    loading.value = false
  }
}

async function createEntry(data) {
  const entry = await api.post('/api/admin/scores', data)
  entries.value.unshift(entry)
}

async function updateEntry(id, data) {
  const updated = await api.put(`/api/admin/scores/${id}`, data)
  const idx = entries.value.findIndex((e) => e.id === id)
  if (idx !== -1) entries.value[idx] = updated
}

async function deleteEntry(id) {
  await api.del(`/api/admin/scores/${id}`)
  entries.value = entries.value.filter((e) => e.id !== id)
}

export function useScores() {
  return { entries, loading, fetchEntries, createEntry, updateEntry, deleteEntry }
}
