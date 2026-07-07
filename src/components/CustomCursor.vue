<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { useCustomCursor } from '@/composables/useCustomCursor'

const { state } = useCustomCursor()
const cursorEl = ref<HTMLElement | null>(null)

let quickX: ReturnType<typeof gsap.quickTo> | null = null
let quickY: ReturnType<typeof gsap.quickTo> | null = null

function onMove(e: PointerEvent) {
  quickX?.(e.clientX)
  quickY?.(e.clientY)
}

onMounted(() => {
  if (!cursorEl.value) return
  // Center the dot on the pointer via GSAP's own xPercent/yPercent (recalculated
  // against the element's current size), so it stays correctly centered even
  // when the "hover" state grows the dot to 64px. Doing the centering as a
  // static CSS `transform: translate(-50%,-50%)` instead would fight with the
  // x/y tween below and was the root cause of the cursor feeling off and laggy.
  // rotation: 45 turns the square dot into a diamond, managed by GSAP so it
  // composes cleanly with the xPercent/yPercent centering and the x/y tween.
  gsap.set(cursorEl.value, { xPercent: -50, yPercent: -50, rotation: 45 })

  // Short duration = the cursor keeps up with the pointer instead of trailing
  // it noticeably. Still uses GSAP's quickTo (rAF-batched, transform-only)
  // so it stays cheap rather than writing inline styles on every move.
  quickX = gsap.quickTo(cursorEl.value, 'x', { duration: 0.18, ease: 'power3.out' })
  quickY = gsap.quickTo(cursorEl.value, 'y', { duration: 0.18, ease: 'power3.out' })
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
