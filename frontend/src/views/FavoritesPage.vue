<template>
  <div class="px-4 lg:px-6 py-4 lg:py-6 max-w-[2000px] mx-auto">
    <h1 class="text-2xl lg:text-3xl font-bold text-white mb-6">{{ t('favorites.pageTitle') }}</h1>

    <EmptyState
      v-if="!hasFavorites && !isLoading"
      icon="fa-regular fa-heart"
      :title="t('favorites.emptyTitle')"
      :description="t('favorites.emptyDescription')"
    />

    <TrackList
      v-else
      :tracks="favoriteTracks"
      :is-loading="isLoading"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { getTrack } from '@/api/resources'
import { useLibraryStore } from '@/stores/useLibraryStore'
import { storeToRefs } from 'pinia'
import TrackList from '@/components/music/TrackList.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const { t } = useI18n()
const library = useLibraryStore()
const { favoriteTrackIds } = storeToRefs(library)

const favoriteTracks = ref([])
const isLoading = ref(false)

const hasFavorites = computed(() => favoriteTrackIds.value.length > 0)

async function loadFavorites() {
  if (!hasFavorites.value) {
    favoriteTracks.value = []
    return
  }

  isLoading.value = true
  try {
    // Load tracks, filter out failures
    const results = await Promise.allSettled(
      favoriteTrackIds.value.map((id) => getTrack(id)),
    )
    const loaded = results
      .filter((r) => r.status === 'fulfilled')
      .map((r) => r.value)

    // Keep the original order
    const trackMap = new Map(loaded.map((t) => [t.id, t]))
    favoriteTracks.value = favoriteTrackIds.value
      .map((id) => trackMap.get(id))
      .filter(Boolean)
  } catch {
    favoriteTracks.value = []
  } finally {
    isLoading.value = false
  }
}

watch(favoriteTrackIds, loadFavorites, { deep: true, immediate: true })
</script>
