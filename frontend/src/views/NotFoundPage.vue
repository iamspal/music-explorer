<template>
  <div class="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
    <span class="text-7xl text-spotify-text-tertiary mb-6">
      <i class="fa-solid fa-circle-question"></i>
    </span>
    <h1 class="text-4xl font-bold text-white mb-4">{{ t('notFound.heading') }}</h1>
    <p class="text-spotify-text-secondary max-w-sm mb-8">
      {{ t('notFound.description') }}
    </p>
    <RouterLink to="/">
      <BaseButton rounded>
        <i class="fas fa-house text-xs"></i>
        {{ t('notFound.goHome') }}
      </BaseButton>
    </RouterLink>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/ui/BaseButton.vue'

const { t } = useI18n()
</script>
