<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
    <span class="text-5xl text-spotify-text-tertiary mb-4">
      <i :class="icon"></i>
    </span>
    <h3 class="text-lg font-semibold text-white mb-2">{{ title || t('ui.emptyTitle') }}</h3>
    <p v-if="description" class="text-sm text-spotify-text-secondary max-w-sm">{{ description }}</p>
    <slot />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  icon: { type: String, default: 'fa-solid fa-music' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
})
</script>
