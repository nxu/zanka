import { ref } from 'vue'
import { api } from '../api.js'

const cards = ref([])
const loading = ref(false)

async function fetchCards() {
  loading.value = true
  try {
    cards.value = await api.get('/api/admin/task-cards')
  } finally {
    loading.value = false
  }
}

async function createCard(data) {
  const card = await api.post('/api/admin/task-cards', data)
  cards.value.push(card)
}

async function updateCard(id, data) {
  const updated = await api.put(`/api/admin/task-cards/${id}`, data)
  const idx = cards.value.findIndex((c) => c.id === id)
  if (idx !== -1) cards.value[idx] = updated
}

async function deleteCard(id) {
  await api.del(`/api/admin/task-cards/${id}`)
  cards.value = cards.value.filter((c) => c.id !== id)
}

export function useTaskCards() {
  return { cards, loading, fetchCards, createCard, updateCard, deleteCard }
}
