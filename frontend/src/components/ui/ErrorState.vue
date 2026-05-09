<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
    <span class="text-5xl text-red-500 mb-4">
      <i class="fa-solid fa-circle-exclamation"></i>
    </span>
    <h3 class="text-lg font-semibold text-white mb-2">{{ t('ui.errorHeading') }}</h3>
    <p class="text-sm text-spotify-text-secondary max-w-sm mb-6">{{ message || t('ui.errorDefault') }}</p>
    <button
      class="px-6 py-2 bg-white text-black rounded-full font-semibold text-sm hover:scale-105 transition-transform"
      @click="emit('retry')"
    >
      {{ t('ui.tryAgain') }}
    </button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  message: { type: String, default: '' },
})

const emit = defineEmits(['retry'])
</script>
