<template>
  <div class="min-h-screen bg-spotify-black">
    <!-- Skip to content -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-spotify-green focus:text-black focus:rounded-full focus:text-sm focus:font-medium"
    >
      {{ t('layout.skipToContent') }}
    </a>
    <AppSidebar />
    <AppTopBar />

    <!-- Overlay when mobile sidebar open -->
    <Transition name="fade">
      <div
        v-if="app.mobileMenuOpen"
        class="fixed inset-0 z-25 bg-black/60 lg:hidden"
        @click="app.closeMobileMenu()"
      />
    </Transition>

    <!-- Main content area -->
    <main id="main-content" class="min-h-screen transition-all duration-300" :class="mainClasses">
      <RouterView v-slot="{ Component }">
        <Transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <MusicPlayer />
    <MobileNav />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/useAppStore'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { storeToRefs } from 'pinia'
import AppSidebar from './AppSidebar.vue'
import AppTopBar from './AppTopBar.vue'
import MobileNav from './MobileNav.vue'
import MusicPlayer from '@/components/player/MusicPlayer.vue'
import { useKeyboard } from '@/composables/useKeyboard'

const { t } = useI18n()
const app = useAppStore()
const player = usePlayerStore()
const { sidebarCollapsed } = storeToRefs(app)
const { hasTrack } = storeToRefs(player)

const mainClasses = computed(() => [
  sidebarCollapsed.value ? 'lg:ml-[72px]' : 'lg:ml-60',
  hasTrack.value ? 'pb-36 lg:pb-24' : 'pb-20 lg:pb-8',
])

useKeyboard()
</script>
