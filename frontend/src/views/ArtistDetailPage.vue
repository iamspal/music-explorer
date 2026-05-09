<template>
  <div>
    <ErrorState v-if="error" :message="error" @retry="load" />

    <template v-else>
      <!-- Hero -->
      <div
        v-if="!isLoading && artist"
        class="relative overflow-hidden p-6 lg:p-10 pb-8"
        :style="{
          background: `linear-gradient(180deg, rgba(255,100,100,0.15) 0%, #121212 100%)`,
        }"
      >
        <div class="flex flex-col sm:flex-row items-center sm:items-end gap-6">
          <img
            :src="artist?.picture_medium || artist?.picture_big || DEFAULT_COVER"
            :alt="artist?.name"
            class="size-48 lg:size-56 rounded-full shadow-2xl object-cover shrink-0"
          />
          <div class="min-w-0 text-center sm:text-left">
            <p class="text-xs font-bold text-white uppercase tracking-wider mb-2">{{ t('artist.label') }}</p>
            <h1 class="text-3xl lg:text-5xl font-bold text-white mb-3 truncate">
              {{ artist.name }}
            </h1>
            <p class="text-sm text-spotify-text-secondary">
              {{ t('artist.nFollowers', { n: formatNumber(artist?.nb_fan || 0) }) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Loading skeleton -->
      <div v-if="isLoading" class="px-4 lg:px-10 py-6 space-y-8">
        <div class="h-7 w-48 bg-spotify-surface animate-pulse rounded"></div>
        <LoadingSkeleton :count="5" type="list" />
      </div>

      <!-- Content -->
      <template v-else-if="artist">
        <!-- Top Tracks -->
        <section class="px-4 lg:px-10 py-6">
          <SectionHeader :title="t('artist.topTracks')" />
          <div class="space-y-0.5">
            <TrackCard
              v-for="(track, index) in topTracks"
              :key="track.id"
              :track="track"
              :show-index="index + 1"
            />
          </div>
        </section>

        <!-- Albums -->
        <section v-if="albums.length > 0" class="px-4 lg:px-10 py-6">
          <SectionHeader :title="t('artist.albums')" />
          <HorizontalScroll>
            <AlbumCard v-for="album in albums" :key="album.id" :album="album" />
          </HorizontalScroll>
        </section>

        <!-- Related Artists -->
        <section v-if="relatedArtists.length > 0" class="px-4 lg:px-10 py-6">
          <SectionHeader :title="t('artist.relatedArtists')" />
          <HorizontalScroll>
            <ArtistCard
              v-for="related in relatedArtists"
              :key="related.id"
              :artist="related"
            />
          </HorizontalScroll>
        </section>
      </template>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { getArtist, getArtistTopTracks, getArtistAlbums, getRelatedArtists } from '@/api/resources'
import { formatNumber } from '@/utils/format'
import { DEFAULT_COVER } from '@/utils/constants'
import TrackCard from '@/components/music/TrackCard.vue'
import AlbumCard from '@/components/music/AlbumCard.vue'
import ArtistCard from '@/components/music/ArtistCard.vue'
import SectionHeader from '@/components/music/SectionHeader.vue'
import HorizontalScroll from '@/components/ui/HorizontalScroll.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton.vue'

const { t } = useI18n()

const props = defineProps({
  id: { type: String, required: true },
})

const artist = ref(null)
const topTracks = ref([])
const albums = ref([])
const relatedArtists = ref([])
const isLoading = ref(true)
const error = ref(null)

async function load() {
  isLoading.value = true
  error.value = null
  try {
    const [arData, tData, aData, rData] = await Promise.all([
      getArtist(props.id),
      getArtistTopTracks(props.id),
      getArtistAlbums(props.id),
      getRelatedArtists(props.id),
    ])

    artist.value = arData
    topTracks.value = tData?.data || []
    albums.value = aData?.data || []
    relatedArtists.value = rData?.data || []
  } catch (e) {
    error.value = e.message
  } finally {
    isLoading.value = false
  }
}

onMounted(load)
watch(() => props.id, load)
</script>
