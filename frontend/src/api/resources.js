import apiClient from './client'

export function getTrack(id) {
  return apiClient.get(`/api/tracks/${id}`)
}

export function getAlbum(id) {
  return apiClient.get(`/api/albums/${id}`)
}

export function getAlbumTracks(id, limit = 100, offset = 0) {
  return apiClient.get(`/api/albums/${id}/tracks`, { params: { limit, offset } })
}

export function getArtist(id) {
  return apiClient.get(`/api/artists/${id}`)
}

export function getArtistTopTracks(id, limit = 10) {
  return apiClient.get(`/api/artists/${id}/top-tracks`, { params: { limit } })
}

export function getArtistAlbums(id, limit = 20) {
  return apiClient.get(`/api/artists/${id}/albums`, { params: { limit } })
}

export function getRelatedArtists(id, limit = 10) {
  return apiClient.get(`/api/artists/${id}/related`, { params: { limit } })
}

export function getPlaylist(id) {
  return apiClient.get(`/api/playlists/${id}`)
}

export function getPlaylistTracks(id, limit = 100, offset = 0) {
  return apiClient.get(`/api/playlists/${id}/tracks`, { params: { limit, offset } })
}
