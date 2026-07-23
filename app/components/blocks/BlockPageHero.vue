<template>
  <UPageHero
    :title="title"
    :description="description"
    :headline="headline"
    :orientation="orientation"
  />
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  description?: string
  headline?: string
  orientation?: 'vertical' | 'horizontal'
}>(), {
  title: 'Your Page Title',
  description: 'A compelling description for your hero section',
  headline: '',
  orientation: 'vertical',
})
</script>
