<template>
  <button class="inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 select-none px-4 py-2 text-sm bg-spotify-green text-black hover:bg-spotify-green-light active:scale-[0.98]" :class="buttonClasses" :disabled="disabled">
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  disabled: { type: Boolean, default: false },
  rounded: { type: Boolean, default: false },
})

const buttonClasses = computed(() => [
  props.rounded ? 'rounded-full' : 'rounded-lg',
  props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
])
</script>
