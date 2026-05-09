export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8082'

import defaultCoverSvg from '@/assets/default-cover.svg'

export const DEFAULT_COVER = defaultCoverSvg

export const FAVORITES_STORAGE_KEY = 'music-explorer-favorites'

export const NAV_ITEMS = [
  { labelKey: 'common.home', icon: 'fa-solid fa-house', to: '/' },
  { labelKey: 'common.search', icon: 'fa-solid fa-magnifying-glass', to: '/search' },
  { labelKey: 'common.favorites', icon: 'fa-solid fa-heart', to: '/favorites' },
]

export const REPEAT_MODES = {
  OFF: 'off',
  ALL: 'all',
  ONE: 'one',
}
