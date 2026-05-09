import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import i18n from '@/i18n'
import TrackList from '@/components/music/TrackList.vue'

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

const tracks = [
  { id: 1, title: 'Track 1', artist: { name: 'Artist' }, duration: 200, preview: '' },
  { id: 2, title: 'Track 2', artist: { name: 'Artist' }, duration: 210, preview: '' },
  { id: 3, title: 'Track 3', artist: { name: 'Artist' }, duration: 180, preview: '' },
]

function mountTrackList(props = {}) {
  setActivePinia(createPinia())
  return mount(TrackList, {
    props: { tracks, ...props },
    global: { plugins: [router, i18n] },
  })
}

describe('TrackList', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders all tracks', () => {
    const wrapper = mountTrackList()
    const items = wrapper.findAllComponents({ name: 'TrackCard' })
    expect(items).toHaveLength(3)
  })

  it('shows loading skeleton when isLoading is true', () => {
    const wrapper = mountTrackList({ isLoading: true })
    // Loading state renders 8 skeleton rows
    const skeletons = wrapper.findAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('shows empty state when tracks array is empty', () => {
    const wrapper = mountTrackList({ tracks: [] })
    expect(wrapper.text()).toContain('No tracks found')
  })

  it('accepts custom empty state props', () => {
    const wrapper = mountTrackList({
      tracks: [],
      emptyIcon: 'fa-solid fa-heart',
      emptyTitle: 'No favorites',
      emptyDescription: 'Add some favorites to get started',
    })
    expect(wrapper.text()).toContain('No favorites')
    expect(wrapper.text()).toContain('Add some favorites to get started')
  })

  it('hides loading and empty when tracks exist', () => {
    const wrapper = mountTrackList()
    expect(wrapper.find('.animate-pulse').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('No tracks found')
  })
})
