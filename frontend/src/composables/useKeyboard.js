import { onMounted, onUnmounted } from 'vue'
import { usePlayerStore } from '@/stores/usePlayerStore'

export function useKeyboard() {
  const player = usePlayerStore()

  function handleKeydown(e) {
    const target = e.target
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return
    }

    switch (e.code) {
      case 'Space':
        e.preventDefault()
        player.togglePlay()
        break
      case 'ArrowLeft':
        e.preventDefault()
        player.seek(Math.max(0, player.currentTime - 5))
        break
      case 'ArrowRight':
        e.preventDefault()
        player.seek(Math.min(player.duration, player.currentTime + 5))
        break
      case 'ArrowUp':
        e.preventDefault()
        player.setVolume(player.volume + 0.05)
        break
      case 'ArrowDown':
        e.preventDefault()
        player.setVolume(player.volume - 0.05)
        break
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
}
