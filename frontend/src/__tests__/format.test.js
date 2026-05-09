import { describe, it, expect } from 'vitest'
import { formatDuration, formatNumber, formatAlbumDuration, unwrapTrack } from '@/utils/format'

describe('formatDuration', () => {
  it('formats seconds to m:ss', () => {
    expect(formatDuration(65)).toBe('1:05')
    expect(formatDuration(3661)).toBe('61:01')
    expect(formatDuration(0)).toBe('0:00')
  })

  it('handles invalid input', () => {
    expect(formatDuration(null)).toBe('0:00')
    expect(formatDuration(undefined)).toBe('0:00')
    expect(formatDuration(NaN)).toBe('0:00')
  })
})

describe('formatNumber', () => {
  it('formats large numbers', () => {
    expect(formatNumber(1500000)).toBe('1.5M')
    expect(formatNumber(5000)).toBe('5.0K')
    expect(formatNumber(500)).toBe('500')
  })

  it('handles zero', () => {
    expect(formatNumber(0)).toBe('0')
  })
})

describe('unwrapTrack', () => {
  it('returns the item directly when no track wrapper', () => {
    const track = { id: 1, title: 'Song' }
    expect(unwrapTrack(track)).toBe(track)
  })

  it('unwraps nested track object', () => {
    const inner = { id: 2, title: 'Nested Song' }
    const wrapped = { track: inner }
    expect(unwrapTrack(wrapped)).toBe(inner)
  })

  it('handles null/undefined', () => {
    expect(unwrapTrack(null)).toBe(null)
    expect(unwrapTrack(undefined)).toBe(undefined)
  })
})

describe('formatAlbumDuration', () => {
  it('sums track durations into minutes', () => {
    const tracks = [{ duration: 180 }, { duration: 240 }, { duration: 120 }]
    expect(formatAlbumDuration(tracks)).toBe('9 min')
  })

  it('handles empty array', () => {
    expect(formatAlbumDuration([])).toBe('0 min')
    expect(formatAlbumDuration(null)).toBe('0 min')
  })
})
