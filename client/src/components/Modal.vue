<script setup>
import IconClose from './icons/IconClose.vue'

defineProps({ title: { type: String, required: true } })
defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div class="absolute inset-0 bg-sand-900/50" @click="$emit('close')"></div>

      <div
        class="modal-sheet relative max-h-[88vh] w-full overflow-y-auto rounded-t-card border-2 border-sand-900 bg-paper shadow-stamp dark:border-sand-50 dark:bg-paper-dark dark:shadow-stamp-dark sm:max-w-sm sm:rounded-card"
      >
        <div class="sticky top-0 flex items-center justify-between border-b-2 border-sand-900/10 bg-paper px-5 py-4 dark:border-sand-50/10 dark:bg-paper-dark">
          <h2 class="font-display text-lg uppercase tracking-wide text-sand-900 dark:text-sand-50">{{ title }}</h2>
          <button
            type="button"
            @click="$emit('close')"
            class="rounded-full p-1.5 text-sand-600 hover:text-sand-900 dark:text-sand-400 dark:hover:text-sand-50"
            aria-label="Bezárás"
          >
            <IconClose class="h-5 w-5" />
          </button>
        </div>

        <div class="p-5 pb-safe">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-sheet {
  animation: sheet-up 0.22s cubic-bezier(0.2, 0.9, 0.3, 1.1);
}

@media (min-width: 640px) {
  .modal-sheet {
    animation: sheet-scale 0.18s ease-out;
  }
}

@keyframes sheet-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes sheet-scale {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
