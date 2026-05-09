import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { FAVORITES_STORAGE_KEY } from '@/utils/constants'

export const useLibraryStore = defineStore('library', () => {
  const favoriteTrackIds = ref(loadFavorites())

  const favoriteCount = computed(() => favoriteTrackIds.value.length)

  function loadFavorites() {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  function persist() {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteTrackIds.value))
    } catch {
      // localStorage may be full or unavailable
    }
  }

  function isFavorite(trackId) {
    return favoriteTrackIds.value.includes(trackId)
  }

  function toggleFavorite(trackId) {
    const index = favoriteTrackIds.value.indexOf(trackId)
    if (index === -1) {
      favoriteTrackIds.value.push(trackId)
    } else {
      favoriteTrackIds.value.splice(index, 1)
    }
    persist()
  }

  return {
    favoriteTrackIds,
    favoriteCount,
    isFavorite,
    toggleFavorite,
  }
})
