<template>
  <!-- eslint-disable-next-line vue/no-v-html -- trusted author-only content (Req 12.6) -->
  <div :class="['prose max-w-none', alignClass]" v-html="body" />
</template>

<!-- NOTE: v-html is intentional per Req 12.6. RichText body content is
     trusted-author-only (set via the property panel by the page builder).
     If RichText ever accepts external/user-submitted content, add
     sanitization (e.g. DOMPurify) before binding. -->

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  body?: string
  align?: 'left' | 'center' | 'right'
}>(), {
  body: 'Enter your content here.',
  align: 'left',
})

const alignClass = computed(() => ({
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}[props.align]))
</script>
