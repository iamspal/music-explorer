<template>
  <div class="fixed left-0 right-0 z-30 bg-spotify-black/95 backdrop-blur-lg border-t border-white/10 transition-all duration-300 bottom-16 lg:bottom-0" :class="playerContainerClasses">
    <!-- SeekBar: top on mobile, integrated on desktop -->
    <SeekBar class="lg:hidden px-2 pt-2 pb-0.5" />

    <!-- Player row: 3 equal columns so center is perfectly centered -->
    <div class="flex items-center gap-2 lg:gap-4 px-3 lg:px-4 py-2 lg:py-3">
      <div class="flex-1 min-w-0">
        <NowPlaying />
      </div>
      <div class="flex-1 flex flex-col items-center gap-0.5 lg:gap-1 max-w-[722px]">
        <PlayerControls />
        <SeekBar class="hidden lg:flex w-full" />
      </div>
      <div class="flex-1 hidden lg:flex justify-end">
        <VolumeSlider />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { storeToRefs } from 'pinia'
import NowPlaying from './NowPlaying.vue'
import PlayerControls from './PlayerControls.vue'
import SeekBar from './SeekBar.vue'
import VolumeSlider from './VolumeSlider.vue'

const player = usePlayerStore()
const { hasTrack } = storeToRefs(player)

const playerContainerClasses = computed(() =>
  hasTrack.value ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none',
)
</script>
