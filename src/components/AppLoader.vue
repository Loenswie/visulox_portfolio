<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gsap } from '@/animations/reveal'
import { kineticReveal } from '@/animations/splitText'
import { prefersReducedMotion } from '@/animations/motion'

const emit = defineEmits<{ done: [] }>()

const loaderEl = ref<HTMLElement | null>(null)
const wordEl = ref<HTMLElement | null>(null)
const percent = ref(0)

onMounted(() => {
  const reduced = prefersReducedMotion()
  const state = { val: 0 }

  const split = wordEl.value ? kineticReveal(wordEl.value, { by: 'chars', stagger: 0.035 }) : null

  const counterDuration = reduced ? 0.2 : 1.7
  const fadeDuration = reduced ? 0.2 : 0.9

  const tl = gsap.timeline({
    delay: 0.15,
    onComplete: () => {
      split?.revert()
      emit('done')
    }
  })

  tl.to(state, {
    val: 100,
    duration: counterDuration,
    ease: 'power2.inOut',
    onUpdate: () => {
      percent.value = Math.round(state.val)
    }
  })

  // Positioned so the fade finishes at exactly the same moment the counter
  // (and therefore the whole timeline / the "done" emit) does. Previously the
  // fade ended earlier than the timeline itself, leaving a brief gap where the
  // loader was already invisible but isLoading hadn't flipped yet, so the
  // hero content flashed in unanimated underneath it.
  tl.to(
    loaderEl.value,
    {
      autoAlpha: 0,
      duration: fadeDuration,
      ease: 'power2.inOut'
    },
    Math.max(0, counterDuration - fadeDuration)
  )
})
</script>

<template>
  <div ref="loaderEl" class="app-loader" role="status" aria-live="polite" aria-label="Loading VISULOX">
    <div class="app-loader__inner">
      <h1 ref="wordEl" class="app-loader__word">VISULOX</h1>
      <p class="app-loader__quote">The art of creating your vision.</p>
    </div>

    <div class="app-loader__progress">
      <span class="app-loader__percent">{{ percent }}%</span>
      <div class="app-loader__bar">
        <div class="app-loader__bar-fill" :style="{ width: percent + '%' }" />
      </div>
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &__inner {
    text-align: center;
    padding-inline: var(--space-4);
  }

  &__word {
    font-family: var(--font-display);
    font-size: clamp(2.2rem, 9vw, 6rem);
    letter-spacing: var(--tracking-tighter);
    color: var(--color-cream);
    overflow: hidden;
  }

  &__quote {
    margin-top: var(--space-2);
    font-family: var(--font-body);
    font-size: var(--fs-small);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    color: var(--color-cream-dim);
  }

  &__progress {
    position: absolute;
    bottom: var(--space-5);
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-1);
    width: min(220px, 60vw);
  }

  &__percent {
    font-family: var(--font-display);
    font-size: var(--fs-small);
    color: var(--color-accent);
  }

  &__bar {
    width: 100%;
    height: 1px;
    background: var(--color-border);

    &-fill {
      height: 100%;
      background: var(--color-cream);
      transition: width 0.1s linear;
    }
  }
}
</style>
