<template>
  <img
    :src="src"
    :alt="alt"
    :class="['max-w-full', { 'rounded-lg': rounded }]"
  >
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  src?: string
  alt?: string
  rounded?: boolean
}>(), {
  src: 'https://placehold.co/800x400',
  alt: '',
  rounded: false,
})
</script>
