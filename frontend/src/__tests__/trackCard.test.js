import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { useLibraryStore } from '@/stores/useLibraryStore'
import i18n from '@/i18n'
import TrackCard from '@/components/music/TrackCard.vue'

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

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/album/:id', name: 'album', component: { template: '<div/>' } },
    { path: '/artist/:id', name: 'artist', component: { template: '<div/>' } },
  ],
})

const track = {
  id: 1,
  title: 'Bohemian Rhapsody',
  artist: { id: 100, name: 'Queen' },
  album: { id: 200, title: 'A Night at the Opera', cover_small: 'https://example.com/cover.jpg' },
  duration: 355,
  preview: 'https://example.com/preview.mp3',
}

function mountTrackCard(props = {}) {
  setActivePinia(createPinia())
  return mount(TrackCard, {
    props: { track, ...props },
    global: { plugins: [router, i18n] },
  })
}

describe('TrackCard', () => {
  beforeEach(() => {
    mockAudio.play.mockClear()
    mockAudio.pause.mockClear()
    localStorage.clear()
  })

  it('renders track title', () => {
    const wrapper = mountTrackCard()
    expect(wrapper.text()).toContain('Bohemian Rhapsody')
  })

  it('renders artist name', () => {
    const wrapper = mountTrackCard()
    expect(wrapper.text()).toContain('Queen')
  })

  it('renders formatted duration', () => {
    const wrapper = mountTrackCard()
    expect(wrapper.text()).toContain('5:55')
  })

  it('shows index when provided', () => {
    const wrapper = mountTrackCard({ showIndex: 3 })
    expect(wrapper.text()).toContain('3')
  })

  it('does not show index by default', () => {
    const wrapper = mountTrackCard()
    // The index area should be empty when showIndex is null
    expect(wrapper.find('.w-8.text-center').text()).toBe('')
  })

  it('calls player.playTrack on click', () => {
    const wrapper = mountTrackCard()
    wrapper.find('.group').trigger('click')
    // The store should have played the track
    const player = usePlayerStore()
    expect(player.currentTrack).toEqual(track)
  })

  it('shows cover image when showCover is true', () => {
    const wrapper = mountTrackCard({ showCover: true })
    expect(wrapper.find('img').exists()).toBe(true)
  })

  it('hides cover image when showCover is false', () => {
    const wrapper = mountTrackCard({ showCover: false })
    expect(wrapper.find('img').exists()).toBe(false)
  })

  it('highlights current track with green accent', async () => {
    const wrapper = mountTrackCard()
    const player = usePlayerStore()
    // Simulate playing this track
    player.currentTrack = track
    player.isPlaying = true

    await wrapper.vm.$nextTick()
    // The track title should have green color
    const titleEl = wrapper.find('.text-spotify-green')
    expect(titleEl.exists()).toBe(true)
  })

  it('toggles favorite via library store', () => {
    const wrapper = mountTrackCard()
    const library = useLibraryStore()

    // Find the favorite button and click it
    // It's the last button in the component
    const buttons = wrapper.findAll('button')
    const favBtn = buttons[buttons.length - 1]
    favBtn.trigger('click')

    expect(library.isFavorite(track.id)).toBe(true)
  })
})
