<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTeams } from '../composables/useTeams.js'
import { usePeople } from '../composables/usePeople.js'
import Modal from '../components/Modal.vue'
import IconPlus from '../components/icons/IconPlus.vue'
import IconPencil from '../components/icons/IconPencil.vue'
import IconTrash from '../components/icons/IconTrash.vue'

const { teams, loading, fetchTeams, createTeam, updateTeam, deleteTeam } = useTeams()
const { people, fetchPeople } = usePeople()

const PALETTE = ['#E63946', '#F4A261', '#E9C46A', '#2A9D8F', '#457B9D', '#5E60CE', '#B5838D', '#2E2A22']

const showModal = ref(false)
const editingTeam = ref(null)
const form = ref({ name: '', color: PALETTE[0] })
const error = ref('')
const saving = ref(false)

const isCustomColor = computed(() => !PALETTE.includes(form.value.color))

onMounted(() => {
  fetchTeams()
  fetchPeople()
})

function memberCount(teamId) {
  return people.value.filter((p) => p.team_id === teamId).length
}

function openCreate() {
  editingTeam.value = null
  form.value = { name: '', color: PALETTE[0] }
  error.value = ''
  showModal.value = true
}

function openEdit(team) {
  editingTeam.value = team
  form.value = { name: team.name, color: team.color }
  error.value = ''
  showModal.value = true
}

async function save() {
  error.value = ''
  saving.value = true
  try {
    if (editingTeam.value) {
      await updateTeam(editingTeam.value.id, form.value)
      await fetchPeople()
    } else {
      await createTeam(form.value)
    }
    showModal.value = false
  } catch (err) {
    error.value = err.message
  } finally {
    saving.value = false
  }
}

async function remove(team) {
  const count = memberCount(team.id)
  const warning = count > 0 ? ` ${count} fő csapat nélkül marad.` : ''
  if (!window.confirm(`Biztosan törlöd a "${team.name}" csapatot?${warning}`)) return
  await deleteTeam(team.id)
  await fetchPeople()
}
</script>

<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <h2 class="font-display text-2xl uppercase tracking-wide text-sand-900 dark:text-sand-50">Csapatok</h2>
      <button
        type="button"
        @click="openCreate"
        class="flex items-center gap-1.5 rounded-full border-2 border-sand-900 bg-accent px-4 py-2 text-sm font-bold uppercase tracking-wide text-paper shadow-stamp-sm transition-transform duration-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none dark:border-sand-50 dark:bg-accent-dark dark:shadow-stamp-sm-dark"
      >
        <IconPlus class="h-4 w-4" /> Hozzáadás
      </button>
    </div>

    <p v-if="loading" class="py-10 text-center text-sm text-sand-600 dark:text-sand-400">Betöltés…</p>
    <p v-else-if="!teams.length" class="py-10 text-center text-sm text-sand-600 dark:text-sand-400">
      Még nincs csapat — adj hozzá egyet a kezdéshez.
    </p>

    <ul v-else class="space-y-2.5">
      <li
        v-for="team in teams"
        :key="team.id"
        class="flex items-center gap-3 rounded-2xl bg-paper px-4 py-3.5 shadow-sm ring-1 ring-sand-900/10 dark:bg-paper-dark dark:ring-sand-50/10"
      >
        <span class="h-5 w-5 shrink-0 rounded-full border-2 border-sand-900/20 dark:border-sand-50/20" :style="{ backgroundColor: team.color }"></span>
        <div class="min-w-0 flex-1">
          <p class="truncate font-semibold text-sand-900 dark:text-sand-50">{{ team.name }}</p>
          <p class="font-mono text-xs text-sand-600 dark:text-sand-400">{{ memberCount(team.id) }} fő</p>
        </div>
        <button
          type="button"
          @click="openEdit(team)"
          class="rounded-full p-2.5 text-sand-600 hover:bg-sand-900/5 hover:text-sand-900 dark:text-sand-400 dark:hover:bg-sand-50/10 dark:hover:text-sand-50"
          aria-label="Csapat szerkesztése"
        >
          <IconPencil class="h-[18px] w-[18px]" />
        </button>
        <button
          type="button"
          @click="remove(team)"
          class="rounded-full p-2.5 text-sand-600 hover:bg-danger/10 hover:text-danger dark:text-sand-400 dark:hover:text-danger-dark"
          aria-label="Csapat törlése"
        >
          <IconTrash class="h-[18px] w-[18px]" />
        </button>
      </li>
    </ul>

    <Modal v-if="showModal" :title="editingTeam ? 'Csapat szerkesztése' : 'Új csapat'" @close="showModal = false">
      <form @submit.prevent="save" class="space-y-5">
        <div>
          <label class="mb-1.5 block text-sm font-semibold text-sand-700 dark:text-sand-300">Név</label>
          <input
            v-model="form.name"
            type="text"
            required
            autofocus
            placeholder="pl. Cápák"
            class="w-full rounded-xl border-2 border-sand-900/20 bg-sand-50 px-3.5 py-3 text-base text-sand-900 focus:border-accent focus:outline-none dark:border-sand-50/20 dark:bg-sand-950 dark:text-sand-50 dark:focus:border-accent-dark"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-sand-700 dark:text-sand-300">Szín</label>
          <div class="flex flex-wrap gap-2.5">
            <button
              v-for="c in PALETTE"
              :key="c"
              type="button"
              @click="form.color = c"
              class="h-10 w-10 rounded-full ring-2 ring-offset-2 ring-offset-paper transition-shadow dark:ring-offset-paper-dark"
              :class="form.color === c ? 'ring-sand-900 dark:ring-sand-50' : 'ring-transparent'"
              :style="{ backgroundColor: c }"
              :aria-label="`Szín: ${c}`"
            ></button>
            <label
              class="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full ring-2 ring-offset-2 ring-offset-paper dark:ring-offset-paper-dark"
              :class="isCustomColor ? 'ring-sand-900 dark:ring-sand-50' : 'border-2 border-dashed border-sand-900/40 ring-transparent dark:border-sand-50/40'"
              :style="isCustomColor ? { backgroundColor: form.color } : {}"
            >
              <input v-model="form.color" type="color" class="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
              <span v-if="!isCustomColor" class="pointer-events-none text-sand-400 dark:text-sand-500">
                <IconPlus class="h-4 w-4" />
              </span>
            </label>
          </div>
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
