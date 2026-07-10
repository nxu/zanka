<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePeople } from '../composables/usePeople.js'
import { useTeams } from '../composables/useTeams.js'
import Modal from '../components/Modal.vue'
import IconPlus from '../components/icons/IconPlus.vue'
import IconPencil from '../components/icons/IconPencil.vue'
import IconTrash from '../components/icons/IconTrash.vue'

const { people, loading, fetchPeople, createPerson, updatePerson, deletePerson } = usePeople()
const { teams, fetchTeams } = useTeams()

const showModal = ref(false)
const editingPerson = ref(null)
const form = ref({ name: '', team_id: '' })
const error = ref('')
const saving = ref(false)

onMounted(() => {
  fetchPeople()
  fetchTeams()
})

const groups = computed(() => {
  const byTeam = teams.value.map((team) => ({
    team,
    members: people.value.filter((p) => p.team_id === team.id),
  }))
  const unassigned = people.value.filter((p) => p.team_id === null)
  return unassigned.length ? [...byTeam, { team: null, members: unassigned }] : byTeam
})

function openCreate() {
  editingPerson.value = null
  form.value = { name: '', team_id: teams.value[0]?.id ?? '' }
  error.value = ''
  showModal.value = true
}

function openEdit(person) {
  editingPerson.value = person
  form.value = { name: person.name, team_id: person.team_id ?? '' }
  error.value = ''
  showModal.value = true
}

async function save() {
  error.value = ''
  saving.value = true
  try {
    const payload = {
      name: form.value.name,
      team_id: form.value.team_id === '' ? null : Number(form.value.team_id),
    }
    if (editingPerson.value) {
      await updatePerson(editingPerson.value.id, payload)
    } else {
      await createPerson(payload)
    }
    showModal.value = false
  } catch (err) {
    error.value = err.message
  } finally {
    saving.value = false
  }
}

async function remove(person) {
  if (!window.confirm(`Biztosan eltávolítod ${person.name} játékost?`)) return
  await deletePerson(person.id)
}
</script>

<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <h2 class="font-display text-2xl uppercase tracking-wide text-sand-900 dark:text-sand-50">Játékosok</h2>
      <button
        type="button"
        @click="openCreate"
        class="flex items-center gap-1.5 rounded-full border-2 border-sand-900 bg-accent px-4 py-2 text-sm font-bold uppercase tracking-wide text-paper shadow-stamp-sm transition-transform duration-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none dark:border-sand-50 dark:bg-accent-dark dark:shadow-stamp-sm-dark"
      >
        <IconPlus class="h-4 w-4" /> Hozzáadás
      </button>
    </div>

    <p v-if="loading" class="py-10 text-center text-sm text-sand-600 dark:text-sand-400">Betöltés…</p>
    <p v-else-if="!people.length" class="py-10 text-center text-sm text-sand-600 dark:text-sand-400">
      Még nincs játékos — adj hozzá egyet a kezdéshez.
    </p>

    <div v-else class="space-y-6">
      <div v-for="group in groups" :key="group.team?.id ?? 'unassigned'">
        <div class="mb-2 flex items-center gap-2 px-1">
          <span
            class="h-2.5 w-2.5 rounded-full"
            :style="{ backgroundColor: group.team ? group.team.color : '#9C8763' }"
          ></span>
          <h3 class="font-display text-sm uppercase tracking-widest text-sand-600 dark:text-sand-400">
            {{ group.team ? group.team.name : 'Csapat nélkül' }}
          </h3>
        </div>
        <ul class="space-y-2.5">
          <li
            v-for="person in group.members"
            :key="person.id"
            class="flex items-center gap-3 rounded-2xl bg-paper px-4 py-3.5 shadow-sm ring-1 ring-sand-900/10 dark:bg-paper-dark dark:ring-sand-50/10"
          >
            <span class="flex-1 truncate font-semibold text-sand-900 dark:text-sand-50">{{ person.name }}</span>
            <button
              type="button"
              @click="openEdit(person)"
              class="rounded-full p-2.5 text-sand-600 hover:bg-sand-900/5 hover:text-sand-900 dark:text-sand-400 dark:hover:bg-sand-50/10 dark:hover:text-sand-50"
              aria-label="Játékos szerkesztése"
            >
              <IconPencil class="h-[18px] w-[18px]" />
            </button>
            <button
              type="button"
              @click="remove(person)"
              class="rounded-full p-2.5 text-sand-600 hover:bg-danger/10 hover:text-danger dark:text-sand-400 dark:hover:text-danger-dark"
              aria-label="Játékos eltávolítása"
            >
              <IconTrash class="h-[18px] w-[18px]" />
            </button>
          </li>
        </ul>
      </div>
    </div>

    <Modal v-if="showModal" :title="editingPerson ? 'Játékos szerkesztése' : 'Új játékos'" @close="showModal = false">
      <form @submit.prevent="save" class="space-y-5">
        <div>
          <label class="mb-1.5 block text-sm font-semibold text-sand-700 dark:text-sand-300">Név</label>
          <input
            v-model="form.name"
            type="text"
            required
            autofocus
            placeholder="pl. Kata"
            class="w-full rounded-xl border-2 border-sand-900/20 bg-sand-50 px-3.5 py-3 text-base text-sand-900 focus:border-accent focus:outline-none dark:border-sand-50/20 dark:bg-sand-950 dark:text-sand-50 dark:focus:border-accent-dark"
          />
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-semibold text-sand-700 dark:text-sand-300">Csapat</label>
          <select
            v-model="form.team_id"
            class="w-full rounded-xl border-2 border-sand-900/20 bg-sand-50 px-3.5 py-3 text-base text-sand-900 focus:border-accent focus:outline-none dark:border-sand-50/20 dark:bg-sand-950 dark:text-sand-50 dark:focus:border-accent-dark"
          >
            <option value="">Nincs csapat</option>
            <option v-for="team in teams" :key="team.id" :value="team.id">{{ team.name }}</option>
          </select>
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
