<template>
  <UPageFeature
    :title="title"
    :description="description"
    :icon="icon"
    :orientation="orientation"
  />
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  description?: string
  icon?: string
  orientation?: 'vertical' | 'horizontal'
}>(), {
  title: 'Feature Title',
  description: 'Describe this feature and its benefits.',
  icon: 'i-lucide-star',
  orientation: 'vertical',
})
</script>
