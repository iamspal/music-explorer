<template>
  <div class="mb-4">
    <h2 class="text-xl lg:text-2xl font-bold text-white tracking-tight">{{ title }}</h2>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
})
</script>
