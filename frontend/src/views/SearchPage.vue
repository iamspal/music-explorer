<template>
  <div class="px-4 lg:px-6 py-4 lg:py-6 max-w-[2000px] mx-auto">
    <!-- Search Input -->
    <div class="max-w-xl mb-6">
      <SearchInput
        :model-value="query"
        :placeholder="t('search.placeholder')"
        @search="onSearch"
      />
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 mb-6 overflow-x-auto" v-if="query">
      <button
        v-for="tab in tabsWithClasses"
        :key="tab.key"
        class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap"
        :class="tab.classes"
        @click="onTabChange(tab.key)"
      >
        {{ t(tab.labelKey) }}
      </button>
    </div>

    <!-- Loading: tracks are list-style -->
    <LoadingSkeleton v-if="isLoading && activeTab === 'track'" :count="8" type="list" class="space-y-0.5" />

    <!-- Loading: albums, artists, playlists are card-style -->
    <LoadingSkeleton v-else-if="isLoading" :count="8" type="card" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4" />

    <!-- Error -->
    <ErrorState
      v-else-if="hasError"
      :message="t('search.errorMessage')"
      @retry="doSearch(query)"
    />

    <!-- Empty: no query -->
    <EmptyState
      v-else-if="!query"
      icon="fa-solid fa-magnifying-glass"
      :title="t('search.emptyTitle')"
      :description="t('search.emptyDescription')"
    />

    <!-- Empty: no results -->
    <EmptyState
      v-else-if="results.length === 0"
      icon="fa-solid fa-face-frown"
      :title="t('search.noResultsTitle', { tab: t('common.' + activeTab + 's') })"
      :description="emptyDescription"
    />

    <!-- Results Grid -->
    <div
      v-else
      class="grid gap-4"
      :class="gridClasses"
    >
      <!-- Tracks -->
      <template v-if="activeTab === 'track'">
        <TrackCard
          v-for="track in results"
          :key="track.id"
          :track="track"
          :show-index="null"
        />
      </template>

      <!-- Albums -->
      <template v-else-if="activeTab === 'album'">
        <AlbumCard
          v-for="album in results"
          :key="album.id"
          :album="album"
        />
      </template>

      <!-- Artists -->
      <template v-else-if="activeTab === 'artist'">
        <ArtistCard
          v-for="artist in results"
          :key="artist.id"
          :artist="artist"
        />
      </template>

      <!-- Playlists -->
      <template v-else-if="activeTab === 'playlist'">
        <PlaylistCard
          v-for="playlist in results"
          :key="playlist.id"
          :playlist="playlist"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { search } from '@/api/search'
import { useRoute, useRouter } from 'vue-router'
import SearchInput from '@/components/ui/SearchInput.vue'
import TrackCard from '@/components/music/TrackCard.vue'
import AlbumCard from '@/components/music/AlbumCard.vue'
import PlaylistCard from '@/components/music/PlaylistCard.vue'
import ArtistCard from '@/components/music/ArtistCard.vue'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const query = ref(route.query.q || '')
const activeTab = ref(route.query.type || 'track')
const isLoading = ref(false)
const results = ref([])
const hasError = ref(false)

const tabs = [
  { key: 'track', labelKey: 'common.tracks' },
  { key: 'album', labelKey: 'common.albums' },
  { key: 'artist', labelKey: 'common.artists' },
  { key: 'playlist', labelKey: 'common.playlists' },
]

async function doSearch(q) {
  if (!q?.trim()) {
    results.value = []
    hasError.value = false
    return
  }
  isLoading.value = true
  hasError.value = false
  try {
    const data = await search({ q, type: activeTab.value, limit: 24 })
    results.value = data?.data || []
  } catch {
    results.value = []
    hasError.value = true
  } finally {
    isLoading.value = false
  }
}

function onSearch(q) {
  query.value = q
  router.replace({ query: { ...route.query, q: q || undefined } })
  doSearch(q)
}

function onTabChange(tab) {
  activeTab.value = tab
  router.replace({ query: { q: query.value || undefined, type: tab } })
  if (query.value) {
    doSearch(query.value)
  }
}

const emptyDescription = computed(() =>
  t('search.noResultsDescription', {
    type: t('common.' + activeTab.value + 's'),
    query: query.value,
  }),
)

const tabsWithClasses = computed(() =>
  tabs.map((tab) => ({
    ...tab,
    classes: activeTab.value === tab.key
      ? 'bg-white text-black'
      : 'bg-spotify-surface text-white hover:bg-spotify-surface-light',
  })),
)

const gridClasses = computed(() => ({
  'grid-cols-1 md:grid-cols-2 lg:grid-cols-3': activeTab.value === 'track',
  'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6': activeTab.value !== 'track',
}))

onMounted(() => {
  if (query.value) {
    doSearch(query.value)
  }
})
</script>
