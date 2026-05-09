import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { REPEAT_MODES } from '@/utils/constants'

export const usePlayerStore = defineStore('player', () => {
  const audio = new Audio()
  audio.volume = 0.7

  const currentTrack = ref(null)
  const queue = ref([])
  const isPlaying = ref(false)
  const volume = ref(0.7)
  const currentTime = ref(0)
  const duration = ref(0)
  const isShuffled = ref(false)
  const repeatMode = ref(REPEAT_MODES.OFF)

  const hasTrack = computed(() => !!currentTrack.value)

  function setAudioEvents() {
    audio.ontimeupdate = () => {
      currentTime.value = audio.currentTime
    }
    audio.onloadedmetadata = () => {
      duration.value = audio.duration
    }
    audio.onended = () => {
      handleTrackEnd()
    }
    audio.onerror = () => {
      isPlaying.value = false
      if (queue.value.length > 0) {
        next()
      }
    }
  }

  setAudioEvents()

  async function playTrack(track) {
    if (!track?.preview) return

    if (currentTrack.value?.id !== track.id) {
      currentTrack.value = track
      audio.src = track.preview
      try {
        await audio.play()
        isPlaying.value = true
      } catch {
        isPlaying.value = false
      }
    } else {
      togglePlay()
    }
  }

  async function togglePlay() {
    if (!currentTrack.value) return
    if (isPlaying.value) {
      audio.pause()
      isPlaying.value = false
    } else {
      try {
        await audio.play()
        isPlaying.value = true
      } catch {
        isPlaying.value = false
      }
    }
  }

  function playQueue(tracks, startIndex = 0) {
    queue.value = [...tracks]
    const track = queue.value[startIndex]
    if (track) {
      playTrack(track)
    }
  }

  async function next() {
    if (queue.value.length === 0) return
    const currentIndex = queue.value.findIndex((t) => t.id === currentTrack.value?.id)

    if (repeatMode.value === REPEAT_MODES.ONE) {
      audio.currentTime = 0
      try {
        await audio.play()
      } catch {
        isPlaying.value = false
      }
      return
    }

    let nextIndex
    if (isShuffled.value) {
      if (queue.value.length === 1) {
        nextIndex = 0
      } else {
        do {
          nextIndex = Math.floor(Math.random() * queue.value.length)
        } while (nextIndex === currentIndex)
      }
    } else {
      nextIndex = currentIndex + 1
    }

    if (nextIndex >= queue.value.length) {
      if (repeatMode.value === REPEAT_MODES.ALL) {
        nextIndex = 0
      } else {
        isPlaying.value = false
        return
      }
    }

    const nextTrack = queue.value[nextIndex]
    if (nextTrack) {
      currentTrack.value = nextTrack
      audio.src = nextTrack.preview
      try {
        await audio.play()
        isPlaying.value = true
      } catch {
        isPlaying.value = false
      }
    }
  }

  async function previous() {
    if (queue.value.length === 0) return
    if (currentTime.value > 3) {
      audio.currentTime = 0
      return
    }
    const currentIndex = queue.value.findIndex((t) => t.id === currentTrack.value?.id)
    const prevIndex = currentIndex <= 0 ? queue.value.length - 1 : currentIndex - 1
    const prevTrack = queue.value[prevIndex]
    if (prevTrack) {
      currentTrack.value = prevTrack
      audio.src = prevTrack.preview
      try {
        await audio.play()
        isPlaying.value = true
      } catch {
        isPlaying.value = false
      }
    }
  }

  function seek(time) {
    audio.currentTime = time
    currentTime.value = time
  }

  function setVolume(val) {
    const v = Math.max(0, Math.min(1, val))
    volume.value = v
    audio.volume = v
  }

  function toggleShuffle() {
    isShuffled.value = !isShuffled.value
  }

  function cycleRepeat() {
    const modes = [REPEAT_MODES.OFF, REPEAT_MODES.ALL, REPEAT_MODES.ONE]
    const currentIndex = modes.indexOf(repeatMode.value)
    repeatMode.value = modes[(currentIndex + 1) % modes.length]
  }

  function handleTrackEnd() {
    next()
  }

  return {
    currentTrack,
    queue,
    isPlaying,
    volume,
    currentTime,
    duration,
    isShuffled,
    repeatMode,
    hasTrack,
    playTrack,
    togglePlay,
    playQueue,
    next,
    previous,
    seek,
    setVolume,
    toggleShuffle,
    cycleRepeat,
  }
})
