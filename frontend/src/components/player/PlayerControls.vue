<template>
  <div class="flex items-center justify-center gap-3 lg:gap-6">
    <button
      class="text-xs lg:text-sm transition-colors hidden sm:block"
      :class="shuffleButtonClass"
      @click="player.toggleShuffle()"
      :aria-label="t('player.toggleShuffle')"
    >
      <i class="fa-solid fa-shuffle" aria-hidden="true"></i>
    </button>

    <button
      class="text-spotify-text-secondary hover:text-white transition-colors text-base lg:text-lg"
      @click="player.previous()"
      :aria-label="t('player.previousTrack')"
    >
      <i class="fa-solid fa-backward-step" aria-hidden="true"></i>
    </button>

    <button
      class="size-8 lg:size-10 rounded-full bg-white flex items-center justify-center text-black hover:scale-105 transition-transform"
      @click="player.togglePlay()"
      :aria-label="isPlaying ? t('common.pause') : t('common.play')"
    >
      <i class="text-sm lg:text-base" :class="playIconClass" aria-hidden="true"></i>
    </button>

    <button
      class="text-spotify-text-secondary hover:text-white transition-colors text-base lg:text-lg"
      @click="player.next()"
      :aria-label="t('player.nextTrack')"
    >
      <i class="fa-solid fa-forward-step" aria-hidden="true"></i>
    </button>

    <button
      class="text-xs lg:text-sm transition-colors relative hidden sm:block"
      :class="repeatButtonClass"
      @click="player.cycleRepeat()"
      :aria-label="repeatMode === REPEAT_MODES.ONE ? t('player.repeatOne') : repeatMode === REPEAT_MODES.ALL ? t('player.repeatAll') : t('player.repeatOff')"
    >
      <i class="fa-solid fa-repeat" aria-hidden="true"></i>
      <span
        v-if="repeatMode === REPEAT_MODES.ONE"
        class="absolute -top-1 -right-1 text-[8px] font-bold"
      >
        1
      </span>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { storeToRefs } from 'pinia'
import { REPEAT_MODES } from '@/utils/constants'

const { t } = useI18n()
const player = usePlayerStore()
const { isPlaying, isShuffled, repeatMode } = storeToRefs(player)

const shuffleButtonClass = computed(() =>
  isShuffled.value ? 'text-spotify-green' : 'text-spotify-text-secondary hover:text-white',
)

const playIconClass = computed(() =>
  isPlaying.value ? 'fas fa-pause' : 'fas fa-play ml-0.5',
)

const repeatButtonClass = computed(() =>
  repeatMode.value !== REPEAT_MODES.OFF
    ? 'text-spotify-green'
    : 'text-spotify-text-secondary hover:text-white',
)
</script>
