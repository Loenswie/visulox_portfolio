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
const titleEl = ref<HTMLElement | null>(null)
const bgEl = ref<HTMLElement | null>(null)
const fadeEl = ref<HTMLElement | null>(null)

// Kept hidden (via v-show) until the intro animation actually starts, as a
// safety net so the raw, unanimated text can never flash on screen for a
// frame even if the loader's timing ever drifts.
const heroReady = ref(false)

let splitTitle: ReturnType<typeof kineticReveal> | null = null
let scrollTween: ReturnType<typeof gsap.to> | null = null
let bgParallax: ReturnType<typeof gsap.to> | null = null

function startIntro() {
  if (!titleEl.value) return
  heroReady.value = true
  const reduced = prefersReducedMotion()

  splitTitle = kineticReveal(titleEl.value, { by: 'chars', stagger: 0.025, delay: 0.1 })

  if (metaEl.value) {
    gsap.fromTo(
      metaEl.value.children,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: reduced ? 0.3 : 0.9, ease: 'expo.out', stagger: 0.1, delay: 0.3 }
    )
  }
}

onMounted(() => {
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
  // hero__bg is position:absolute (out of flow), so hero__bottom is the only
  // in-flow child — flex-end is what actually pins it to the bottom of the
  // viewport. (space-between only makes sense with 2+ flex children.)
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
    // Fallback base colour — briefly visible at the very edges/before the
    // photo below finishes decoding, and keeps things dark if it ever fails
    // to load.
    background: linear-gradient(160deg, #0b0b0b 0%, #050505 55%, #000 100%);
  }

  // The real grungy title-background photo. A static CSS background-image
  // (not an <img>) since it's purely decorative and already sits behind an
  // aria-hidden wrapper; cover + center keeps it filling the viewport at
  // any aspect ratio without distortion.
  &__bg-photo {
    position: absolute;
    inset: 0;
    background-image: url('/BACKGROUND_TITLE.jpg');
    background-size: cover;
    background-position: center;
    // Slight extra contrast/darkening — the source is already near-black
    // and grungy, this just makes sure the cream wordmark always reads
    // clearly against it regardless of which crop shows at a given
    // viewport size.
    filter: contrast(1.08) brightness(0.82);
  }

  // Oversized, blurred gradient "blobs" drifting on transform only (no
  // background-position / filter animation) so the idle motion in the hero
  // stays fully on the compositor and never touches layout or paint.
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
      // Bigger travel distance + a shorter cycle so the drift actually reads
      // as movement (56s/6-8% was too subtle to notice). Still transform +
      // scale only — neither amplitude nor duration affects per-frame cost,
      // so this remains free from a performance standpoint.
      animation: hero-blob-a 32s ease-in-out infinite alternate;
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

  // Grounds the bottom-left corner (where the wordmark + eyebrow/CTA sit)
  // in solid dark regardless of what's directly behind them in the photo.
  // Static — no animation, so it's a one-time paint cost, not a per-frame one.
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

  // Shares the wordmark's own padding-inline (not the container gutter) so
  // the eyebrow and the CTA line up exactly with the left/right edge of
  // "VISULOX" below them, per design feedback.
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

    // Switch to the smaller/steeper clamp earlier (at the laptop breakpoint,
    // not just tablet) so iPad-sized viewports never end up with an
    // oversized wordmark fighting the available width.
    @include m.laptop {
      font-size: clamp(3.4rem, 21vw, 12rem);
    }
  }
}

@keyframes hero-blob-a {
  from {
    transform: translate3d(0, 0, 0) scale(1);
  }
  to {
    transform: translate3d(18%, 22%, 0) scale(1.25);
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

</style>
