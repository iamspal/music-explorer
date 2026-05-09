<template>
  <div>
    <!-- Error -->
    <ErrorState v-if="error" :message="error" @retry="load" />

    <template v-else>
      <!-- Hero skeleton -->
      <LoadingSkeleton v-if="isLoading" :count="1" type="hero" />

      <!-- Hero -->
      <div
        v-else
        class="relative overflow-hidden p-6 lg:p-10 pb-8"
        :style="{
          background: `linear-gradient(180deg, rgba(30,215,96,0.2) 0%, #121212 100%)`,
        }"
      >
        <div class="flex flex-col sm:flex-row items-center sm:items-end gap-6">
          <img
            :src="playlist?.picture_medium || playlist?.picture_big || DEFAULT_COVER"
            :alt="playlist?.title"
            class="size-48 lg:size-56 rounded-xl shadow-2xl object-cover shrink-0"
          />
          <div class="min-w-0 text-center sm:text-left">
            <p class="text-xs font-bold text-white uppercase tracking-wider mb-2">{{ t('playlist.label') }}</p>
            <h1 class="text-3xl lg:text-5xl font-bold text-white mb-3 truncate">
              {{ playlist?.title }}
            </h1>
            <p class="text-sm text-spotify-text-secondary mb-4">
              {{ playlist?.description || '' }}
            </p>
            <div class="flex items-center justify-center sm:justify-start gap-2 text-sm text-spotify-text-secondary">
              <span class="text-white font-medium">{{ playlist?.creator?.name || playlist?.user?.name || t('common.musicExplorer') }}</span>
              <span>&middot;</span>
              <span>{{ t('common.nSongs', { n: formatNumber(playlist?.nb_tracks || tracks.length) }) }}</span>
              <span v-if="tracks.length > 0">&middot;</span>
              <span v-if="tracks.length > 0">{{ formatAlbumDuration(tracks) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Controls -->
      <div class="px-4 lg:px-10 py-4 flex items-center gap-4">
        <button
          class="size-14 bg-spotify-green rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
          @click="playAll"
          :aria-label="t('playlist.playAll')"
        >
          <i class="fas fa-play text-black text-xl ml-0.5" aria-hidden="true"></i>
        </button>
        <span v-if="!isLoading && tracks.length > 0" class="text-sm text-spotify-text-secondary">
          {{ t('playlist.nTracks', { n: formatNumber(tracks.length) }) }}
        </span>
      </div>

      <!-- Track List -->
      <div class="px-2 lg:px-8 pb-20">
        <TrackList :tracks="tracks" :is-loading="isLoading" />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { getPlaylist, getPlaylistTracks } from '@/api/resources'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { formatNumber, formatAlbumDuration, unwrapTrack } from '@/utils/format'
import { DEFAULT_COVER } from '@/utils/constants'
import TrackList from '@/components/music/TrackList.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton.vue'

const { t } = useI18n()

const props = defineProps({
  id: { type: String, required: true },
})

const player = usePlayerStore()

const playlist = ref(null)
const tracks = ref([])
const isLoading = ref(true)
const error = ref(null)

async function load() {
  isLoading.value = true
  error.value = null
  try {
    const [pData, tData] = await Promise.all([getPlaylist(props.id), getPlaylistTracks(props.id, 100)])
    playlist.value = pData
    // Normalize tracks: Deezer wraps in {track: ...}
    const rawTracks = tData?.data || []
    tracks.value = rawTracks.map(unwrapTrack).filter(Boolean)
  } catch (e) {
    error.value = e.message
  } finally {
    isLoading.value = false
  }
}

function playAll() {
  if (tracks.value.length > 0) {
    player.playQueue(tracks.value, 0)
  }
}

onMounted(load)
watch(() => props.id, load)
</script>
