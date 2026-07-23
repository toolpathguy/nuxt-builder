<template>
  <UPageCTA
    :title="title"
    :description="description"
    :headline="headline"
  />
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  description?: string
  headline?: string
}>(), {
  title: 'Ready to Get Started?',
  description: 'Start building your next project today.',
  headline: '',
})
</script>
