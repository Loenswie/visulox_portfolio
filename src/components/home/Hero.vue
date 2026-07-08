<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { gsap } from '@/animations/reveal'
import { kineticReveal } from '@/animations/splitText'
import { prefersReducedMotion } from '@/animations/motion'
import { useUiStore } from '@/stores/ui'
import MagneticButton from '@/components/ui/MagneticButton.vue'

const ui = useUiStore()

const heroEl = ref<HTMLElement | null>(null)
const metaEl = ref<HTMLElement | null>(null)
const taglineEl = ref<HTMLElement | null>(null)
const titleEl = ref<HTMLElement | null>(null)
const bgEl = ref<HTMLElement | null>(null)
const fadeEl = ref<HTMLElement | null>(null)

// Hidden via v-show until intro starts, so raw text never flashes on screen.
const heroReady = ref(false)

// Typed, deleted, retyped — short on purpose so it always stays on one line.
const taglinePhrases = [
  'Designed. Built. Shipped.',
  'A designer who codes.',
  'Still learning, still building.',
  'Design meets development.'
]
const typedText = ref('')
let typewriterTimeout: ReturnType<typeof setTimeout> | undefined
let phraseIdx = 0
let charIdx = 0
let deleting = false

const TYPE_SPEED = 55
const DELETE_SPEED = 32
const HOLD_FULL = 1700
const HOLD_EMPTY = 350

function tickTypewriter() {
  const current = taglinePhrases[phraseIdx]
  if (!deleting) {
    charIdx++
    typedText.value = current.slice(0, charIdx)
    if (charIdx === current.length) {
      deleting = true
      typewriterTimeout = setTimeout(tickTypewriter, HOLD_FULL)
      return
    }
    typewriterTimeout = setTimeout(tickTypewriter, TYPE_SPEED)
  } else {
    charIdx--
    typedText.value = current.slice(0, charIdx)
    if (charIdx === 0) {
      deleting = false
      phraseIdx = (phraseIdx + 1) % taglinePhrases.length
      typewriterTimeout = setTimeout(tickTypewriter, HOLD_EMPTY)
      return
    }
    typewriterTimeout = setTimeout(tickTypewriter, DELETE_SPEED)
  }
}

let splitTitle: ReturnType<typeof kineticReveal> | null = null
let scrollTween: ReturnType<typeof gsap.to> | null = null
let bgParallax: ReturnType<typeof gsap.to> | null = null
let resizeTimeout: ReturnType<typeof setTimeout> | undefined

// Measures the rendered wordmark against its available width and shrinks the
// font-size just enough to guarantee it never overflows, at any viewport size.
function fitWordmark() {
  const el = titleEl.value
  if (!el) return
  el.style.fontSize = ''
  const available = el.clientWidth
  const needed = el.scrollWidth
  if (needed > available && available > 0) {
    const current = parseFloat(getComputedStyle(el).fontSize)
    el.style.fontSize = `${current * (available / needed) * 0.97}px`
  }
}

function scheduleFitWordmark() {
  if (resizeTimeout) clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(fitWordmark, 120)
}

function startIntro() {
  if (!titleEl.value) return
  heroReady.value = true
  const reduced = prefersReducedMotion()

  splitTitle = kineticReveal(titleEl.value, { by: 'chars', delay: 0.1 })

  if (metaEl.value) {
    gsap.fromTo(
      metaEl.value.children,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: reduced ? 0.3 : 0.9, ease: 'expo.out', stagger: 0.1, delay: 0.3 }
    )
  }

  if (taglineEl.value) {
    gsap.fromTo(
      taglineEl.value.children,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: reduced ? 0.3 : 0.9, ease: 'expo.out', stagger: 0.1, delay: 0.45 }
    )
  }

  // A beat of just the blinking cursor before typing starts. Reduced-motion visitors get the first phrase, static.
  if (reduced) {
    typedText.value = taglinePhrases[0]
  } else {
    typewriterTimeout = setTimeout(tickTypewriter, 900)
  }
}

onMounted(() => {
  fitWordmark()
  document.fonts?.ready?.then(fitWordmark)
  window.addEventListener('resize', scheduleFitWordmark, { passive: true })

  watch(
    () => ui.isLoading,
    (loading) => {
      if (!loading) startIntro()
    },
    { immediate: true }
  )

  if (!prefersReducedMotion()) {
    scrollTween = gsap.to(fadeEl.value, {
      autoAlpha: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: heroEl.value,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5
      }
    })

    bgParallax = gsap.to(bgEl.value, {
      yPercent: 10,
      ease: 'none',
      scrollTrigger: {
        trigger: heroEl.value,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5
      }
    })
  }
})

onBeforeUnmount(() => {
  splitTitle?.revert()
  ;(scrollTween as any)?.scrollTrigger?.kill()
  scrollTween?.kill()
  ;(bgParallax as any)?.scrollTrigger?.kill()
  bgParallax?.kill()
  window.removeEventListener('resize', scheduleFitWordmark)
  if (resizeTimeout) clearTimeout(resizeTimeout)
  if (typewriterTimeout) clearTimeout(typewriterTimeout)
})
</script>

<template>
  <section ref="heroEl" class="hero" aria-label="Introduction">
    <div ref="bgEl" class="hero__bg" aria-hidden="true">
      <div class="hero__bg-photo" />
      <div class="hero__bg-blob hero__bg-blob--a" />
      <div class="hero__bg-blob hero__bg-blob--b" />
      <div class="hero__bg-scrim" />
      <div ref="fadeEl" class="hero__bg-fade" />
    </div>

    <!-- Only in-flow child above the bottom-anchored wordmark, so flex:1 fills the leftover space. -->
    <div ref="taglineEl" v-show="heroReady" class="hero__tagline">
      <p class="type-body-lg hero__tagline-line">The art of creating your vision.</p>
      <p class="type-body-lg hero__tagline-line hero__tagline-line--dim hero__tagline-line--typed">
        <span>{{ typedText }}</span><span class="hero__tagline-cursor" aria-hidden="true" />
      </p>
    </div>

    <div class="hero__bottom">
      <div ref="metaEl" v-show="heroReady" class="hero__meta">
        <p class="type-eyebrow">Creative Developer / Graphic Designer</p>
        <MagneticButton label="View the work" to="/work" cursor-label="Explore" />
      </div>
      <h1 ref="titleEl" v-show="heroReady" class="hero__wordmark">VISULOX</h1>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins' as m;

.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-top: var(--nav-height);
  padding-bottom: var(--space-4);
  overflow: hidden;
  background: var(--color-ink);

  &__bg {
    position: absolute;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    background: linear-gradient(160deg, #0b0b0b 0%, #050505 55%, #000 100%);
  }

  &__bg-photo {
    position: absolute;
    inset: 0;
    background-image: url('/BACKGROUND_TITLE.jpg');
    background-size: cover;
    background-position: center;
    filter: contrast(1.08) brightness(0.82);
  }

  &__bg-blob {
    position: absolute;
    border-radius: 50%;
    will-change: transform;

    &--a {
      top: -20%;
      left: -15%;
      width: 70vw;
      height: 70vw;
      background: radial-gradient(closest-side, rgba(105, 61, 174, 0.22), transparent 72%);

      // Bigger + brighter on mobile, filling the empty space above the wordmark.
      @include m.mobile {
        top: 0%;
        left: -0%;
        width: 145vw;
        height: 145vw;
        background: radial-gradient(closest-side, rgba(105, 61, 174, 0.32), transparent 72%);
      }
    }

    &--b {
      bottom: -30%;
      right: -20%;
      width: 80vw;
      height: 80vw;
      background: radial-gradient(closest-side, rgba(0, 0, 0, 0.9), transparent 70%);
      animation: hero-blob-b 30s ease-in-out infinite alternate;
    }
  }

  &__bg-scrim {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(5, 5, 5, 0.88) 0%, rgba(5, 5, 5, 0.35) 45%, transparent 75%);
  }

  &__bg-fade {
    position: absolute;
    inset: 0;
    background: var(--color-ink);
    opacity: 0;
  }

  &__bottom {
    position: relative;
    z-index: 1;
  }

  &__tagline {
    position: relative;
    z-index: 1;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    padding-inline: var(--space-5);
    text-align: center;

    @include m.mobile {
      justify-content: center;
    }
  }

  &__tagline-line {
    max-width: 36ch;
    color: var(--color-cream);

    &--dim {
      color: var(--color-cream-dim);
    }

    // Always a single line — phrases are kept short enough to fit without wrapping or overflowing.
    &--typed {
      white-space: nowrap;
      max-width: none;
    }

    @include m.mobile {
      font-size: var(--fs-body);
    }
  }

  &__tagline-cursor {
    display: inline-block;
    width: 2px;
    height: 0.9em;
    margin-left: 2px;
    vertical-align: -0.12em;
    background: var(--color-cream-dim);
    animation: hero-cursor-blink 0.9s step-end infinite;
  }

  &__meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    padding-inline: var(--space-3);
    margin-bottom: var(--space-2);

    @include m.mobile {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-3);
    }
  }

  &__wordmark {
    width: 100%;
    padding-inline: var(--space-3);
    font-size: clamp(4.2rem, 19vw, 23rem);
    line-height: 0.82;
    letter-spacing: var(--tracking-tighter);
    color: var(--color-cream);
    overflow: hidden;
    text-align: left;
    white-space: nowrap;

    @include m.laptop {
      font-size: clamp(3.4rem, 21vw, 12rem);
    }

    @include m.mobile {
      font-size: clamp(2.4rem, 15vw, 4.5rem);
    }
  }
}

@keyframes hero-blob-b {
  from {
    transform: translate3d(0, 0, 0) scale(1);
  }
  to {
    transform: translate3d(-8%, -6%, 0) scale(1.1);
  }
}

@keyframes hero-cursor-blink {
  0%,
  50% {
    opacity: 1;
  }
  50.01%,
  100% {
    opacity: 0;
  }
}
</style>
