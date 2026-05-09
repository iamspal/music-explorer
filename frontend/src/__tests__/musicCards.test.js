import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import i18n from '@/i18n'
import AlbumCard from '@/components/music/AlbumCard.vue'
import ArtistCard from '@/components/music/ArtistCard.vue'
import PlaylistCard from '@/components/music/PlaylistCard.vue'
import SectionHeader from '@/components/music/SectionHeader.vue'

function mountWithPlugins(component, props) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/album/:id', name: 'album', component: { template: '<div/>' } },
      { path: '/artist/:id', name: 'artist', component: { template: '<div/>' } },
      { path: '/playlist/:id', name: 'playlist', component: { template: '<div/>' } },
    ],
  })
  setActivePinia(createPinia())
  return mount(component, {
    props,
    global: { plugins: [router, i18n] },
  })
}

describe('AlbumCard', () => {
  let wrapper
  const album = {
    id: 1,
    title: 'Dark Side of the Moon',
    cover_medium: 'https://example.com/cover.jpg',
    artist: { name: 'Pink Floyd' },
  }

  beforeEach(() => {
    wrapper = mountWithPlugins(AlbumCard, { album })
  })

  it('renders album title', () => {
    expect(wrapper.text()).toContain('Dark Side of the Moon')
  })

  it('renders artist name', () => {
    expect(wrapper.text()).toContain('Pink Floyd')
  })

  it('links to album detail page', () => {
    const link = wrapper.findComponent({ name: 'RouterLink' })
    expect(link.props('to')).toBe('/album/1')
  })

  it('shows fallback text for missing artist', () => {
    const w = mountWithPlugins(AlbumCard, {
      album: { id: 2, title: 'Unknown Album' },
    })
    expect(w.text()).toContain('Unknown Artist')
  })

  it('renders cover image with alt text', () => {
    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe('https://example.com/cover.jpg')
    expect(img.attributes('alt')).toBe('Dark Side of the Moon')
  })
})

describe('ArtistCard', () => {
  const artist = {
    id: 1,
    name: 'Radiohead',
    picture_medium: 'https://example.com/pic.jpg',
  }

  it('renders artist name', () => {
    const wrapper = mountWithPlugins(ArtistCard, { artist })
    expect(wrapper.text()).toContain('Radiohead')
  })

  it('links to artist detail page', () => {
    const wrapper = mountWithPlugins(ArtistCard, { artist })
    const link = wrapper.findComponent({ name: 'RouterLink' })
    expect(link.props('to')).toBe('/artist/1')
  })

  it('shows "Artist" label', () => {
    const wrapper = mountWithPlugins(ArtistCard, { artist })
    expect(wrapper.text()).toContain('Artist')
  })

  it('renders picture with round style', () => {
    const wrapper = mountWithPlugins(ArtistCard, { artist })
    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe('https://example.com/pic.jpg')
    expect(img.classes()).toContain('rounded-full')
  })
})

describe('PlaylistCard', () => {
  const playlist = {
    id: 1,
    title: 'Workout Mix',
    picture_medium: 'https://example.com/playlist.jpg',
    nb_tracks: 25,
  }

  it('renders playlist title', () => {
    const wrapper = mountWithPlugins(PlaylistCard, { playlist })
    expect(wrapper.text()).toContain('Workout Mix')
  })

  it('shows track count', () => {
    const wrapper = mountWithPlugins(PlaylistCard, { playlist })
    expect(wrapper.text()).toContain('25 tracks')
  })

  it('shows 0 tracks when nb_tracks is missing', () => {
    const wrapper = mountWithPlugins(PlaylistCard, {
      playlist: { id: 2, title: 'Empty' },
    })
    expect(wrapper.text()).toContain('0 tracks')
  })

  it('links to playlist detail page', () => {
    const wrapper = mountWithPlugins(PlaylistCard, { playlist })
    const link = wrapper.findComponent({ name: 'RouterLink' })
    expect(link.props('to')).toBe('/playlist/1')
  })
})

describe('SectionHeader', () => {
  it('renders the title', () => {
    const wrapper = mountWithPlugins(SectionHeader, { title: 'Popular Tracks' })
    expect(wrapper.find('h2').text()).toBe('Popular Tracks')
  })
})
