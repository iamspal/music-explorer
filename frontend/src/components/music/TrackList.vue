<template>
  <div>
    <!-- Table Header -->
    <div class="hidden sm:grid grid-cols-[40px_minmax(0,1fr)_auto_80px] gap-3 px-3 py-2 mb-1">
      <span class="text-xs font-medium text-spotify-text-secondary text-center">{{ t('music.numberSign') }}</span>
      <span class="text-xs font-medium text-spotify-text-secondary">{{ t('music.title') }}</span>
      <span class="text-xs font-medium text-spotify-text-secondary">
        <i class="fa-regular fa-heart" aria-hidden="true"></i>
      </span>
      <span class="text-xs font-medium text-spotify-text-secondary text-right">
        <i class="fa-regular fa-clock" aria-hidden="true"></i>
      </span>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="space-y-1">
      <div
        v-for="i in 8"
        :key="i"
        class="flex items-center gap-3 px-3 py-2"
      >
        <div class="w-8 h-4 rounded bg-spotify-surface animate-pulse"></div>
        <div class="size-10 rounded bg-spotify-surface animate-pulse shrink-0"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 w-2/3 rounded bg-spotify-surface animate-pulse"></div>
          <div class="h-3 w-1/3 rounded bg-spotify-surface animate-pulse"></div>
        </div>
        <div class="w-10 h-4 rounded bg-spotify-surface animate-pulse"></div>
      </div>
    </div>

    <!-- Empty -->
    <EmptyState
      v-else-if="tracks.length === 0"
      :icon="emptyIcon"
      :title="emptyTitle || t('music.noTracksFound')"
      :description="emptyDescription"
    />

    <!-- Track List -->
    <div v-else class="space-y-0.5">
      <TrackCard
        v-for="(track, index) in tracks"
        :key="track.id"
        :track="track"
        :show-index="index + 1"
        :show-cover="true"
      />
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import TrackCard from './TrackCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const { t } = useI18n()

defineProps({
  tracks: { type: Array, default: () => [] },
  isLoading: { type: Boolean, default: false },
  emptyIcon: { type: String, default: 'fa-solid fa-music' },
  emptyTitle: { type: String, default: '' },
  emptyDescription: { type: String, default: '' },
})
</script>
