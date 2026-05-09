<template>
  <RouterLink
    :to="`/playlist/${playlist.id}`"
    class="group flex-shrink-0 w-40 lg:w-44 p-3 rounded-xl bg-spotify-card hover:bg-spotify-surface transition-all duration-300 hover:scale-[1.02]"
  >
    <div class="relative mb-3">
      <img
        :src="playlist.picture_medium || playlist.picture || DEFAULT_COVER"
        :alt="playlist.title"
        class="w-full aspect-square object-cover rounded-lg shadow-lg"
      />
      <button
        class="absolute right-2 bottom-2 size-10 bg-spotify-green rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
        :aria-label="t('music.playPlaylist')"
      >
        <i class="fas fa-play text-black text-sm ml-0.5" aria-hidden="true"></i>
      </button>
    </div>
    <p class="text-sm font-medium text-white truncate">{{ playlist.title }}</p>
    <p class="text-xs text-spotify-text-secondary truncate mt-1">
      {{ t('music.nTracks', { n: playlist.nb_tracks || 0 }) }}
    </p>
  </RouterLink>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { DEFAULT_COVER } from '@/utils/constants'

const { t } = useI18n()

defineProps({
  playlist: { type: Object, required: true },
})
</script>
