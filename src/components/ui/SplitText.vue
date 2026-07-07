<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { kineticReveal } from '@/animations/splitText'

interface Props {
  text: string
  as?: string
  by?: 'words' | 'chars' | 'lines'
  delay?: number
  scrollTrigger?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  as: 'div',
  by: 'words',
  delay: 0,
  scrollTrigger: true
})

const rootEl = ref<HTMLElement | null>(null)
let splitInstance: ReturnType<typeof kineticReveal> | null = null

onMounted(() => {
  if (!rootEl.value) return
  splitInstance = kineticReveal(rootEl.value, {
    by: props.by,
    delay: props.delay,
    scrollTrigger: props.scrollTrigger
  })
})

onBeforeUnmount(() => {
  splitInstance?.revert()
})
</script>

<template>
  <component :is="as" ref="rootEl" class="split-text">{{ text }}</component>
</template>

<style scoped>
.split-text {
  overflow: hidden;
}
</style>
