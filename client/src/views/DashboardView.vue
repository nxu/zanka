<script setup>
import { computed, onMounted } from 'vue'
import { useDashboard } from '../composables/useDashboard.js'
import { formatScore, formatDate } from '../format.js'
import IconCrown from '../components/icons/IconCrown.vue'
import IconDuckLaser from '../components/icons/IconDuckLaser.vue'

const { teams, topPeople, allPeople, latestEntries, loading, error, fetchDashboard } = useDashboard()

const isFaceOff = computed(() => teams.value.length === 2)
const isEmpty = computed(
  () => !loading.value && !teams.value.length && !allPeople.value.length && !latestEntries.value.length
)

const leadingTeamId = computed(() => {
  if (teams.value.length !== 2) return null
  const [first, second] = teams.value
  if (first.total === second.total) return null
  return first.total > second.total ? first.id : second.id
})

function medalClass(i) {
  return ['bg-sun', 'bg-silver', 'bg-bronze'][i] ?? 'bg-dusk/10'
}

const FACE_OFF_SCORE_SIZES = [
  'text-5xl sm:text-8xl xl:text-6xl',
  'text-4xl sm:text-7xl xl:text-5xl',
  'text-3xl sm:text-6xl xl:text-4xl',
  'text-2xl sm:text-5xl xl:text-3xl',
]
const LIST_SCORE_SIZES = ['text-3xl sm:text-5xl', 'text-2xl sm:text-4xl', 'text-xl sm:text-3xl']

function sizeForLength(sizes, length) {
  if (length <= 3) return sizes[0]
  const tier = Math.min(length - 3, sizes.length - 1)
  return sizes[tier]
}

function faceOffScoreClass(value) {
  return sizeForLength(FACE_OFF_SCORE_SIZES, formatScore(value).length)
}

function listScoreClass(value) {
  return sizeForLength(LIST_SCORE_SIZES, formatScore(value).length)
}

onMounted(() => {
  fetchDashboard()
  setInterval(() => window.location.reload(), 5 * 60 * 1000)
})
</script>

<template>
  <div class="dashboard-bg relative min-h-screen overflow-x-hidden font-festive text-dusk">
    <div class="pointer-events-none fixed inset-0 overflow-hidden">
      <div class="sunburst"></div>
    </div>

    <div class="relative z-10 mx-auto max-w-3xl px-4 py-10 sm:px-8 sm:py-14 xl:max-w-6xl">
      <header class="reveal mb-10 text-center" style="animation-delay: 0s">
        <IconDuckLaser class="mx-auto mb-2 h-20 w-20 -rotate-3 drop-shadow-lg sm:h-28 sm:w-28" />
        <h1 class="toon-text font-carnival text-4xl text-toon sm:text-6xl">Zánka 2026</h1>
      </header>

      <p v-if="loading" class="text-center text-lg font-bold text-dusk/80">Betöltés…</p>
      <p v-else-if="error" class="text-center text-lg font-bold text-dusk/80">
        Nem sikerült betölteni az adatokat. Újra próbáljuk 5 percen belül.
      </p>

      <template v-else-if="isEmpty">
        <p class="reveal text-center text-xl font-bold text-dusk" style="animation-delay: 0.1s">
          Hamarosan kezdődik a játék! 🎉
        </p>
      </template>

      <template v-else>
        <div class="mb-14 space-y-14 xl:grid xl:grid-cols-2 xl:items-center xl:gap-8 xl:space-y-0">
          <section v-if="teams.length" class="reveal" style="animation-delay: 0.1s">
            <div v-if="isFaceOff" class="relative grid grid-cols-2 gap-3 sm:gap-6">
              <div
                v-for="(team, i) in teams"
                :key="team.id"
                class="relative rounded-3xl border-4 border-dusk bg-island p-4 text-center shadow-toon sm:p-8"
                :class="i === 0 ? '-rotate-2' : 'rotate-2'"
              >
                <IconCrown
                  v-if="leadingTeamId === team.id"
                  class="absolute -top-6 left-1/2 h-9 w-9 -translate-x-1/2 text-sun drop-shadow sm:h-12 sm:w-12"
                />
                <span
                  class="mx-auto mb-2 block h-3.5 w-3.5 rounded-full sm:h-5 sm:w-5"
                  :style="{ backgroundColor: team.color }"
                ></span>
                <p class="truncate font-carnival text-base text-dusk sm:text-2xl">{{ team.name }}</p>
                <p class="mt-1 whitespace-nowrap font-carnival leading-none text-dusk" :class="faceOffScoreClass(team.total)">
                  {{ formatScore(team.total) }}
                </p>
              </div>
              <div
                class="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rotate-6 rounded-full border-4 border-dusk bg-island px-3 py-1.5 font-carnival text-sm text-dusk shadow-toon sm:px-5 sm:py-2.5 sm:text-xl"
              >
                VS
              </div>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="team in teams"
                :key="team.id"
                class="flex items-center gap-4 rounded-3xl border-4 border-dusk bg-island p-4 shadow-toon sm:p-6"
              >
                <span class="h-4 w-4 shrink-0 rounded-full sm:h-5 sm:w-5" :style="{ backgroundColor: team.color }"></span>
                <p class="flex-1 truncate font-carnival text-lg text-dusk sm:text-2xl">{{ team.name }}</p>
                <p class="whitespace-nowrap font-carnival text-dusk" :class="listScoreClass(team.total)">
                  {{ formatScore(team.total) }}
                </p>
              </div>
            </div>
          </section>

          <section v-if="allPeople.length" class="reveal" style="animation-delay: 0.3s">
            <h2 class="toon-text mb-4 text-center font-carnival text-2xl text-toon sm:text-3xl">Toplista</h2>

            <div class="space-y-3 xl:hidden">
              <div
                v-for="(person, i) in allPeople"
                :key="person.id"
                class="flex items-center gap-4 rounded-3xl border-4 border-dusk bg-island p-4 shadow-toon sm:p-5"
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
                <p class="whitespace-nowrap font-carnival text-dusk" :class="listScoreClass(person.total)">
                  {{ formatScore(person.total) }}
                </p>
              </div>
            </div>

            <div class="hidden space-y-3 xl:block">
              <div
                v-for="(person, i) in topPeople"
                :key="person.id"
                class="flex items-center gap-4 rounded-3xl border-4 border-dusk bg-island p-4 shadow-toon sm:p-5"
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
                <p class="whitespace-nowrap font-carnival text-dusk" :class="listScoreClass(person.total)">
                  {{ formatScore(person.total) }}
                </p>
              </div>
            </div>
          </section>
        </div>

        <section v-if="latestEntries.length" class="reveal xl:hidden" style="animation-delay: 0.5s">
          <h2 class="toon-text mb-4 text-center font-carnival text-2xl text-toon sm:text-3xl">Legutóbbi pontszámok</h2>
          <div class="space-y-3">
            <div
              v-for="entry in latestEntries"
              :key="entry.id"
              class="rounded-3xl border-4 border-dusk bg-island p-5 shadow-toon sm:p-7"
            >
              <p class="font-carnival text-xl text-dusk sm:text-2xl">{{ entry.title }}</p>
              <p class="mb-4 text-sm font-bold text-dusk/50">{{ formatDate(entry.created_at) }}</p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="p in entry.points"
                  :key="p.person_id"
                  class="inline-flex items-center gap-1.5 rounded-full bg-dusk/5 px-3 py-1.5 text-sm font-extrabold text-dusk"
                >
                  <span v-if="p.team_color" class="h-2 w-2 rounded-full" :style="{ backgroundColor: p.team_color }"></span>
                  {{ p.person_name }}: {{ formatScore(p.points) }}
                </span>
              </div>
            </div>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<style scoped>
.dashboard-bg {
  background: #ffb800;
}

/* Oversized so the square never exposes a gap at the viewport corners while
   it slowly rotates - a same-size layer would sweep its own corners outside
   the viewport and reveal bare background underneath. */
.sunburst {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200vmax;
  height: 200vmax;
  transform: translate(-50%, -50%) rotate(0deg);
  background: repeating-conic-gradient(from 0deg, #ffde59 0deg 9deg, #ffb800 9deg 18deg);
  animation: sunburst-spin 150s linear infinite;
}

@keyframes sunburst-spin {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.toon-text {
  text-shadow: 0.07em 0.07em 0 #2b1b4e;
  -webkit-text-stroke: 1px #000;
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
