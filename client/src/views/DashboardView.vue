<script setup>
import { computed, onMounted } from 'vue'
import { useDashboard } from '../composables/useDashboard.js'
import { formatScore, formatDate } from '../format.js'
import IconCrown from '../components/icons/IconCrown.vue'

const { teams, topPeople, latestEntry, loading, error, fetchDashboard } = useDashboard()

const CONFETTI = [
  { top: '6%', left: '10%', size: 10, color: '#FFD23F', opacity: 0.55 },
  { top: '14%', left: '85%', size: 16, color: '#FF7A3D', opacity: 0.45 },
  { top: '28%', left: '5%', size: 8, color: '#C6247B', opacity: 0.4 },
  { top: '38%', left: '92%', size: 12, color: '#FFD23F', opacity: 0.4 },
  { top: '55%', left: '8%', size: 14, color: '#FF7A3D', opacity: 0.35 },
  { top: '68%', left: '90%', size: 9, color: '#FFD23F', opacity: 0.5 },
  { top: '80%', left: '15%', size: 11, color: '#C6247B', opacity: 0.35 },
  { top: '90%', left: '80%', size: 13, color: '#FF7A3D', opacity: 0.4 },
]

const isFaceOff = computed(() => teams.value.length === 2)
const isEmpty = computed(
  () => !loading.value && !teams.value.length && !topPeople.value.length && !latestEntry.value
)

const leadingTeamId = computed(() => {
  if (teams.value.length !== 2) return null
  const [first, second] = teams.value
  if (first.total === second.total) return null
  return first.total > second.total ? first.id : second.id
})

function medalClass(i) {
  return ['bg-sun', 'bg-silver', 'bg-bronze'][i]
}

onMounted(() => {
  fetchDashboard()
  setInterval(() => window.location.reload(), 5 * 60 * 1000)
})
</script>

<template>
  <div class="dashboard-bg relative min-h-screen overflow-x-hidden font-festive text-dusk">
    <div class="pointer-events-none fixed inset-0 overflow-hidden">
      <div class="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-sun opacity-30 blur-3xl sm:h-96 sm:w-96"></div>
      <div class="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-magenta opacity-25 blur-3xl"></div>
      <span
        v-for="(dot, i) in CONFETTI"
        :key="i"
        class="absolute rounded-full"
        :style="{
          top: dot.top,
          left: dot.left,
          width: dot.size + 'px',
          height: dot.size + 'px',
          backgroundColor: dot.color,
          opacity: dot.opacity,
        }"
      ></span>
    </div>

    <div class="relative z-10 mx-auto max-w-3xl px-4 py-10 sm:px-8 sm:py-14">
      <header class="reveal mb-10 text-center" style="animation-delay: 0s">
        <p class="font-carnival text-sm uppercase tracking-[0.25em] text-sun drop-shadow-sm sm:text-base">
          Zánka 2026
        </p>
        <h1 class="font-carnival text-4xl text-white drop-shadow-lg sm:text-6xl">Az állás</h1>
      </header>

      <p v-if="loading" class="text-center text-lg font-bold text-white/90">Betöltés…</p>
      <p v-else-if="error" class="text-center text-lg font-bold text-white/90">
        Nem sikerült betölteni az adatokat. Újra próbáljuk 5 percen belül.
      </p>

      <template v-else-if="isEmpty">
        <p class="reveal text-center text-xl font-bold text-white drop-shadow" style="animation-delay: 0.1s">
          Hamarosan kezdődik a játék! 🎉
        </p>
      </template>

      <template v-else>
        <section v-if="teams.length" class="reveal mb-14" style="animation-delay: 0.1s">
          <div v-if="isFaceOff" class="relative grid grid-cols-2 gap-3 sm:gap-6">
            <div
              v-for="(team, i) in teams"
              :key="team.id"
              class="relative rounded-3xl bg-island p-4 text-center shadow-2xl sm:p-8"
              :class="i === 0 ? '-rotate-2' : 'rotate-2'"
            >
              <IconCrown
                v-if="leadingTeamId === team.id"
                class="absolute -top-5 left-1/2 h-9 w-9 -translate-x-1/2 text-sun drop-shadow sm:h-12 sm:w-12"
              />
              <span
                class="mx-auto mb-2 block h-3.5 w-3.5 rounded-full sm:h-5 sm:w-5"
                :style="{ backgroundColor: team.color }"
              ></span>
              <p class="truncate font-carnival text-base text-dusk sm:text-2xl">{{ team.name }}</p>
              <p class="mt-1 font-carnival text-5xl leading-none text-dusk sm:text-8xl">
                {{ formatScore(team.total) }}
              </p>
            </div>
            <div
              class="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sunset px-3 py-1.5 font-carnival text-sm text-white shadow-lg ring-4 ring-island sm:px-5 sm:py-2.5 sm:text-xl"
            >
              VS
            </div>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="team in teams"
              :key="team.id"
              class="flex items-center gap-4 rounded-3xl bg-island p-4 shadow-2xl sm:p-6"
            >
              <span class="h-4 w-4 shrink-0 rounded-full sm:h-5 sm:w-5" :style="{ backgroundColor: team.color }"></span>
              <p class="flex-1 truncate font-carnival text-lg text-dusk sm:text-2xl">{{ team.name }}</p>
              <p class="font-carnival text-3xl text-dusk sm:text-5xl">{{ formatScore(team.total) }}</p>
            </div>
          </div>
        </section>

        <section v-if="topPeople.length" class="reveal mb-14" style="animation-delay: 0.3s">
          <h2 class="mb-4 text-center font-carnival text-2xl text-white drop-shadow sm:text-3xl">
            Legjobb 3 játékos
          </h2>
          <div class="space-y-3">
            <div
              v-for="(person, i) in topPeople"
              :key="person.id"
              class="flex items-center gap-4 rounded-3xl bg-island p-4 shadow-2xl sm:p-5"
            >
              <span
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-carnival text-lg text-dusk sm:h-12 sm:w-12 sm:text-xl"
                :class="medalClass(i)"
              >
                {{ i + 1 }}
              </span>
              <span
                v-if="person.team_color"
                class="h-3 w-3 shrink-0 rounded-full sm:h-3.5 sm:w-3.5"
                :style="{ backgroundColor: person.team_color }"
              ></span>
              <p class="flex-1 truncate text-lg font-extrabold text-dusk sm:text-xl">{{ person.name }}</p>
              <p class="font-carnival text-2xl text-dusk sm:text-3xl">{{ formatScore(person.total) }}</p>
            </div>
          </div>
        </section>

        <section v-if="latestEntry" class="reveal" style="animation-delay: 0.5s">
          <h2 class="mb-4 text-center font-carnival text-2xl text-white drop-shadow sm:text-3xl">
            Legutóbbi pontszám
          </h2>
          <div class="rounded-3xl bg-island p-5 shadow-2xl sm:p-7">
            <p class="font-carnival text-xl text-dusk sm:text-2xl">{{ latestEntry.title }}</p>
            <p class="mb-4 text-sm font-bold text-dusk/50">{{ formatDate(latestEntry.created_at) }}</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="p in latestEntry.points"
                :key="p.person_id"
                class="inline-flex items-center gap-1.5 rounded-full bg-dusk/5 px-3 py-1.5 text-sm font-extrabold text-dusk"
              >
                <span v-if="p.team_color" class="h-2 w-2 rounded-full" :style="{ backgroundColor: p.team_color }"></span>
                {{ p.person_name }}: {{ formatScore(p.points) }}
              </span>
            </div>
          </div>
        </section>
      </template>

      <footer class="mt-14 text-center text-sm font-bold text-white/70">
        Automatikusan frissül 5 percenként
      </footer>
    </div>
  </div>
</template>

<style scoped>
.dashboard-bg {
  background: linear-gradient(135deg, #2b1b4e, #c6247b, #ff7a3d);
  background-size: 200% 200%;
  animation: drift 18s ease-in-out infinite alternate;
}

@keyframes drift {
  from {
    background-position: 0% 50%;
  }
  to {
    background-position: 100% 50%;
  }
}

.reveal {
  animation: rise 0.6s ease-out both;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
