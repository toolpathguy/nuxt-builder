<template>
  <USeparator
    :orientation="orientation"
    :label="label"
  />
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  orientation?: 'horizontal' | 'vertical'
  label?: string
}>(), {
  orientation: 'horizontal',
  label: '',
})
</script>
