<template>
  <div class="px-4 lg:px-6 py-4 lg:py-6 space-y-8 lg:space-y-10 max-w-[2000px] mx-auto">
    <!-- Error state -->
    <ErrorState v-if="error" :message="error" @retry="loadData" />

    <!-- Loading state -->
    <template v-else-if="isLoading">
      <div v-for="section in 3" :key="section" class="space-y-3">
        <div class="h-7 w-48 bg-spotify-surface animate-pulse rounded"></div>
        <LoadingSkeleton :count="6" type="card" class="flex gap-4" />
      </div>
    </template>

    <!-- Content -->
    <template v-else>
      <!-- Featured Playlists -->
      <section>
        <SectionHeader :title="t('home.featuredPlaylists')" />
        <HorizontalScroll>
          <PlaylistCard
            v-for="playlist in playlists"
            :key="playlist.id"
            :playlist="playlist"
          />
        </HorizontalScroll>
      </section>

      <!-- Trending Tracks -->
      <section v-if="allTracks.length > 0">
        <SectionHeader :title="t('home.trendingTracks')" />
        <div class="space-y-0.5">
          <TrackCard
            v-for="(track, index) in allTracks"
            :key="track.id"
            :track="track"
            :show-index="index + 1"
          />
        </div>
      </section>

      <!-- Popular Albums -->
      <section>
        <SectionHeader :title="t('home.popularAlbums')" />
        <HorizontalScroll>
          <AlbumCard
            v-for="album in albums"
            :key="album.id"
            :album="album"
          />
        </HorizontalScroll>
      </section>

      <!-- Trending Artists -->
      <section>
        <SectionHeader :title="t('home.trendingArtists')" />
        <HorizontalScroll>
          <ArtistCard
            v-for="artist in artists"
            :key="artist.id"
            :artist="artist"
          />
        </HorizontalScroll>
      </section>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getTrendingPlaylists, getTrendingAlbums, getTrendingArtists } from '@/api/browse'
import SectionHeader from '@/components/music/SectionHeader.vue'
import PlaylistCard from '@/components/music/PlaylistCard.vue'
import AlbumCard from '@/components/music/AlbumCard.vue'
import ArtistCard from '@/components/music/ArtistCard.vue'
import TrackCard from '@/components/music/TrackCard.vue'
import HorizontalScroll from '@/components/ui/HorizontalScroll.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton.vue'
import { unwrapTrack } from '@/utils/format'

const { t } = useI18n()

const playlists = ref([])
const albums = ref([])
const artists = ref([])
const allTracks = ref([])
const isLoading = ref(true)
const error = ref(null)

async function loadData() {
  isLoading.value = true
  error.value = null
  try {
    const [pData, aData, arData] = await Promise.all([
      getTrendingPlaylists(12),
      getTrendingAlbums(12),
      getTrendingArtists(12),
    ])

    playlists.value = pData?.data || []
    albums.value = aData?.data || []
    artists.value = arData?.data || []

    // Collect unique tracks from trending playlists for a "Trending Tracks" section
    const trackMap = new Map()
    for (const playlist of playlists.value.slice(0, 4)) {
      if (playlist.tracks?.data) {
        for (const item of playlist.tracks.data) {
          const track = unwrapTrack(item)
          if (track?.id && track?.preview && !trackMap.has(track.id)) {
            trackMap.set(track.id, track)
          }
        }
      }
    }
    allTracks.value = [...trackMap.values()].slice(0, 10)
  } catch (e) {
    error.value = e.message
  } finally {
    isLoading.value = false
  }
}

onMounted(loadData)
</script>
