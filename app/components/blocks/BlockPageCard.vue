<template>
  <UPageCard
    :title="title"
    :description="description"
    :to="to"
  />
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  description?: string
  to?: string
}>(), {
  title: 'Card Title',
  description: 'Card description goes here.',
  to: '',
})
</script>
