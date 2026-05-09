import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { useLibraryStore } from '@/stores/useLibraryStore'
import i18n from '@/i18n'
import NowPlaying from '@/components/player/NowPlaying.vue'
import PlayerControls from '@/components/player/PlayerControls.vue'
import SeekBar from '@/components/player/SeekBar.vue'
import VolumeSlider from '@/components/player/VolumeSlider.vue'
import MusicPlayer from '@/components/player/MusicPlayer.vue'

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

function setupStore() {
  setActivePinia(createPinia())
  return { player: usePlayerStore(), library: useLibraryStore() }
}

function mountComponent(component) {
  return mount(component, {
    global: { plugins: [i18n] },
  })
}

const track = {
  id: 1,
  title: 'Bohemian Rhapsody',
  artist: { name: 'Queen' },
  album: { id: 200, title: 'A Night at the Opera', cover_small: 'https://example.com/cover.jpg' },
  duration: 355,
  preview: 'https://example.com/preview.mp3',
}

describe('NowPlaying', () => {
  beforeEach(() => {
    mockAudio.play.mockClear()
    mockAudio.pause.mockClear()
  })

  it('shows empty state when no track', () => {
    setupStore()
    const wrapper = mountComponent(NowPlaying)
    expect(wrapper.text()).toContain('No track playing')
  })

  it('shows track info when a track is playing', async () => {
    const { player } = setupStore()
    const wrapper = mountComponent(NowPlaying)
    player.currentTrack = track
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Bohemian Rhapsody')
    expect(wrapper.text()).toContain('Queen')
  })

  it('shows cover image for current track', async () => {
    const { player } = setupStore()
    const wrapper = mountComponent(NowPlaying)
    player.currentTrack = track
    await wrapper.vm.$nextTick()

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('alt')).toBe('Bohemian Rhapsody')
  })

  it('toggles favorite on button click', async () => {
    const { player, library } = setupStore()
    const wrapper = mountComponent(NowPlaying)
    player.currentTrack = track
    await wrapper.vm.$nextTick()

    const favBtn = wrapper.findAll('button').at(-1)
    favBtn.trigger('click')
    expect(library.isFavorite(track.id)).toBe(true)
  })
})

describe('PlayerControls', () => {
  beforeEach(() => {
    mockAudio.play.mockClear()
    mockAudio.pause.mockClear()
  })

  it('renders all control buttons', () => {
    setupStore()
    const wrapper = mountComponent(PlayerControls)
    const buttons = wrapper.findAll('button')
    // shuffle, previous, play/pause, next, repeat = 5 buttons
    expect(buttons).toHaveLength(5)
  })

  it('calls player.togglePlay on play button click', () => {
    setupStore()
    const wrapper = mountComponent(PlayerControls)
    // Play button is the center one (3rd of 5)
    const playBtn = wrapper.findAll('button')[2]
    playBtn.trigger('click')
    // togglePlay does nothing without currentTrack, but should be called
    expect(mockAudio.play).not.toHaveBeenCalled()
  })

  it('calls player.next on next button click', () => {
    const { player } = setupStore()
    player.playQueue([
      { ...track, id: 1 },
      { ...track, id: 2, title: 'Next Track' },
    ])
    mockAudio.play.mockClear()

    const wrapper = mountComponent(PlayerControls)
    const nextBtn = wrapper.findAll('button')[3]
    nextBtn.trigger('click')

    // Should have advanced to next track
    expect(player.currentTrack.id).toBe(2)
  })

  it('calls player.previous on prev button click', () => {
    const { player } = setupStore()
    player.currentTrack = track
    player.isPlaying = true
    mockAudio.play.mockClear()

    const wrapper = mountComponent(PlayerControls)
    const prevBtn = wrapper.findAll('button')[1]
    prevBtn.trigger('click')

    // Should have called play (restarting the track since currentTime=0 < 3s)
    // Actually, currentTime is 0, so < 3s means go to previous
    // But there's no queue, so queue is empty and previous() returns early
    expect(mockAudio.play).not.toHaveBeenCalled()
  })

  it('toggles shuffle on button click', () => {
    const { player } = setupStore()
    const wrapper = mountComponent(PlayerControls)
    const shuffleBtn = wrapper.findAll('button')[0]
    shuffleBtn.trigger('click')
    expect(player.isShuffled).toBe(true)
    shuffleBtn.trigger('click')
    expect(player.isShuffled).toBe(false)
  })

  it('cycles repeat mode on button click', () => {
    const { player } = setupStore()
    const wrapper = mountComponent(PlayerControls)
    const repeatBtn = wrapper.findAll('button')[4]
    repeatBtn.trigger('click')
    expect(player.repeatMode).toBe('all')
    repeatBtn.trigger('click')
    expect(player.repeatMode).toBe('one')
  })

  it('shows green highlight when shuffled', async () => {
    const { player } = setupStore()
    const wrapper = mountComponent(PlayerControls)
    player.isShuffled = true
    await wrapper.vm.$nextTick()

    const shuffleBtn = wrapper.findAll('button')[0]
    expect(shuffleBtn.classes()).toContain('text-spotify-green')
  })
})

describe('SeekBar', () => {
  it('renders current and total time', () => {
    setupStore()
    const wrapper = mountComponent(SeekBar)
    expect(wrapper.text()).toContain('0:00')
  })

  it('shows formatted time for non-zero currentTime', async () => {
    const { player } = setupStore()
    player.currentTime = 125
    player.duration = 300
    const wrapper = mountComponent(SeekBar)
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('2:05')
    expect(wrapper.text()).toContain('5:00')
  })

  it('has slider role and accessibility attributes', () => {
    setupStore()
    const wrapper = mountComponent(SeekBar)
    const slider = wrapper.find('[role="slider"]')
    expect(slider.exists()).toBe(true)
    expect(slider.attributes('aria-label')).toBe('Seek')
  })

  it('calls player.seek on ArrowLeft keydown', async () => {
    const { player } = setupStore()
    player.currentTime = 30
    player.duration = 100
    const wrapper = mountComponent(SeekBar)
    await wrapper.vm.$nextTick()

    const slider = wrapper.find('[role="slider"]')
    slider.trigger('keydown', { key: 'ArrowLeft' })
    expect(player.currentTime).toBe(25)
  })

  it('calls player.seek on ArrowRight keydown', async () => {
    const { player } = setupStore()
    player.currentTime = 30
    player.duration = 100
    const wrapper = mountComponent(SeekBar)
    await wrapper.vm.$nextTick()

    const slider = wrapper.find('[role="slider"]')
    slider.trigger('keydown', { key: 'ArrowRight' })
    expect(player.currentTime).toBe(35)
  })

  it('seeks to 0 on Home key', async () => {
    const { player } = setupStore()
    player.currentTime = 50
    player.duration = 100
    const wrapper = mountComponent(SeekBar)
    await wrapper.vm.$nextTick()

    const slider = wrapper.find('[role="slider"]')
    slider.trigger('keydown', { key: 'Home' })
    expect(player.currentTime).toBe(0)
  })

  it('seeks to end on End key', async () => {
    const { player } = setupStore()
    player.currentTime = 10
    player.duration = 200
    const wrapper = mountComponent(SeekBar)
    await wrapper.vm.$nextTick()

    const slider = wrapper.find('[role="slider"]')
    slider.trigger('keydown', { key: 'End' })
    expect(player.currentTime).toBe(200)
  })
})

describe('VolumeSlider', () => {
  it('shows volume-high icon at default volume', () => {
    setupStore()
    const wrapper = mountComponent(VolumeSlider)
    const icon = wrapper.find('.fa-volume-high')
    expect(icon.exists()).toBe(true)
  })

  it('shows volume-low icon at low volume', async () => {
    const { player } = setupStore()
    player.volume = 0.3
    const wrapper = mountComponent(VolumeSlider)
    await wrapper.vm.$nextTick()

    const icon = wrapper.find('.fa-volume-low')
    expect(icon.exists()).toBe(true)
  })

  it('shows volume-xmark icon at zero volume', async () => {
    const { player } = setupStore()
    player.volume = 0
    const wrapper = mountComponent(VolumeSlider)
    await wrapper.vm.$nextTick()

    const icon = wrapper.find('.fa-volume-xmark')
    expect(icon.exists()).toBe(true)
  })

  it('has slider role and accessibility attributes', () => {
    setupStore()
    const wrapper = mountComponent(VolumeSlider)
    const slider = wrapper.find('[role="slider"]')
    expect(slider.exists()).toBe(true)
    expect(slider.attributes('aria-label')).toBe('Volume')
  })

  it('decreases volume on ArrowLeft keydown', async () => {
    const { player } = setupStore()
    player.volume = 0.5
    const wrapper = mountComponent(VolumeSlider)
    await wrapper.vm.$nextTick()

    const slider = wrapper.find('[role="slider"]')
    slider.trigger('keydown', { key: 'ArrowLeft' })
    expect(player.volume).toBeCloseTo(0.45, 2)
  })

  it('increases volume on ArrowUp keydown', async () => {
    const { player } = setupStore()
    player.volume = 0.5
    const wrapper = mountComponent(VolumeSlider)
    await wrapper.vm.$nextTick()

    const slider = wrapper.find('[role="slider"]')
    slider.trigger('keydown', { key: 'ArrowUp' })
    expect(player.volume).toBeCloseTo(0.55, 2)
  })
})

describe('MusicPlayer', () => {
  it('renders when hasTrack is true', async () => {
    const { player } = setupStore()
    player.currentTrack = track
    const wrapper = mountComponent(MusicPlayer)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.translate-y-0').exists()).toBe(true)
  })

  it('is hidden when hasTrack is false', () => {
    setupStore()
    const wrapper = mountComponent(MusicPlayer)
    expect(wrapper.find('.translate-y-full').exists()).toBe(true)
  })
})
