<script setup>
import { ref, computed, onMounted } from 'vue'
import { useScores } from '../composables/useScores.js'
import { usePeople } from '../composables/usePeople.js'
import { useTeams } from '../composables/useTeams.js'
import { useStandings } from '../composables/useStandings.js'
import { formatScore, formatDate } from '../format.js'
import Modal from '../components/Modal.vue'
import IconPlus from '../components/icons/IconPlus.vue'
import IconPencil from '../components/icons/IconPencil.vue'
import IconTrash from '../components/icons/IconTrash.vue'
import IconCheck from '../components/icons/IconCheck.vue'

const { entries, total, loading, loadingMore, fetchEntries, fetchMoreEntries, createEntry, updateEntry, deleteEntry } =
  useScores()
const { people, fetchPeople } = usePeople()
const { teams, fetchTeams } = useTeams()
const { teams: standingTeams, fetchStandings } = useStandings()

const showModal = ref(false)
const editingEntry = ref(null)
const title = ref('')
const pointsMap = ref({})
const error = ref('')
const saving = ref(false)

onMounted(() => {
  fetchEntries()
  fetchPeople()
  fetchTeams()
  fetchStandings()
})

const sortedStandingTeams = computed(() => [...standingTeams.value].sort((a, b) => b.total - a.total))

const groups = computed(() => {
  const byTeam = teams.value.map((team) => ({
    team,
    members: people.value.filter((p) => p.team_id === team.id),
  }))
  const unassigned = people.value.filter((p) => p.team_id === null)
  return unassigned.length ? [...byTeam, { team: null, members: unassigned }] : byTeam
})

function toggle(personId) {
  if (pointsMap.value[personId] == null) {
    pointsMap.value[personId] = 0
  } else {
    delete pointsMap.value[personId]
  }
}

function openCreate() {
  editingEntry.value = null
  title.value = ''
  pointsMap.value = {}
  error.value = ''
  showModal.value = true
}

function openEdit(entry) {
  editingEntry.value = entry
  title.value = entry.title
  pointsMap.value = Object.fromEntries(entry.points.map((p) => [p.person_id, p.points]))
  error.value = ''
  showModal.value = true
}

async function save() {
  error.value = ''
  const points = Object.entries(pointsMap.value).map(([personId, pts]) => ({
    person_id: Number(personId),
    points: Number(pts),
  }))
  if (!points.length) {
    error.value = 'Válassz ki legalább egy játékost'
    return
  }
  if (points.some((p) => !Number.isFinite(p.points) || p.points < 0)) {
    error.value = 'Minden kiválasztott játékosnak érvényes, nem negatív pontszámot kell megadni'
    return
  }
  saving.value = true
  try {
    if (editingEntry.value) {
      await updateEntry(editingEntry.value.id, { title: title.value, points })
    } else {
      await createEntry({ title: title.value, points })
    }
    showModal.value = false
    await fetchStandings()
  } catch (err) {
    error.value = err.message
  } finally {
    saving.value = false
  }
}

async function remove(entry) {
  if (!window.confirm(`Biztosan törlöd a "${entry.title}" bejegyzést?`)) return
  await deleteEntry(entry.id)
  await fetchStandings()
}
</script>

<template>
  <div>
    <div v-if="sortedStandingTeams.length" class="mb-6 grid grid-cols-2 gap-3">
      <div
        v-for="team in sortedStandingTeams"
        :key="team.id"
        class="rounded-card border-2 border-sand-900 bg-paper p-4 text-center shadow-stamp-sm dark:border-sand-50 dark:bg-paper-dark dark:shadow-stamp-sm-dark"
      >
        <div class="mb-1 flex items-center justify-center gap-1.5">
          <span class="h-2.5 w-2.5 shrink-0 rounded-full" :style="{ backgroundColor: team.color }"></span>
          <p class="truncate text-xs font-bold uppercase tracking-wide text-sand-600 dark:text-sand-400">{{ team.name }}</p>
        </div>
        <p class="font-display text-3xl text-sand-900 dark:text-sand-50">{{ formatScore(team.total) }}</p>
      </div>
    </div>

    <div class="mb-4 flex items-center justify-between">
      <h2 class="font-display text-2xl uppercase tracking-wide text-sand-900 dark:text-sand-50">Pontszámok</h2>
      <button
        type="button"
        @click="openCreate"
        class="flex items-center gap-1.5 rounded-full border-2 border-sand-900 bg-accent px-4 py-2 text-sm font-bold uppercase tracking-wide text-paper shadow-stamp-sm transition-transform duration-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none dark:border-sand-50 dark:bg-accent-dark dark:shadow-stamp-sm-dark"
      >
        <IconPlus class="h-4 w-4" /> Hozzáadás
      </button>
    </div>

    <p v-if="loading" class="py-10 text-center text-sm text-sand-600 dark:text-sand-400">Betöltés…</p>
    <p v-else-if="!entries.length" class="py-10 text-center text-sm text-sand-600 dark:text-sand-400">
      Még nincs pontszám bejegyzés — adj hozzá egyet a kezdéshez.
    </p>

    <ul v-else class="space-y-2.5">
      <li
        v-for="entry in entries"
        :key="entry.id"
        class="rounded-2xl bg-paper px-4 py-3.5 shadow-sm ring-1 ring-sand-900/10 dark:bg-paper-dark dark:ring-sand-50/10"
      >
        <div class="flex items-start gap-2">
          <div class="min-w-0 flex-1">
            <p class="truncate font-semibold text-sand-900 dark:text-sand-50">{{ entry.title }}</p>
            <p class="font-mono text-xs text-sand-600 dark:text-sand-400">{{ formatDate(entry.created_at) }}</p>
          </div>
          <button
            type="button"
            @click="openEdit(entry)"
            class="rounded-full p-2.5 text-sand-600 hover:bg-sand-900/5 hover:text-sand-900 dark:text-sand-400 dark:hover:bg-sand-50/10 dark:hover:text-sand-50"
            aria-label="Bejegyzés szerkesztése"
          >
            <IconPencil class="h-[18px] w-[18px]" />
          </button>
          <button
            type="button"
            @click="remove(entry)"
            class="rounded-full p-2.5 text-sand-600 hover:bg-danger/10 hover:text-danger dark:text-sand-400 dark:hover:text-danger-dark"
            aria-label="Bejegyzés törlése"
          >
            <IconTrash class="h-[18px] w-[18px]" />
          </button>
        </div>
        <div class="mt-2.5 flex flex-wrap gap-1.5">
          <span
            v-for="p in entry.points"
            :key="p.person_id"
            class="inline-flex items-center gap-1.5 rounded-full bg-sand-100 px-2.5 py-1 text-xs font-medium text-sand-700 dark:bg-sand-900 dark:text-sand-300"
          >
            <span v-if="p.team_color" class="h-1.5 w-1.5 shrink-0 rounded-full" :style="{ backgroundColor: p.team_color }"></span>
            {{ p.person_name }}: <span class="font-mono">{{ formatScore(p.points) }}</span>
          </span>
        </div>
      </li>
    </ul>

    <button
      v-if="entries.length < total"
      type="button"
      @click="fetchMoreEntries"
      :disabled="loadingMore"
      class="mt-4 w-full rounded-full border-2 border-sand-900/20 py-2.5 text-sm font-bold uppercase tracking-wide text-sand-700 disabled:opacity-60 dark:border-sand-50/20 dark:text-sand-300"
    >
      {{ loadingMore ? 'Betöltés…' : `Több betöltése (${entries.length} / ${total})` }}
    </button>

    <Modal
      v-if="showModal"
      :title="editingEntry ? 'Bejegyzés szerkesztése' : 'Új pontszám bejegyzés'"
      @close="showModal = false"
    >
      <form @submit.prevent="save" class="space-y-5">
        <div>
          <label class="mb-1.5 block text-sm font-semibold text-sand-700 dark:text-sand-300">Cím</label>
          <input
            v-model="title"
            type="text"
            required
            autofocus
            placeholder="pl. Röplabda verseny"
            class="w-full rounded-xl border-2 border-sand-900/20 bg-sand-50 px-3.5 py-3 text-base text-sand-900 focus:border-accent focus:outline-none dark:border-sand-50/20 dark:bg-sand-950 dark:text-sand-50 dark:focus:border-accent-dark"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-sand-700 dark:text-sand-300">Játékosok és pontszámok</label>
          <div class="max-h-72 space-y-4 overflow-y-auto pr-1">
            <div v-for="group in groups" :key="group.team?.id ?? 'unassigned'">
              <h4 class="mb-1.5 px-1 text-xs font-bold uppercase tracking-widest text-sand-600 dark:text-sand-400">
                {{ group.team ? group.team.name : 'Csapat nélkül' }}
              </h4>
              <div class="space-y-1.5">
                <div
                  v-for="person in group.members"
                  :key="person.id"
                  class="flex items-center gap-3 rounded-xl bg-sand-50 px-3 py-2 dark:bg-sand-950"
                >
                  <button type="button" @click="toggle(person.id)" class="flex flex-1 items-center gap-2.5 text-left">
                    <span
                      class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-colors"
                      :class="
                        pointsMap[person.id] != null
                          ? 'border-accent bg-accent dark:border-accent-dark dark:bg-accent-dark'
                          : 'border-sand-900/25 dark:border-sand-50/25'
                      "
                    >
                      <IconCheck v-if="pointsMap[person.id] != null" class="h-3.5 w-3.5 text-paper" />
                    </span>
                    <span class="truncate text-sm font-medium text-sand-900 dark:text-sand-50">{{ person.name }}</span>
                  </button>
                  <input
                    v-if="pointsMap[person.id] != null"
                    v-model.number="pointsMap[person.id]"
                    type="number"
                    min="0"
                    class="w-16 rounded-lg border-2 border-sand-900/20 bg-paper px-2 py-1 text-right text-sm text-sand-900 focus:border-accent focus:outline-none dark:border-sand-50/20 dark:bg-paper-dark dark:text-sand-50"
                    @click.stop
                  />
                </div>
              </div>
            </div>
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
