import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

const mockAudio = {
  src: '',
  volume: 0.7,
  currentTime: 0,
  duration: 0,
  play: vi.fn(() => Promise.resolve()),
  pause: vi.fn(),
}

function MockAudio() {
  return mockAudio
}
vi.stubGlobal('Audio', MockAudio)

import { usePlayerStore } from '@/stores/usePlayerStore'

const makeTrack = (id, preview = `https://example.com/${id}.mp3`) => ({
  id,
  title: `Track ${id}`,
  artist: { id: 100 + id, name: `Artist ${id}` },
  album: { id: 200 + id, title: `Album ${id}`, cover_small: '' },
  duration: 200 + id * 10,
  preview,
})

function resetMockAudio() {
  mockAudio.src = ''
  mockAudio.volume = 0.7
  mockAudio.currentTime = 0
  mockAudio.duration = 0
  mockAudio.play.mockClear()
  mockAudio.pause.mockClear()
}

describe('usePlayerStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    resetMockAudio()
  })

  describe('initial state', () => {
    it('has sane defaults', () => {
      const store = usePlayerStore()
      expect(store.currentTrack).toBeNull()
      expect(store.queue).toEqual([])
      expect(store.isPlaying).toBe(false)
      expect(store.volume).toBe(0.7)
      expect(store.currentTime).toBe(0)
      expect(store.duration).toBe(0)
      expect(store.isShuffled).toBe(false)
      expect(store.repeatMode).toBe('off')
      expect(store.hasTrack).toBe(false)
    })
  })

  describe('playTrack', () => {
    it('sets currentTrack and plays', () => {
      const store = usePlayerStore()
      const track = makeTrack(1)
      store.playTrack(track)
      expect(store.currentTrack).toEqual(track)
      expect(mockAudio.src).toBe(track.preview)
      expect(mockAudio.play).toHaveBeenCalled()
    })

    it('toggles play when same track is passed while playing', () => {
      const store = usePlayerStore()
      const track = makeTrack(1)
      store.playTrack(track)
      // playTrack sets isPlaying via microtask; simulate finished playback
      store.isPlaying = true

      store.playTrack(track)
      expect(mockAudio.pause).toHaveBeenCalled()
      expect(store.isPlaying).toBe(false)
    })

    it('does nothing when track has no preview', () => {
      const store = usePlayerStore()
      const track = { id: 1, title: 'No Preview' }
      store.playTrack(track)
      expect(store.currentTrack).toBeNull()
      expect(mockAudio.play).not.toHaveBeenCalled()
    })

    it('does nothing for null/undefined track', () => {
      const store = usePlayerStore()
      store.playTrack(null)
      store.playTrack(undefined)
      expect(store.currentTrack).toBeNull()
    })
  })

  describe('togglePlay', () => {
    it('does nothing when no track is set', () => {
      const store = usePlayerStore()
      store.togglePlay()
      expect(mockAudio.play).not.toHaveBeenCalled()
      expect(mockAudio.pause).not.toHaveBeenCalled()
    })

    it('pauses when playing', () => {
      const store = usePlayerStore()
      store.playTrack(makeTrack(1))
      store.isPlaying = true
      mockAudio.play.mockClear()

      store.togglePlay()
      expect(mockAudio.pause).toHaveBeenCalled()
      expect(store.isPlaying).toBe(false)
    })

    it('resumes when paused', () => {
      const store = usePlayerStore()
      store.playTrack(makeTrack(1))
      // isPlaying is false (microtask didn't flush), so togglePlay will resume
      mockAudio.play.mockClear()

      store.togglePlay()
      expect(mockAudio.play).toHaveBeenCalled()
    })
  })

  describe('playQueue', () => {
    it('sets queue and plays first track', () => {
      const store = usePlayerStore()
      const tracks = [makeTrack(1), makeTrack(2), makeTrack(3)]
      store.playQueue(tracks)
      expect(store.queue).toEqual(tracks)
      expect(store.currentTrack).toEqual(tracks[0])
      expect(mockAudio.play).toHaveBeenCalled()
    })

    it('plays from given startIndex', () => {
      const store = usePlayerStore()
      const tracks = [makeTrack(1), makeTrack(2), makeTrack(3)]
      store.playQueue(tracks, 2)
      expect(store.currentTrack).toEqual(tracks[2])
    })
  })

  describe('next', () => {
    it('advances to next track in queue', () => {
      const store = usePlayerStore()
      const tracks = [makeTrack(1), makeTrack(2), makeTrack(3)]
      store.playQueue(tracks, 0)
      mockAudio.play.mockClear()

      store.next()
      expect(store.currentTrack).toEqual(tracks[1])
      expect(mockAudio.src).toBe(tracks[1].preview)
      expect(mockAudio.play).toHaveBeenCalled()
    })

    it('stops at end when repeat is off', () => {
      const store = usePlayerStore()
      const tracks = [makeTrack(1), makeTrack(2)]
      store.playQueue(tracks, 1)
      mockAudio.play.mockClear()

      store.next()
      expect(store.isPlaying).toBe(false)
    })

    it('wraps to start when repeat is ALL', () => {
      const store = usePlayerStore()
      const tracks = [makeTrack(1), makeTrack(2)]
      store.playQueue(tracks, 0)
      store.repeatMode = 'all'
      // Pinia unwraps refs — set directly, not via .value
      store.currentTrack = tracks[1]
      mockAudio.play.mockClear()

      store.next()
      expect(store.currentTrack).toEqual(tracks[0])
      expect(mockAudio.play).toHaveBeenCalled()
    })

    it('restarts same track when repeat is ONE', () => {
      const store = usePlayerStore()
      const tracks = [makeTrack(1), makeTrack(2)]
      store.playQueue(tracks, 0)
      store.repeatMode = 'one'
      mockAudio.play.mockClear()
      mockAudio.currentTime = 30

      store.next()
      expect(mockAudio.currentTime).toBe(0)
      expect(mockAudio.play).toHaveBeenCalled()
    })

    it('does nothing with empty queue', () => {
      const store = usePlayerStore()
      store.next()
      expect(mockAudio.play).not.toHaveBeenCalled()
    })
  })

  describe('previous', () => {
    it('restarts track if more than 3s in', () => {
      const store = usePlayerStore()
      const tracks = [makeTrack(1), makeTrack(2)]
      store.playQueue(tracks, 0)
      mockAudio.currentTime = 10
      store.currentTime = 10

      store.previous()
      expect(mockAudio.currentTime).toBe(0)
      expect(store.currentTrack).toEqual(tracks[0])
    })

    it('goes to previous track if under 3s', () => {
      const store = usePlayerStore()
      const tracks = [makeTrack(1), makeTrack(2)]
      store.playQueue(tracks, 1)
      mockAudio.currentTime = 1
      store.currentTime = 1
      mockAudio.play.mockClear()

      store.previous()
      expect(store.currentTrack).toEqual(tracks[0])
      expect(mockAudio.src).toBe(tracks[0].preview)
    })

    it('wraps to last track from first position', () => {
      const store = usePlayerStore()
      const tracks = [makeTrack(1), makeTrack(2), makeTrack(3)]
      store.playQueue(tracks, 0)
      mockAudio.currentTime = 1
      store.currentTime = 1
      mockAudio.play.mockClear()

      store.previous()
      expect(store.currentTrack).toEqual(tracks[2])
    })

    it('does nothing with empty queue', () => {
      const store = usePlayerStore()
      store.previous()
      expect(mockAudio.play).not.toHaveBeenCalled()
    })
  })

  describe('seek', () => {
    it('updates audio.currentTime and store currentTime', () => {
      const store = usePlayerStore()
      store.seek(30)
      expect(mockAudio.currentTime).toBe(30)
      expect(store.currentTime).toBe(30)
    })
  })

  describe('setVolume', () => {
    it('sets volume within bounds', () => {
      const store = usePlayerStore()
      store.setVolume(0.5)
      expect(store.volume).toBe(0.5)
      expect(mockAudio.volume).toBe(0.5)

      store.setVolume(1.5)
      expect(store.volume).toBe(1)
      expect(mockAudio.volume).toBe(1)

      store.setVolume(-0.5)
      expect(store.volume).toBe(0)
      expect(mockAudio.volume).toBe(0)
    })
  })

  describe('toggleShuffle', () => {
    it('toggles shuffle state', () => {
      const store = usePlayerStore()
      expect(store.isShuffled).toBe(false)
      store.toggleShuffle()
      expect(store.isShuffled).toBe(true)
      store.toggleShuffle()
      expect(store.isShuffled).toBe(false)
    })
  })

  describe('cycleRepeat', () => {
    it('cycles through OFF → ALL → ONE → OFF', () => {
      const store = usePlayerStore()
      expect(store.repeatMode).toBe('off')

      store.cycleRepeat()
      expect(store.repeatMode).toBe('all')

      store.cycleRepeat()
      expect(store.repeatMode).toBe('one')

      store.cycleRepeat()
      expect(store.repeatMode).toBe('off')
    })
  })
})
