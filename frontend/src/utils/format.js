export function unwrapTrack(item) {
  return item?.track || item
}

export function formatDuration(seconds) {
  if (!seconds || !isFinite(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function formatNumber(num) {
  if (!num) return '0'
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toLocaleString()
}

export function formatAlbumDuration(tracks) {
  if (!tracks?.length) return '0 min'
  const totalSecs = tracks.reduce((sum, t) => sum + (t.duration || 0), 0)
  const mins = Math.round(totalSecs / 60)
  return `${mins} min`
}

