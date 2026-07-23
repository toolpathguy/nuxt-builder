<template>
  <UButton
    :label="label"
    :to="to"
    :color="color"
    :variant="variant"
    :size="size"
  />
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  label?: string
  to?: string
  color?: 'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'error'
  variant?: 'solid' | 'outline' | 'soft' | 'subtle' | 'ghost' | 'link'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}>(), {
  label: 'Click Me',
  to: '#',
  color: 'primary',
  variant: 'solid',
  size: 'md',
})
</script>
