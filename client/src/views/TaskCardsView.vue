<script setup>
import { ref, onMounted } from 'vue'
import { useTaskCards } from '../composables/useTaskCards.js'
import { printTaskCards } from '../printCards.js'
import Modal from '../components/Modal.vue'
import IconPlus from '../components/icons/IconPlus.vue'
import IconPencil from '../components/icons/IconPencil.vue'
import IconTrash from '../components/icons/IconTrash.vue'
import IconCheck from '../components/icons/IconCheck.vue'
import IconPrint from '../components/icons/IconPrint.vue'

const { cards, loading, fetchCards, createCard, updateCard, deleteCard } = useTaskCards()

const selectedIds = ref(new Set())

const showModal = ref(false)
const editingCard = ref(null)
const form = ref({ name: '', task: '', points: 0 })
const error = ref('')
const saving = ref(false)

onMounted(fetchCards)

function isSelected(id) {
  return selectedIds.value.has(id)
}

function toggleSelect(id) {
  if (selectedIds.value.has(id)) {
    selectedIds.value.delete(id)
  } else {
    selectedIds.value.add(id)
  }
}

function printSelected() {
  const selected = cards.value.filter((c) => selectedIds.value.has(c.id))
  if (!selected.length) return
  printTaskCards(selected)
}

function openCreate() {
  editingCard.value = null
  form.value = { name: '', task: '', points: 0 }
  error.value = ''
  showModal.value = true
}

function openEdit(card) {
  editingCard.value = card
  form.value = { name: card.name, task: card.task, points: card.points }
  error.value = ''
  showModal.value = true
}

async function save() {
  error.value = ''
  if (!Number.isInteger(form.value.points)) {
    error.value = 'A pontszámnak egész számnak kell lennie'
    return
  }
  saving.value = true
  try {
    if (editingCard.value) {
      await updateCard(editingCard.value.id, form.value)
    } else {
      await createCard(form.value)
    }
    showModal.value = false
  } catch (err) {
    error.value = err.message
  } finally {
    saving.value = false
  }
}

async function remove(card) {
  if (!window.confirm(`Biztosan törlöd a "${card.name}" feladatkártyát?`)) return
  await deleteCard(card.id)
  selectedIds.value.delete(card.id)
}
</script>

<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <h2 class="font-display text-2xl uppercase tracking-wide text-sand-900 dark:text-sand-50">Feladatkártyák</h2>
      <button
        type="button"
        @click="openCreate"
        class="flex items-center gap-1.5 rounded-full border-2 border-sand-900 bg-accent px-4 py-2 text-sm font-bold uppercase tracking-wide text-paper shadow-stamp-sm transition-transform duration-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none dark:border-sand-50 dark:bg-accent-dark dark:shadow-stamp-sm-dark"
      >
        <IconPlus class="h-4 w-4" /> Hozzáadás
      </button>
    </div>

    <button
      type="button"
      @click="printSelected"
      :disabled="!selectedIds.size"
      class="mb-4 flex w-full items-center justify-center gap-2 rounded-full border-2 border-sand-900/20 py-2.5 text-sm font-bold uppercase tracking-wide text-sand-700 disabled:opacity-40 dark:border-sand-50/20 dark:text-sand-300"
    >
      <IconPrint class="h-4 w-4" />
      Nyomtatás{{ selectedIds.size ? ` (${selectedIds.size})` : '' }}
    </button>

    <p v-if="loading" class="py-10 text-center text-sm text-sand-600 dark:text-sand-400">Betöltés…</p>
    <p v-else-if="!cards.length" class="py-10 text-center text-sm text-sand-600 dark:text-sand-400">
      Még nincs feladatkártya — adj hozzá egyet a kezdéshez.
    </p>

    <ul v-else class="space-y-2.5">
      <li
        v-for="card in cards"
        :key="card.id"
        class="flex items-center gap-3 rounded-2xl bg-paper px-4 py-3.5 shadow-sm ring-1 ring-sand-900/10 dark:bg-paper-dark dark:ring-sand-50/10"
      >
        <button type="button" @click="toggleSelect(card.id)" class="flex min-w-0 flex-1 items-center gap-3 text-left">
          <span
            class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-colors"
            :class="
              isSelected(card.id)
                ? 'border-accent bg-accent dark:border-accent-dark dark:bg-accent-dark'
                : 'border-sand-900/25 dark:border-sand-50/25'
            "
          >
            <IconCheck v-if="isSelected(card.id)" class="h-3.5 w-3.5 text-paper" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="truncate font-semibold text-sand-900 dark:text-sand-50">{{ card.name }}</p>
            <p class="line-clamp-2 text-sm text-sand-600 dark:text-sand-400">{{ card.task }}</p>
          </div>
        </button>
        <span class="shrink-0 font-mono text-sm font-bold text-sand-700 dark:text-sand-300">{{ card.points }} pont</span>
        <button
          type="button"
          @click="openEdit(card)"
          class="rounded-full p-2.5 text-sand-600 hover:bg-sand-900/5 hover:text-sand-900 dark:text-sand-400 dark:hover:bg-sand-50/10 dark:hover:text-sand-50"
          aria-label="Feladatkártya szerkesztése"
        >
          <IconPencil class="h-[18px] w-[18px]" />
        </button>
        <button
          type="button"
          @click="remove(card)"
          class="rounded-full p-2.5 text-sand-600 hover:bg-danger/10 hover:text-danger dark:text-sand-400 dark:hover:text-danger-dark"
          aria-label="Feladatkártya törlése"
        >
          <IconTrash class="h-[18px] w-[18px]" />
        </button>
      </li>
    </ul>

    <Modal
      v-if="showModal"
      :title="editingCard ? 'Feladatkártya szerkesztése' : 'Új feladatkártya'"
      @close="showModal = false"
    >
      <form @submit.prevent="save" class="space-y-5">
        <div>
          <label class="mb-1.5 block text-sm font-semibold text-sand-700 dark:text-sand-300">Név</label>
          <input
            v-model="form.name"
            type="text"
            required
            autofocus
            placeholder="pl. Vízbe ugrás"
            class="w-full rounded-xl border-2 border-sand-900/20 bg-sand-50 px-3.5 py-3 text-base text-sand-900 focus:border-accent focus:outline-none dark:border-sand-50/20 dark:bg-sand-950 dark:text-sand-50 dark:focus:border-accent-dark"
          />
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-semibold text-sand-700 dark:text-sand-300">Feladat</label>
          <textarea
            v-model="form.task"
            required
            rows="3"
            placeholder="pl. Mindenki ugorjon be a vízbe egyszerre."
            class="w-full resize-none rounded-xl border-2 border-sand-900/20 bg-sand-50 px-3.5 py-3 text-base text-sand-900 focus:border-accent focus:outline-none dark:border-sand-50/20 dark:bg-sand-950 dark:text-sand-50 dark:focus:border-accent-dark"
          ></textarea>
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-semibold text-sand-700 dark:text-sand-300">Pont</label>
          <input
            v-model.number="form.points"
            type="number"
            step="1"
            required
            class="w-full rounded-xl border-2 border-sand-900/20 bg-sand-50 px-3.5 py-3 text-base text-sand-900 focus:border-accent focus:outline-none dark:border-sand-50/20 dark:bg-sand-950 dark:text-sand-50 dark:focus:border-accent-dark"
          />
        </div>

        <p v-if="error" class="text-sm font-medium text-danger dark:text-danger-dark">{{ error }}</p>

        <button
          type="submit"
          :disabled="saving"
          class="w-full rounded-full border-2 border-sand-900 bg-accent py-3 font-display uppercase tracking-wide text-paper shadow-stamp-sm transition-transform duration-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-60 dark:border-sand-50 dark:bg-accent-dark dark:shadow-stamp-sm-dark"
        >
          {{ saving ? 'Mentés…' : 'Mentés' }}
        </button>
      </form>
    </Modal>
  </div>
</template>
