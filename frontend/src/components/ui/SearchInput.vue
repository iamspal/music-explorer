<template>
  <div class="relative w-full">
    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-spotify-text-tertiary">
      <i class="fas fa-search text-sm" aria-hidden="true"></i>
    </span>
    <input
      v-model="inputValue"
      type="text"
      :placeholder="placeholder || t('ui.searchPlaceholder')"
      class="w-full bg-spotify-surface text-white placeholder-spotify-text-tertiary rounded-full py-2.5 pl-10 pr-10 text-sm outline-none ring-1 ring-transparent focus:ring-spotify-green transition-all duration-200"
      @input="onInput"
      @keydown="onKeydown"
    />
    <button
      v-if="inputValue"
      class="absolute right-3 top-1/2 -translate-y-1/2 text-spotify-text-tertiary hover:text-white transition-colors"
      @click="onClear"
      :aria-label="t('ui.clearSearch')"
    >
      <i class="fas fa-times text-xs" aria-hidden="true"></i>
    </button>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  debounceMs: { type: Number, default: 300 },
})

const emit = defineEmits(['update:modelValue', 'search'])

const inputValue = ref(props.modelValue)
let debounceTimer = null

watch(
  () => props.modelValue,
  (val) => {
    inputValue.value = val
  },
)

function onInput(e) {
  const val = e.target.value
  inputValue.value = val
  emit('update:modelValue', val)

  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emit('search', val)
  }, props.debounceMs)
}

function onClear() {
  inputValue.value = ''
  emit('update:modelValue', '')
  clearTimeout(debounceTimer)
  emit('search', '')
}

function onKeydown(e) {
  if (e.key === 'Escape') {
    onClear()
    e.target.blur()
  }
}

onUnmounted(() => {
  clearTimeout(debounceTimer)
})
</script>
