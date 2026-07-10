<script setup>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth.js'

const { login } = useAuth()
const password = ref('')
const showPassword = ref(false)
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await login(password.value)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center px-5">
    <div class="w-full max-w-sm">
      <div class="mb-8 flex flex-col items-center">
        <div
          class="mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-sand-900/40 dark:border-sand-50/40"
        >
          <span class="font-display text-3xl leading-none text-accent dark:text-accent-dark">Z</span>
        </div>
        <h1 class="font-display text-3xl uppercase tracking-wide text-sand-900 dark:text-sand-50">Zánka 2026</h1>
        <p class="mt-1 text-sm text-sand-600 dark:text-sand-400">Admin bejelentkezés</p>
      </div>

      <form
        @submit.prevent="submit"
        class="rounded-card border-2 border-sand-900 bg-paper p-5 shadow-stamp dark:border-sand-50 dark:bg-paper-dark dark:shadow-stamp-dark"
      >
        <label class="mb-1.5 block text-sm font-semibold text-sand-700 dark:text-sand-300">Jelszó</label>
        <div class="relative mb-4">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            required
            autofocus
            autocomplete="current-password"
            class="w-full rounded-xl border-2 border-sand-900/20 bg-sand-50 px-3.5 py-3 text-base text-sand-900 focus:border-accent focus:outline-none dark:border-sand-50/20 dark:bg-sand-950 dark:text-sand-50 dark:focus:border-accent-dark"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute inset-y-0 right-1 px-3 text-xs font-semibold uppercase tracking-wide text-sand-600 hover:text-sand-800 dark:text-sand-400 dark:hover:text-sand-100"
          >
            {{ showPassword ? 'Elrejt' : 'Mutat' }}
          </button>
        </div>

        <p v-if="error" class="mb-4 text-sm font-medium text-danger dark:text-danger-dark">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-full border-2 border-sand-900 bg-accent py-3 font-display uppercase tracking-wide text-paper shadow-stamp-sm transition-transform duration-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-60 dark:border-sand-50 dark:bg-accent-dark dark:shadow-stamp-sm-dark"
        >
          {{ loading ? 'Bejelentkezés…' : 'Bejelentkezés' }}
        </button>
      </form>
    </div>
  </div>
</template>
