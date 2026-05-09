<template>
  <header
    class="sticky top-0 z-10 flex items-center justify-between px-4 lg:px-6 py-3 bg-spotify-black/80 backdrop-blur-md"
  >
    <!-- Left: Nav buttons -->
    <div class="flex items-center gap-2">
      <button
        class="size-8 rounded-full bg-spotify-black/60 items-center justify-center text-white hover:bg-spotify-surface transition-colors hidden lg:flex cursor-pointer"
        @click="goBack"
        :aria-label="t('layout.goBack')"
      >
        <i class="fas fa-chevron-left text-xs" aria-hidden="true"></i>
      </button>
      <button
        class="size-8 rounded-full bg-spotify-black/60 items-center justify-center text-white hover:bg-spotify-surface transition-colors hidden lg:flex cursor-pointer"
        @click="goForward"
        :aria-label="t('layout.goForward')"
      >
        <i class="fas fa-chevron-right text-xs" aria-hidden="true"></i>
      </button>

      <!-- Mobile menu toggle -->
      <button
        class="size-8 rounded-full bg-spotify-black/60 flex items-center justify-center text-white lg:hidden cursor-pointer"
        @click="app.toggleMobileMenu()"
        :aria-label="app.mobileMenuOpen ? t('layout.closeMenu') : t('layout.openMenu')"
      >
        <i class="fas fa-bars text-sm" aria-hidden="true"></i>
      </button>
    </div>

    <!-- Right: spacer for layout balance -->
    <div aria-hidden="true"></div>
  </header>
</template>

<script setup>
import { useAppStore } from '@/stores/useAppStore'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const app = useAppStore()
const router = useRouter()

function goBack() {
  router.back()
}

function goForward() {
  router.forward()
}
</script>
