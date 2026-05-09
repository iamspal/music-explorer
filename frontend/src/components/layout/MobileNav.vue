<template>
  <nav
    class="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-spotify-black/95 backdrop-blur-md border-t border-white/5 flex items-center justify-around py-2 safe-bottom"
  >
    <RouterLink
      v-for="item in navItemsWithClasses"
      :key="item.to"
      :to="item.to"
      class="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
      :class="item.classes"
    >
      <span class="text-lg"><i :class="item.icon" aria-hidden="true"></i></span>
      <span class="text-[10px] font-medium">{{ t(item.labelKey) }}</span>
    </RouterLink>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { NAV_ITEMS } from '@/utils/constants'
import { isActiveRoute } from '@/utils/helper.js'

const { t } = useI18n()
const route = useRoute()

const navItemsWithClasses = computed(() =>
  NAV_ITEMS.map((item) => ({
    ...item,
    classes: isActiveRoute(route.path, item.to) ? 'text-spotify-green' : 'text-spotify-text-secondary',
  })),
)
</script>
