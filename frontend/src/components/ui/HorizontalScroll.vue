<template>
  <div class="relative group/scroll">
    <button
      v-show="canScrollLeft"
      class="absolute left-0 top-0 bottom-0 z-10 w-10 bg-spotify-black/60 backdrop-blur-sm opacity-0 group-hover/scroll:opacity-100 focus-visible:opacity-100 transition-opacity rounded-l-lg flex items-center justify-center cursor-pointer"
      @click="scroll('left')"
      :aria-label="t('ui.scrollLeft')"
    >
      <i class="fas fa-chevron-left text-white text-lg" aria-hidden="true"></i>
    </button>

    <div
      ref="scrollContainer"
      class="flex gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      @scroll="checkScroll"
    >
      <slot />
    </div>

    <button
      v-show="canScrollRight"
      class="absolute right-0 top-0 bottom-0 z-10 w-10 bg-spotify-black/60 backdrop-blur-sm opacity-0 group-hover/scroll:opacity-100 focus-visible:opacity-100 transition-opacity rounded-r-lg flex items-center justify-center cursor-pointer"
      @click="scroll('right')"
      :aria-label="t('ui.scrollRight')"
    >
      <i class="fas fa-chevron-right text-white text-lg" aria-hidden="true"></i>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const scrollContainer = ref(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

function checkScroll() {
  if (!scrollContainer.value) return
  const el = scrollContainer.value
  canScrollLeft.value = el.scrollLeft > 0
  canScrollRight.value = el.scrollLeft < el.scrollWidth - el.clientWidth - 1
}

function scroll(direction) {
  if (!scrollContainer.value) return
  const el = scrollContainer.value
  const scrollAmount = el.clientWidth * 0.75
  el.scrollBy({
    left: direction === 'left' ? -scrollAmount : scrollAmount,
    behavior: 'smooth',
  })
}

let resizeObserver = null

onMounted(() => {
  checkScroll()
  resizeObserver = new ResizeObserver(checkScroll)
  if (scrollContainer.value) {
    resizeObserver.observe(scrollContainer.value)
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})
</script>
