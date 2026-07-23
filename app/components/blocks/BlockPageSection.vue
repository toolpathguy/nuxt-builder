<template>
  <UPageSection
    :title="title"
    :description="description"
    :headline="headline"
    :orientation="orientation"
    :reverse="reverse"
  >
    <slot />
  </UPageSection>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  description?: string
  headline?: string
  orientation?: 'vertical' | 'horizontal'
  reverse?: boolean
}>(), {
  title: 'Section Title',
  description: '',
  headline: '',
  orientation: 'vertical',
  reverse: false,
})
</script>
