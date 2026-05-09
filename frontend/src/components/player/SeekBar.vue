<template>
  <div class="flex items-center gap-2 w-full max-w-[600px] mx-auto">
    <span class="text-[11px] text-spotify-text-secondary w-10 text-right tabular-nums select-none">
      {{ formatDuration(currentTime) }}
    </span>

    <div
      ref="barRef"
      class="flex-1 h-5 flex items-center cursor-pointer group seek-bar"
      role="slider"
      tabindex="0"
      :aria-valuenow="Math.round(currentTime)"
      aria-valuemin="0"
      :aria-valuemax="Math.round(duration)"
      :aria-label="t('player.seek')"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @keydown="onKeydown"
    >
      <div class="w-full h-1 rounded-full bg-spotify-surface relative">
        <div
          class="absolute left-0 top-0 h-full rounded-full bg-spotify-text-secondary group-hover:bg-spotify-green transition-colors"
          :style="{ width: `${progressPercent}%` }"
        >
          <div
            class="absolute right-0 top-1/2 -translate-y-1/2 size-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
            :class="{ 'opacity-100': isDragging }"
          ></div>
        </div>
      </div>
    </div>

    <span class="text-[11px] text-spotify-text-secondary w-10 tabular-nums select-none">
      {{ formatDuration(duration) }}
    </span>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { storeToRefs } from 'pinia'
import { formatDuration } from '@/utils/format'
import { ref, computed } from 'vue'
import { clamp } from '../../utils/helper.js'

const { t } = useI18n()
const player = usePlayerStore()
const { currentTime, duration } = storeToRefs(player)

const barRef = ref(null)
const isDragging = ref(false)

const progressPercent = computed(() => {
  if (!duration.value) return 0
  return (currentTime.value / duration.value) * 100
})

function getSeekTime(e) {
  if (!barRef.value || !duration.value) return 0
  const rect = barRef.value.getBoundingClientRect()
  const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
  return (x / rect.width) * duration.value
}

function onPointerDown(e) {
  e.target.setPointerCapture(e.pointerId)
  isDragging.value = true
  player.seek(getSeekTime(e))
}

function onPointerMove(e) {
  if (!isDragging.value) return
  player.seek(getSeekTime(e))
}

function onPointerUp() {
  isDragging.value = false
}

const SEEK_STEP = 5
const keyActions = {
  ArrowLeft: () => currentTime.value - SEEK_STEP,
  ArrowDown: () => currentTime.value - SEEK_STEP,
  ArrowRight: () => currentTime.value + SEEK_STEP,
  ArrowUp: () => currentTime.value + SEEK_STEP,
  Home: () => 0,
  End: () => duration.value,
}

function seekTo(time) {
  player.seek(clamp(time, 0, duration.value))
}

function onKeydown(event) {
  const getNextTime = keyActions[event.key]
  if (!getNextTime) return
  event.preventDefault()
  seekTo(getNextTime())
}
</script>
