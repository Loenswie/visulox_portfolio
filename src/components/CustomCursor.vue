<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { useCustomCursor } from '@/composables/useCustomCursor'

const { state } = useCustomCursor()
const cursorEl = ref<HTMLElement | null>(null)

let quickX: ReturnType<typeof gsap.quickSetter> | null = null
let quickY: ReturnType<typeof gsap.quickSetter> | null = null

function onMove(e: PointerEvent) {
  quickX?.(e.clientX)
  quickY?.(e.clientY)
}

onMounted(() => {
  if (!cursorEl.value) return
  // xPercent/yPercent centering (recalculated against current size) so growing to 64px on hover stays centered.
  gsap.set(cursorEl.value, { xPercent: -50, yPercent: -50, rotation: 45 })

  // quickSetter, not quickTo — an actual tween (even at duration: 0) can drop
  // renders under rapid pointermove calls. This just writes the transform directly.
  quickX = gsap.quickSetter(cursorEl.value, 'x', 'px')
  quickY = gsap.quickSetter(cursorEl.value, 'y', 'px')
  window.addEventListener('pointermove', onMove, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onMove)
})
</script>

<template>
  <div
    ref="cursorEl"
    class="custom-cursor"
    :class="`custom-cursor--${state.variant}`"
    aria-hidden="true"
  >
    <span class="custom-cursor__label">{{ state.label }}</span>
  </div>
</template>
