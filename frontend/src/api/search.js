import apiClient from './client'

export function search({ q, type, limit = 25, offset = 0 }) {
  return apiClient.get('/api/search', { params: { q, type, limit, offset } })
}
