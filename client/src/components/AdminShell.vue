<script setup>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth.js'
import TeamsView from '../views/TeamsView.vue'
import PeopleView from '../views/PeopleView.vue'
import ScoresView from '../views/ScoresView.vue'
import TaskCardsView from '../views/TaskCardsView.vue'
import SidequestsView from '../views/SidequestsView.vue'
import IconPennant from './icons/IconPennant.vue'
import IconPerson from './icons/IconPerson.vue'
import IconTrophy from './icons/IconTrophy.vue'
import IconCard from './icons/IconCard.vue'
import IconCompass from './icons/IconCompass.vue'

const tab = ref('scores')
const { logout } = useAuth()
</script>

<template>
  <div class="flex min-h-screen flex-col pb-24">
    <header
      class="sticky top-0 z-10 flex items-center justify-between border-b-2 border-sand-900/10 bg-sand-50/90 px-5 py-4 backdrop-blur dark:border-sand-50/10 dark:bg-sand-950/90"
    >
      <h1 class="font-display text-xl uppercase tracking-wide text-sand-900 dark:text-sand-50">Zánka 2026</h1>
      <button
        @click="logout"
        class="text-sm font-semibold uppercase tracking-wide text-sand-600 hover:text-danger dark:text-sand-400 dark:hover:text-danger-dark"
      >
        Kijelentkezés
      </button>
    </header>

    <main class="mx-auto w-full max-w-2xl flex-1 px-4 py-5 sm:px-6">
      <ScoresView v-if="tab === 'scores'" />
      <TeamsView v-else-if="tab === 'teams'" />
      <PeopleView v-else-if="tab === 'people'" />
      <TaskCardsView v-else-if="tab === 'cards'" />
      <SidequestsView v-else />
    </main>

    <nav
      class="pb-safe fixed inset-x-0 bottom-0 z-10 flex justify-center border-t-2 border-dashed border-sand-900/25 bg-sand-50/95 pt-2 backdrop-blur dark:border-sand-50/25 dark:bg-sand-950/95"
    >
      <div class="flex w-full max-w-2xl gap-2 px-4">
        <button
          type="button"
          @click="tab = 'scores'"
          class="flex flex-1 flex-col items-center gap-1 rounded-2xl py-2 transition-colors"
          :class="tab === 'scores' ? 'bg-accent/15 text-accent dark:bg-accent-dark/20 dark:text-accent-dark' : 'text-sand-600 dark:text-sand-400'"
        >
          <IconTrophy class="h-6 w-6" />
          <span class="text-xs font-bold uppercase tracking-wide">Pontok</span>
        </button>
        <button
          type="button"
          @click="tab = 'teams'"
          class="flex flex-1 flex-col items-center gap-1 rounded-2xl py-2 transition-colors"
          :class="tab === 'teams' ? 'bg-accent/15 text-accent dark:bg-accent-dark/20 dark:text-accent-dark' : 'text-sand-600 dark:text-sand-400'"
        >
          <IconPennant class="h-6 w-6" />
          <span class="text-xs font-bold uppercase tracking-wide">Csapatok</span>
        </button>
        <button
          type="button"
          @click="tab = 'people'"
          class="flex flex-1 flex-col items-center gap-1 rounded-2xl py-2 transition-colors"
          :class="tab === 'people' ? 'bg-accent/15 text-accent dark:bg-accent-dark/20 dark:text-accent-dark' : 'text-sand-600 dark:text-sand-400'"
        >
          <IconPerson class="h-6 w-6" />
          <span class="text-xs font-bold uppercase tracking-wide">Játékosok</span>
        </button>
        <button
          type="button"
          @click="tab = 'cards'"
          class="flex flex-1 flex-col items-center gap-1 rounded-2xl py-2 transition-colors"
          :class="tab === 'cards' ? 'bg-accent/15 text-accent dark:bg-accent-dark/20 dark:text-accent-dark' : 'text-sand-600 dark:text-sand-400'"
        >
          <IconCard class="h-6 w-6" />
          <span class="text-xs font-bold uppercase tracking-wide">Kártyák</span>
        </button>
        <button
          type="button"
          @click="tab = 'sidequests'"
          class="flex flex-1 flex-col items-center gap-1 rounded-2xl py-2 transition-colors"
          :class="tab === 'sidequests' ? 'bg-accent/15 text-accent dark:bg-accent-dark/20 dark:text-accent-dark' : 'text-sand-600 dark:text-sand-400'"
        >
          <IconCompass class="h-6 w-6" />
          <span class="text-xs font-bold uppercase tracking-wide">Sidequestek</span>
        </button>
      </div>
    </nav>
  </div>
</template>
