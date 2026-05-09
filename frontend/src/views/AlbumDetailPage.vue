<template>
  <div>
    <ErrorState v-if="error" :message="error" @retry="load" />

    <template v-else>
      <!-- Hero skeleton -->
      <LoadingSkeleton v-if="isLoading" :count="1" type="hero" />

      <!-- Hero -->
      <div
        v-else
        class="relative overflow-hidden p-6 lg:p-10 pb-8"
        :style="{
          background: `linear-gradient(180deg, rgba(100,100,255,0.2) 0%, #121212 100%)`,
        }"
      >
        <div class="flex flex-col sm:flex-row items-center sm:items-end gap-6">
          <img
            :src="album?.cover_medium || album?.cover_big || DEFAULT_COVER"
            :alt="album?.title"
            class="size-48 lg:size-56 rounded-xl shadow-2xl object-cover shrink-0"
          />
          <div class="min-w-0 text-center sm:text-left">
            <p class="text-xs font-bold text-white uppercase tracking-wider mb-2">{{ t('album.label') }}</p>
            <h1 class="text-3xl lg:text-5xl font-bold text-white mb-3 truncate">
              {{ album?.title }}
            </h1>
            <div class="flex items-center justify-center sm:justify-start gap-2 text-sm text-spotify-text-secondary">
              <RouterLink
                v-if="album?.artist"
                :to="`/artist/${album.artist.id}`"
                class="text-white font-medium hover:underline"
              >
                {{ album.artist.name }}
              </RouterLink>
              <span>&middot;</span>
              <span>{{ album?.release_date ? new Date(album.release_date).getFullYear() : '' }}</span>
              <span>&middot;</span>
              <span>{{ t('common.nSongs', { n: formatNumber(tracks.length) }) }}</span>
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
          :aria-label="t('album.playAll')"
        >
          <i class="fas fa-play text-black text-xl ml-0.5" aria-hidden="true"></i>
        </button>
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
import { getAlbum, getAlbumTracks } from '@/api/resources'
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

const album = ref(null)
const tracks = ref([])
const isLoading = ref(true)
const error = ref(null)

async function load() {
  isLoading.value = true
  error.value = null
  try {
    const [aData, tData] = await Promise.all([getAlbum(props.id), getAlbumTracks(props.id, 100)])

    album.value = aData
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
