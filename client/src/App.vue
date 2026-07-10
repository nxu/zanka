<script setup>
import { ref, onMounted } from 'vue'

const items = ref([])
const newItem = ref('')
const loading = ref(false)

async function fetchItems() {
  const res = await fetch('/api/items')
  items.value = await res.json()
}

async function addItem() {
  if (!newItem.value.trim()) return
  loading.value = true
  try {
    await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newItem.value.trim() }),
    })
    newItem.value = ''
    await fetchItems()
  } finally {
    loading.value = false
  }
}

async function removeItem(id) {
  await fetch(`/api/items/${id}`, { method: 'DELETE' })
  await fetchItems()
}

onMounted(fetchItems)
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-4">
    <div class="w-full max-w-md bg-white rounded-lg shadow p-6">
      <h1 class="text-2xl font-semibold text-gray-900 mb-4">Zanka</h1>

      <form @submit.prevent="addItem" class="flex gap-2 mb-6">
        <input
          v-model="newItem"
          type="text"
          placeholder="Add an item"
          class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          :disabled="loading"
          class="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          Add
        </button>
      </form>

      <ul class="divide-y divide-gray-100">
        <li v-for="item in items" :key="item.id" class="flex items-center justify-between py-2">
          <span class="text-sm text-gray-800">{{ item.name }}</span>
          <button @click="removeItem(item.id)" class="text-gray-400 hover:text-red-500 text-sm">
            Remove
          </button>
        </li>
      </ul>

      <p v-if="!items.length" class="text-sm text-gray-400 text-center py-4">No items yet.</p>
    </div>
  </div>
</template>
