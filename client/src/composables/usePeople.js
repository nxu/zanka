import { ref } from 'vue'
import { api } from '../api.js'

const people = ref([])
const loading = ref(false)

async function fetchPeople() {
  loading.value = true
  try {
    people.value = await api.get('/api/admin/people')
  } finally {
    loading.value = false
  }
}

async function createPerson(data) {
  const person = await api.post('/api/admin/people', data)
  people.value.push(person)
}

async function updatePerson(id, data) {
  const updated = await api.put(`/api/admin/people/${id}`, data)
  const idx = people.value.findIndex((p) => p.id === id)
  if (idx !== -1) people.value[idx] = updated
}

async function deletePerson(id) {
  await api.del(`/api/admin/people/${id}`)
  people.value = people.value.filter((p) => p.id !== id)
}

export function usePeople() {
  return { people, loading, fetchPeople, createPerson, updatePerson, deletePerson }
}
