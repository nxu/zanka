import { ref } from 'vue'
import { api } from '../api.js'

const sidequests = ref([])
const loading = ref(false)

async function fetchSidequests() {
  loading.value = true
  try {
    sidequests.value = await api.get('/api/admin/sidequests')
  } finally {
    loading.value = false
  }
}

async function createSidequest(data) {
  const sidequest = await api.post('/api/admin/sidequests', data)
  sidequests.value.push(sidequest)
}

async function updateSidequest(id, data) {
  const updated = await api.put(`/api/admin/sidequests/${id}`, data)
  const idx = sidequests.value.findIndex((s) => s.id === id)
  if (idx !== -1) sidequests.value[idx] = updated
}

async function deleteSidequest(id) {
  await api.del(`/api/admin/sidequests/${id}`)
  sidequests.value = sidequests.value.filter((s) => s.id !== id)
}

export function useSidequests() {
  return { sidequests, loading, fetchSidequests, createSidequest, updateSidequest, deleteSidequest }
}
