<template>
  <div>
    <div v-for="i in count" :key="i" :class="skel.container">
      <div :class="skel.thumb"></div>
      <div :class="skel.lines">
        <div :class="skel.line1"></div>
        <div v-if="skel.line2" :class="skel.line2"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: { type: String, default: 'card' },
  count: { type: Number, default: 6 },
})

const skeletonTypes = {
  card: {
    container: 'flex flex-col gap-3 p-3',
    thumb: 'aspect-square w-full rounded-lg bg-spotify-surface animate-pulse',
    lines: 'space-y-2',
    line1: 'h-4 w-3/4 rounded bg-spotify-surface animate-pulse',
    line2: 'h-3 w-1/2 rounded bg-spotify-surface animate-pulse',
  },
  list: {
    container: 'flex items-center gap-3 px-4 py-2',
    thumb: 'size-10 rounded bg-spotify-surface animate-pulse shrink-0',
    lines: 'flex-1 space-y-2',
    line1: 'h-4 w-2/3 rounded bg-spotify-surface animate-pulse',
    line2: 'h-3 w-1/3 rounded bg-spotify-surface animate-pulse',
  },
  hero: {
    container: 'flex flex-col items-center gap-4 p-8',
    thumb: 'size-48 rounded-xl bg-spotify-surface animate-pulse',
    lines: 'w-full max-w-md space-y-3 text-center',
    line1: 'h-8 w-2/3 mx-auto rounded bg-spotify-surface animate-pulse',
    line2: 'h-4 w-1/2 mx-auto rounded bg-spotify-surface animate-pulse',
  },
}

const skel = computed(() => skeletonTypes[props.type] ?? skeletonTypes.card)
</script>
