<template>
  <aside class="fixed left-0 top-0 bottom-0 z-30 flex flex-col bg-spotify-black border-r border-white/5 transition-all duration-300 overflow-hidden w-60" :class="asideClasses">
    <!-- Logo -->
    <RouterLink to="/" class="flex items-center gap-3 px-6 py-5 shrink-0 hover:opacity-80 transition-opacity" @click="app.closeMobileMenu()">
      <div class="size-10 bg-spotify-green rounded-full flex items-center justify-center shrink-0">
        <i class="fas fa-music text-black text-lg" aria-hidden="true"></i>
      </div>
      <span
        v-show="!sidebarCollapsed || mobileMenuOpen"
        class="text-lg font-bold tracking-tight text-white whitespace-nowrap"
      >
        {{ t('common.musicExplorer') }}
      </span>
    </RouterLink>

    <!-- Nav Links -->
    <nav class="px-3 py-2 space-y-1 shrink-0">
      <RouterLink
        v-for="item in navItemsWithClasses"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group cursor-pointer"
        :class="item.classes"
        :aria-current="item.active ? 'page' : undefined"
        @click="app.closeMobileMenu()"
      >
        <span class="text-lg w-5 text-center shrink-0">
          <i :class="item.icon" aria-hidden="true"></i>
        </span>
        <span
          v-show="!sidebarCollapsed || mobileMenuOpen"
          class="text-sm font-medium whitespace-nowrap"
        >
          {{ t(item.labelKey) }}
        </span>
        <span
          v-if="item.to === '/favorites' && favoriteCount > 0"
          class="ml-auto text-xs text-spotify-text-tertiary"
        >
          {{ favoriteCount }}
        </span>
      </RouterLink>
    </nav>

    <!-- Spacer -->
    <div class="flex-1"></div>

    <!-- Collapse Toggle (desktop only) -->
    <button
      class="mx-auto mb-4 size-8 rounded-full bg-spotify-surface items-center justify-center text-spotify-text-secondary hover:text-white transition-colors shrink-0 hidden lg:flex cursor-pointer"
      @click="app.toggleSidebar()"
      :aria-label="sidebarCollapsed ? t('layout.expandSidebar') : t('layout.collapseSidebar')"
    >
      <i
        :class="collapseIconClass"
        aria-hidden="true"
      ></i>
    </button>
  </aside>
</template>

<script setup>
import { useAppStore } from '@/stores/useAppStore'
import { useLibraryStore } from '@/stores/useLibraryStore'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NAV_ITEMS } from '@/utils/constants'
import {isActiveRoute} from "@/utils/helper.js";

const { t } = useI18n()
const app = useAppStore()
const library = useLibraryStore()
const { sidebarCollapsed, mobileMenuOpen } = storeToRefs(app)
const { favoriteCount } = storeToRefs(library)
const route = useRoute()

const asideClasses = computed(() => [
  sidebarCollapsed.value ? 'lg:w-[72px]' : 'lg:w-60',
  mobileMenuOpen.value ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
])

const collapseIconClass = computed(() =>
  sidebarCollapsed.value ? 'fas fa-chevron-right text-xs' : 'fas fa-chevron-left text-xs',
)

const navItemsWithClasses = computed(() =>
  NAV_ITEMS.map((item) => {
    const active = isActiveRoute(route.path, item.to)
    return {
      ...item,
      active,
      classes: active
        ? 'bg-spotify-surface text-white'
        : 'text-spotify-text-secondary hover:text-white hover:bg-spotify-surface',
    }
  }),
)
</script>
