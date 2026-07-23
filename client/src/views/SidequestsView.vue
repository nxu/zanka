<script setup>
import { ref, onMounted } from 'vue'
import { useSidequests } from '../composables/useSidequests.js'
import { openSidequestWheel } from '../sidequestWheel.js'
import Modal from '../components/Modal.vue'
import IconPlus from '../components/icons/IconPlus.vue'
import IconPencil from '../components/icons/IconPencil.vue'
import IconTrash from '../components/icons/IconTrash.vue'
import IconEye from '../components/icons/IconEye.vue'
import IconEyeOff from '../components/icons/IconEyeOff.vue'

const CATEGORIES = ['Nem strand', 'Strand']

const { sidequests, loading, fetchSidequests, createSidequest, updateSidequest, deleteSidequest } = useSidequests()

const FILTERS = ['Összes', 'Strand', 'Nem strand']

const showModal = ref(false)
const editingSidequest = ref(null)
const form = ref({ title: '', category: CATEGORIES[0], text: '', is_hidden: false })
const error = ref('')
const saving = ref(false)

onMounted(fetchSidequests)

function openCreate() {
  editingSidequest.value = null
  form.value = { title: '', category: CATEGORIES[0], text: '', is_hidden: false }
  error.value = ''
  showModal.value = true
}

function openEdit(sidequest) {
  editingSidequest.value = sidequest
  form.value = {
    title: sidequest.title,
    category: sidequest.category,
    text: sidequest.text,
    is_hidden: sidequest.is_hidden,
  }
  error.value = ''
  showModal.value = true
}

async function save() {
  error.value = ''
  saving.value = true
  try {
    if (editingSidequest.value) {
      await updateSidequest(editingSidequest.value.id, form.value)
    } else {
      await createSidequest(form.value)
    }
    showModal.value = false
  } catch (err) {
    error.value = err.message
  } finally {
    saving.value = false
  }
}

async function toggleHidden(sidequest) {
  await updateSidequest(sidequest.id, {
    title: sidequest.title,
    category: sidequest.category,
    text: sidequest.text,
    is_hidden: !sidequest.is_hidden,
  })
}

async function remove(sidequest) {
  if (!window.confirm(`Biztosan törlöd a "${sidequest.title}" sidequestet?`)) return
  await deleteSidequest(sidequest.id)
}
</script>

<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <h2 class="font-display text-2xl uppercase tracking-wide text-sand-900 dark:text-sand-50">Sidequestek</h2>
      <button
        type="button"
        @click="openCreate"
        class="flex items-center gap-1.5 rounded-full border-2 border-sand-900 bg-accent px-4 py-2 text-sm font-bold uppercase tracking-wide text-paper shadow-stamp-sm transition-transform duration-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none dark:border-sand-50 dark:bg-accent-dark dark:shadow-stamp-sm-dark"
      >
        <IconPlus class="h-4 w-4" /> Hozzáadás
      </button>
    </div>

    <div class="mb-4 flex gap-2">
      <button
        v-for="f in FILTERS"
        :key="f"
        type="button"
        @click="openSidequestWheel(sidequests, f)"
        class="flex-1 rounded-full border-2 border-sand-900/20 py-2 text-sm font-bold uppercase tracking-wide text-sand-600 transition-transform duration-100 active:translate-x-[2px] active:translate-y-[2px] dark:border-sand-50/20 dark:text-sand-400"
      >
        {{ f }}
      </button>
    </div>

    <p v-if="loading" class="py-10 text-center text-sm text-sand-600 dark:text-sand-400">Betöltés…</p>
    <p v-else-if="!sidequests.length" class="py-10 text-center text-sm text-sand-600 dark:text-sand-400">
      Még nincs sidequest — adj hozzá egyet a kezdéshez.
    </p>

    <ul v-else class="space-y-2.5">
      <li
        v-for="sidequest in sidequests"
        :key="sidequest.id"
        class="flex items-start gap-3 rounded-2xl bg-paper px-4 py-3.5 shadow-sm ring-1 ring-sand-900/10 dark:bg-paper-dark dark:ring-sand-50/10"
        :class="{ 'opacity-50': sidequest.is_hidden }"
      >
        <div class="min-w-0 flex-1">
          <p class="font-mono text-xs font-semibold uppercase tracking-wide text-sand-500 dark:text-sand-500">
            #{{ sidequest.id }}
          </p>
          <p class="truncate font-semibold text-sand-900 dark:text-sand-50">{{ sidequest.title }}</p>
          <p class="line-clamp-2 text-sm text-sand-600 dark:text-sand-400">{{ sidequest.text }}</p>
          <div class="mt-1.5 flex items-center gap-2">
            <span
              class="rounded-full bg-sand-900/5 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-sand-700 dark:bg-sand-50/10 dark:text-sand-300"
            >
              {{ sidequest.category }}
            </span>
            <span
              v-if="sidequest.is_hidden"
              class="rounded-full bg-danger/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-danger dark:bg-danger-dark/10 dark:text-danger-dark"
            >
              Elrejtve
            </span>
          </div>
        </div>
        <button
          type="button"
          @click="toggleHidden(sidequest)"
          class="shrink-0 rounded-full p-2.5 text-sand-600 hover:bg-sand-900/5 hover:text-sand-900 dark:text-sand-400 dark:hover:bg-sand-50/10 dark:hover:text-sand-50"
          :aria-label="sidequest.is_hidden ? 'Sidequest megjelenítése' : 'Sidequest elrejtése'"
        >
          <IconEyeOff v-if="sidequest.is_hidden" class="h-[18px] w-[18px]" />
          <IconEye v-else class="h-[18px] w-[18px]" />
        </button>
        <button
          type="button"
          @click="openEdit(sidequest)"
          class="shrink-0 rounded-full p-2.5 text-sand-600 hover:bg-sand-900/5 hover:text-sand-900 dark:text-sand-400 dark:hover:bg-sand-50/10 dark:hover:text-sand-50"
          aria-label="Sidequest szerkesztése"
        >
          <IconPencil class="h-[18px] w-[18px]" />
        </button>
        <button
          type="button"
          @click="remove(sidequest)"
          class="shrink-0 rounded-full p-2.5 text-sand-600 hover:bg-danger/10 hover:text-danger dark:text-sand-400 dark:hover:text-danger-dark"
          aria-label="Sidequest törlése"
        >
          <IconTrash class="h-[18px] w-[18px]" />
        </button>
      </li>
    </ul>

    <Modal
      v-if="showModal"
      :title="editingSidequest ? 'Sidequest szerkesztése' : 'Új sidequest'"
      @close="showModal = false"
    >
      <form @submit.prevent="save" class="space-y-5">
        <div>
          <label class="mb-1.5 block text-sm font-semibold text-sand-700 dark:text-sand-300">Cím</label>
          <input
            v-model="form.title"
            type="text"
            required
            autofocus
            placeholder="pl. Kincsvadászat"
            class="w-full rounded-xl border-2 border-sand-900/20 bg-sand-50 px-3.5 py-3 text-base text-sand-900 focus:border-accent focus:outline-none dark:border-sand-50/20 dark:bg-sand-950 dark:text-sand-50 dark:focus:border-accent-dark"
          />
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-semibold text-sand-700 dark:text-sand-300">Kategória</label>
          <select
            v-model="form.category"
            required
            class="w-full rounded-xl border-2 border-sand-900/20 bg-sand-50 px-3.5 py-3 text-base text-sand-900 focus:border-accent focus:outline-none dark:border-sand-50/20 dark:bg-sand-950 dark:text-sand-50 dark:focus:border-accent-dark"
          >
            <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-semibold text-sand-700 dark:text-sand-300">Szöveg</label>
          <textarea
            v-model="form.text"
            required
            rows="4"
            placeholder="pl. Keressetek meg 5 kagylót a parton."
            class="w-full resize-none rounded-xl border-2 border-sand-900/20 bg-sand-50 px-3.5 py-3 text-base text-sand-900 focus:border-accent focus:outline-none dark:border-sand-50/20 dark:bg-sand-950 dark:text-sand-50 dark:focus:border-accent-dark"
          ></textarea>
        </div>

        <label class="flex items-center gap-2.5 text-sm font-semibold text-sand-700 dark:text-sand-300">
          <input
            v-model="form.is_hidden"
            type="checkbox"
            class="h-5 w-5 rounded-lg border-2 border-sand-900/20 text-accent focus:ring-accent dark:border-sand-50/20 dark:bg-sand-950"
          />
          Elrejtve
        </label>

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
