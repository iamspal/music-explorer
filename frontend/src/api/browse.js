import apiClient from './client'

export function getTrendingPlaylists(limit = 20, offset = 0) {
  return apiClient.get('/api/playlists/trending', { params: { limit, offset } })
}

export function getTrendingAlbums(limit = 20, offset = 0) {
  return apiClient.get('/api/albums/trending', { params: { limit, offset } })
}

export function getTrendingArtists(limit = 20, offset = 0) {
  return apiClient.get('/api/artists/trending', { params: { limit, offset } })
}
