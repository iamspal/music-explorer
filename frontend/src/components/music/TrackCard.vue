<template>
  <div class="group flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer select-none" :class="trackCardClasses" @click="player.playTrack(track)">
    <!-- Index / Play button -->
    <div class="w-8 text-center shrink-0">
      <span
        v-if="!isCurrent"
        class="text-sm text-spotify-text-tertiary group-hover:hidden"
      >
        {{ showIndex !== null ? showIndex : '' }}
      </span>
      <button
        v-if="!isCurrent"
        class="hidden group-hover:inline-flex text-white cursor-pointer"
        @click.stop="player.playTrack(track)"
        :aria-label="t('music.playTrack')"
      >
        <i class="fas fa-play text-sm" aria-hidden="true"></i>
      </button>
      <button
        v-if="isCurrent"
        class="text-spotify-green cursor-pointer"
        @click.stop="player.togglePlay()"
        :aria-label="player.isPlaying ? t('common.pause') : t('common.play')"
      >
        <i :class="playIconClass" class="text-sm" aria-hidden="true"></i>
      </button>
    </div>

    <!-- Cover -->
    <img
      v-if="showCover"
      :src="track.album?.cover_small || track.album?.cover || DEFAULT_COVER"
      :alt="track.album?.title || ''"
      class="size-10 rounded object-cover shrink-0"
    />

    <!-- Info -->
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium truncate" :class="trackTitleClasses">
        {{ track.title }}
      </p>
      <p class="text-xs text-spotify-text-secondary truncate">
        {{ track.artist?.name || t('music.unknownArtist') }}
      </p>
    </div>

    <!-- Favorite -->
    <button class="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-sm cursor-pointer" :class="favoriteButtonClass" @click.stop="library.toggleFavorite(track.id)" :aria-label="library.isFavorite(track.id) ? t('music.removeFromFavorites') : t('music.addToFavorites')">
      <i :class="favoriteIconClass" aria-hidden="true"></i>
    </button>

    <!-- Duration -->
    <span class="text-xs text-spotify-text-secondary w-10 text-right shrink-0">
      {{ formatDuration(track.duration) }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { useLibraryStore } from '@/stores/useLibraryStore'
import { formatDuration } from '@/utils/format'
import { DEFAULT_COVER } from '@/utils/constants'

const { t } = useI18n()

const props = defineProps({
  track: { type: Object, required: true },
  showIndex: { type: Number, default: null },
  showCover: { type: Boolean, default: true },
})

const player = usePlayerStore()
const library = useLibraryStore()

const isCurrentTrack = () => player.currentTrack?.id === props.track.id

const isCurrent = computed(() => isCurrentTrack())

const trackCardClasses = computed(() =>
  isCurrent.value ? 'bg-spotify-green/10' : 'hover:bg-spotify-surface',
)

const trackTitleClasses = computed(() =>
  isCurrent.value ? 'text-spotify-green' : 'text-white',
)

const favoriteButtonClass = computed(() =>
  library.isFavorite(props.track.id)
    ? 'text-spotify-green opacity-100'
    : 'text-spotify-text-secondary hover:text-white',
)

const favoriteIconClass = computed(() =>
  library.isFavorite(props.track.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart',
)

const playIconClass = computed(() =>
  player.isPlaying ? 'fas fa-pause' : 'fas fa-play',
)
</script>
