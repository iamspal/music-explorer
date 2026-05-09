import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useLibraryStore } from '@/stores/useLibraryStore'

describe('useLibraryStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('initializes with empty favorites', () => {
    const store = useLibraryStore()
    expect(store.favoriteTrackIds).toEqual([])
    expect(store.favoriteCount).toBe(0)
  })

  it('loads favorites from localStorage', () => {
    localStorage.setItem('music-explorer-favorites', JSON.stringify([1, 2, 3]))
    setActivePinia(createPinia())
    const store = useLibraryStore()
    expect(store.favoriteTrackIds).toEqual([1, 2, 3])
    expect(store.favoriteCount).toBe(3)
  })

  it('handles corrupt localStorage data', () => {
    localStorage.setItem('music-explorer-favorites', 'not-json')
    setActivePinia(createPinia())
    const store = useLibraryStore()
    expect(store.favoriteTrackIds).toEqual([])
  })

  it('isFavorite returns false for non-favorite', () => {
    const store = useLibraryStore()
    expect(store.isFavorite(42)).toBe(false)
  })

  it('isFavorite returns true after adding', () => {
    const store = useLibraryStore()
    store.toggleFavorite(42)
    expect(store.isFavorite(42)).toBe(true)
  })

  it('toggleFavorite adds and removes a track', () => {
    const store = useLibraryStore()

    store.toggleFavorite(1)
    expect(store.favoriteTrackIds).toContain(1)
    expect(store.favoriteCount).toBe(1)

    store.toggleFavorite(1)
    expect(store.favoriteTrackIds).not.toContain(1)
    expect(store.favoriteCount).toBe(0)
  })

  it('toggleFavorite persists to localStorage', () => {
    const store = useLibraryStore()
    store.toggleFavorite(7)

    const stored = JSON.parse(localStorage.getItem('music-explorer-favorites'))
    expect(stored).toEqual([7])
  })

  it('multiple toggles maintain correct state', () => {
    const store = useLibraryStore()
    store.toggleFavorite(1)
    store.toggleFavorite(2)
    store.toggleFavorite(3)
    store.toggleFavorite(2)

    expect(store.favoriteTrackIds).toEqual([1, 3])
    expect(store.favoriteCount).toBe(2)
  })
})
