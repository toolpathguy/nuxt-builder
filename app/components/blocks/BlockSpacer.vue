<template>
  <div :class="heightClass" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg'
}>(), {
  size: 'md',
})

const heightClass = computed(() => ({
  sm: 'h-8',
  md: 'h-16',
  lg: 'h-32',
}[props.size]))
</script>
