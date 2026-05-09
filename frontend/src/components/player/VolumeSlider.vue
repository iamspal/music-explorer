<template>
  <div class="flex items-center gap-2 min-w-[120px]">
    <button
      class="text-spotify-text-secondary hover:text-white transition-colors text-sm"
      @click="player.setVolume(volume === 0 ? 0.7 : 0)"
      :aria-label="volume === 0 ? t('player.unmute') : t('player.mute')"
    >
      <i :class="volumeIcon" aria-hidden="true"></i>
    </button>
    <div
      ref="barRef"
      class="flex-1 h-5 flex items-center cursor-pointer group"
      role="slider"
      tabindex="0"
      :aria-valuenow="Math.round(volume * 100)"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-label="t('player.volume')"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @keydown="onKeydown"
    >
      <div class="w-full h-1 rounded-full bg-spotify-surface relative">
        <div
          class="absolute left-0 top-0 h-full rounded-full bg-spotify-text-secondary group-hover:bg-spotify-green transition-colors"
          :style="{ width: `${volume * 100}%` }"
        >
          <div
            class="absolute right-0 top-1/2 -translate-y-1/2 size-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
            :class="{ 'opacity-100': isDragging }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { clamp } from '../../utils/helper.js'

const { t } = useI18n()
const player = usePlayerStore()
const { volume } = storeToRefs(player)

const barRef = ref(null)
const isDragging = ref(false)

const volumeIcon = computed(() => {
  if (volume.value === 0) return 'fa-solid fa-volume-xmark'
  if (volume.value < 0.5) return 'fa-solid fa-volume-low'
  return 'fa-solid fa-volume-high'
})

function getVolume(e) {
  if (!barRef.value) return player.volume
  const rect = barRef.value.getBoundingClientRect()
  return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
}

function onPointerDown(e) {
  e.target.setPointerCapture(e.pointerId)
  isDragging.value = true
  player.setVolume(getVolume(e))
}

function onPointerMove(e) {
  if (!isDragging.value) return
  player.setVolume(getVolume(e))
}

function onPointerUp() {
  isDragging.value = false
}

const VOLUME_STEP = 0.05
const volumeActions = {
  ArrowLeft: -VOLUME_STEP,
  ArrowDown: -VOLUME_STEP,
  ArrowRight: VOLUME_STEP,
  ArrowUp: VOLUME_STEP,
}

function setVolume(value) {
  player.setVolume(clamp(value, 0, 1))
}

function onKeydown(event) {
  const change = volumeActions[event.key]
  if (change === null) return
  event.preventDefault()
  setVolume(volume.value + change)
}
</script>
