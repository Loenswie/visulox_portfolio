<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { gsap } from '@/animations/reveal'
import { prefersReducedMotion } from '@/animations/motion'

const emit = defineEmits<{ done: [] }>()

const loaderEl = ref<HTMLElement | null>(null)
const logoEl = ref<HTMLElement | null>(null)
const percent = ref(0)

// Drives a conic-gradient mask on the logo — 0deg is the top (12 o'clock),
// sweeping clockwise like a clock hand as it fills in.
const revealDeg = computed(() => percent.value * 3.6)

onMounted(() => {
  const reduced = prefersReducedMotion()
  const state = { val: 0 }

  const counterDuration = reduced ? 0.2 : 1.7
  // A short beat on the fully-revealed logo before the fade starts, instead of fading the instant it completes.
  const holdDuration = reduced ? 0 : 0.1
  const fadeDuration = reduced ? 0.2 : 0.9

  const tl = gsap.timeline({
    delay: 0.15,
    onComplete: () => emit('done')
  })

  tl.to(state, {
    val: 100,
    duration: counterDuration,
    ease: 'power2.inOut',
    onUpdate: () => {
      percent.value = Math.round(state.val)
    }
  })

  tl.to(
    loaderEl.value,
    {
      autoAlpha: 0,
      duration: fadeDuration,
      ease: 'power2.inOut'
    },
    counterDuration + holdDuration
  )

  // The logo scales up slightly as the whole screen fades, so it feels like it comes toward you rather than just disappearing.
  if (!reduced) {
    tl.to(
      logoEl.value,
      {
        scale: 1.35,
        duration: fadeDuration,
        ease: 'power2.inOut'
      },
      counterDuration + holdDuration
    )
  }
})
</script>

<template>
  <div
    ref="loaderEl"
    class="app-loader"
    role="status"
    aria-live="polite"
    aria-label="Loading VISULOX"
    :aria-valuenow="percent"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <span class="sr-only">{{ percent }}% loaded</span>

    <div ref="logoEl" class="app-loader__logo" aria-hidden="true">
      <!-- Faint full mark underneath — a "clock face" reference so the sweep has something to fill in against.
           background-image (not <img>) so the mask below composites cleanly with no layer-edge artifacts. -->
      <div class="app-loader__logo-img app-loader__logo-img--ghost" />
      <!-- Same mark on top, clipped by a conic-gradient that sweeps clockwise from 12 o'clock as percent climbs. -->
      <div
        class="app-loader__logo-img app-loader__logo-img--reveal"
        :style="{
          '-webkit-mask-image': `conic-gradient(black ${revealDeg}deg, transparent ${revealDeg}deg)`,
          'mask-image': `conic-gradient(black ${revealDeg}deg, transparent ${revealDeg}deg)`
        }"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-loader {
  position: fixed;
  inset: 0;
  z-index: var(--z-loader);
  background: var(--color-ink);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &__logo {
    position: relative;
    width: clamp(96px, 16vw, 180px);
    aspect-ratio: 1;
  }

  &__logo-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background-image: url('/logo_white_favicon.png');
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-size: 100% 100%;
    mask-size: 100% 100%;

    &--ghost {
      opacity: 0.05;
    }

    &--reveal {
      opacity: 1;
    }
  }
}
</style>
