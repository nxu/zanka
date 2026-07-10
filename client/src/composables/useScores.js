import { ref } from 'vue'
import { api } from '../api.js'

const PAGE_SIZE = 20

const entries = ref([])
const total = ref(0)
const loading = ref(false)
const loadingMore = ref(false)

async function fetchEntries() {
  loading.value = true
  try {
    const data = await api.get(`/api/admin/scores?limit=${PAGE_SIZE}&offset=0`)
    entries.value = data.entries
    total.value = data.total
  } finally {
    loading.value = false
  }
}

async function fetchMoreEntries() {
  if (entries.value.length >= total.value) return
  loadingMore.value = true
  try {
    const data = await api.get(`/api/admin/scores?limit=${PAGE_SIZE}&offset=${entries.value.length}`)
    entries.value.push(...data.entries)
    total.value = data.total
  } finally {
    loadingMore.value = false
  }
}

async function createEntry(data) {
  const entry = await api.post('/api/admin/scores', data)
  entries.value.unshift(entry)
  total.value += 1
}

async function updateEntry(id, data) {
  const updated = await api.put(`/api/admin/scores/${id}`, data)
  const idx = entries.value.findIndex((e) => e.id === id)
  if (idx !== -1) entries.value[idx] = updated
}

async function deleteEntry(id) {
  await api.del(`/api/admin/scores/${id}`)
  entries.value = entries.value.filter((e) => e.id !== id)
  total.value -= 1
}

export function useScores() {
  return { entries, total, loading, loadingMore, fetchEntries, fetchMoreEntries, createEntry, updateEntry, deleteEntry }
}
