<template>
  <RouterLink
    :to="`/artist/${artist.id}`"
    class="group flex-shrink-0 w-36 lg:w-40 p-3 rounded-xl bg-spotify-card hover:bg-spotify-surface transition-all duration-300 hover:scale-[1.02]"
  >
    <div class="mb-3">
      <img
        :src="artist.picture_medium || artist.picture || DEFAULT_COVER"
        :alt="artist.name"
        class="w-full aspect-square object-cover rounded-full shadow-lg"
      />
    </div>
    <p class="text-sm font-medium text-white truncate text-center">{{ artist.name }}</p>
    <p class="text-xs text-spotify-text-secondary truncate text-center mt-1">{{ t('artist.subtitle') }}</p>
  </RouterLink>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { DEFAULT_COVER } from '@/utils/constants'

const { t } = useI18n()

defineProps({
  artist: { type: Object, required: true },
})
</script>
