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
let resizeTimeout: ReturnType<typeof setTimeout> | undefined

// The CSS clamp()/vw sizing is a best-effort guess at Unbounded's actual
// glyph metrics — close, but not exact, and "the X gets clipped/wrapped at
// some viewport width" is exactly what happens when that guess runs even
// slightly hot. Rather than continuing to hand-tune vw coefficients blind,
// measure the *actual* rendered width against the box's available width and
// shrink the font-size just enough to guarantee it always fits, at any
// viewport size, on any browser's font rendering — no more guessing.
function fitWordmark() {
  const el = titleEl.value
  if (!el) return
  // Clear any previous correction first so we re-measure against the CSS
  // clamp's own fresh value for the *current* viewport, not a shrunk one
  // left over from a narrower size.
  el.style.fontSize = ''
  const available = el.clientWidth
  const needed = el.scrollWidth
  if (needed > available && available > 0) {
    const current = parseFloat(getComputedStyle(el).fontSize)
    // 0.97 safety margin so it never lands pixel-perfect on the edge.
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

  // Back to per-character split (was 'words' — see git history). The word-level
  // split didn't actually cause the X's vertical misalignment (there's only one
  // fragment either way, so it's a single native text run in both cases — this
  // looks like a genuine glyph-design quirk in Unbounded's "X", not something
  // introduced by SplitType). Splitting by 'chars' gives each letter its own
  // span again, which is what lets us target the X specifically with CSS below
  // if it still looks off after this.
  splitTitle = kineticReveal(titleEl.value, { by: 'chars', delay: 0.1 })

  if (metaEl.value) {
    gsap.fromTo(
      metaEl.value.children,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: reduced ? 0.3 : 0.9, ease: 'expo.out', stagger: 0.1, delay: 0.3 }
    )
  }
}

onMounted(() => {
  // Fit before the reveal split runs, so SplitType measures/positions its
  // word span against the final, corrected font-size rather than the raw
  // CSS value. Runs once immediately (covers cached fonts) and again once
  // the webfont has actually finished loading, since measuring against a
  // fallback font's metrics would give the wrong answer.
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
      // Static now — the drifting animation was removed for performance.
      // Even though it was transform-only, two independently-animating
      // full-viewport gradient layers is still two things the compositor
      // has to keep re-evaluating every frame indefinitely; dropping this
      // one removes that cost outright while keeping the violet glow itself.
      background: radial-gradient(closest-side, rgba(105, 61, 174, 0.22), transparent 72%);

      // `vw`-based sizing shrinks in lockstep with a narrow phone screen —
      // at 70vw on a 375px phone that's a ~260px circle mostly positioned
      // off-canvas (top:-20%/left:-15%), so almost none of it was actually
      // visible ("the purple blob isn't here"). It also happens to be the
      // one bit of visual interest available to fill the empty space above
      // the now bottom-aligned wordmark, so it's sized up and boosted in
      // opacity specifically on mobile rather than just left to fade out.
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
    // Belt-and-braces: fitWordmark() (see script) should always keep this
    // from overflowing, but nowrap means that if it ever ran slightly hot
    // regardless, the failure mode is a clipped edge (overflow: hidden
    // above), never a wrapped second line.
    white-space: nowrap;

    // Switch to the smaller/steeper clamp earlier (at the laptop breakpoint,
    // not just tablet) so iPad-sized viewports never end up with an
    // oversized wordmark fighting the available width.
    @include m.laptop {
      font-size: clamp(3.4rem, 21vw, 12rem);
    }

    // Back to the same horizontal layout as tablet/desktop, just its own
    // clamp tier — the rotated vertical-sidebar treatment tried here was
    // reverted per feedback (kept VISULOX at the bottom, matching the rest
    // of the site). fitWordmark() (see script) still guarantees this never
    // overflows regardless of exactly how this clamp is tuned.
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

</style>
