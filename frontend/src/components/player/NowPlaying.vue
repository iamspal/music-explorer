<template>
  <div class="flex items-center gap-2 lg:gap-3 min-w-0">
    <template v-if="!currentTrack">
      <div class="size-10 lg:size-14 rounded-md bg-spotify-surface flex items-center justify-center shrink-0">
        <i class="fas fa-music text-spotify-text-secondary text-sm lg:text-lg" aria-hidden="true"></i>
      </div>
      <div class="min-w-0 hidden sm:block">
        <p class="text-xs lg:text-sm text-spotify-text-secondary">{{ t('player.noTrackPlaying') }}</p>
        <p class="text-[10px] lg:text-xs text-spotify-text-tertiary">{{ t('player.selectTrackToPlay') }}</p>
      </div>
    </template>

    <template v-else>
      <img
        :src="currentTrack.album?.cover_small || currentTrack.album?.cover || DEFAULT_COVER"
        :alt="currentTrack.title"
        class="size-10 lg:size-14 rounded-md object-cover shadow-lg shrink-0"
      />
      <div class="min-w-0">
        <p class="text-xs lg:text-sm font-medium text-white truncate">{{ currentTrack.title }}</p>
        <p class="text-[10px] lg:text-xs text-spotify-text-secondary truncate">
          {{ currentTrack.artist?.name || t('common.unknownArtist') }}
        </p>
      </div>
      <button
        class="shrink-0 text-xs lg:text-sm transition-colors hidden sm:block"
        :class="
          library.isFavorite(currentTrack.id)
            ? 'text-spotify-green'
            : 'text-spotify-text-secondary hover:text-white'
        "
        @click="library.toggleFavorite(currentTrack.id)"
        :aria-label="library.isFavorite(currentTrack.id) ? t('player.removeFromFavorites') : t('player.addToFavorites')"
      >
        <i
          :class="
            library.isFavorite(currentTrack.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'
          "
          aria-hidden="true"
        ></i>
      </button>
    </template>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { useLibraryStore } from '@/stores/useLibraryStore'
import { storeToRefs } from 'pinia'
import { DEFAULT_COVER } from '@/utils/constants'

const { t } = useI18n()
const player = usePlayerStore()
const library = useLibraryStore()
const { currentTrack } = storeToRefs(player)
</script>
