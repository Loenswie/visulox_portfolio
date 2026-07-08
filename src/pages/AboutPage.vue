<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useHead } from '@/composables/useHead'
import { gsap, ScrollTrigger } from '@/animations/reveal'
import { prefersReducedMotion } from '@/animations/motion'

useHead(() => ({
  title: 'About | VISULOX',
  description:
    'Louis Lefebure, the person behind VISULOX. A multidisciplinary creative working across branding, digital experiences and creative development.',
  image: '/Profielfoto_Grungy.jpg'
}))

const disciplines = [
  {
    title: 'Branding',
    copy: 'Identity systems built to survive contact with the real world: signage, packaging, motion, not just a logo on a slide.'
  },
  {
    title: 'Web Design',
    copy: 'Editorial layouts, asymmetry with intent, and interfaces that read like a considered piece of print before they read like software.'
  },
  {
    title: 'Frontend Development',
    copy: 'Vue, TypeScript and GSAP used to actually ship the systems I design, with no handoff gap between the mockup and the browser.'
  },
  {
    title: 'Photography',
    copy: 'Film and digital both, a way of training the same eye that later decides how a grid, a crop or a hero image should feel.'
  },
  {
    title: 'Video Editing',
    copy: 'Cutting motion for campaigns and reels with the same grain, contrast and pacing that carries through the rest of the system.'
  },
  {
    title: 'Creative Direction',
    copy: 'Holding a visual idea together across every surface it touches, from a single Instagram frame to a full product interface.'
  }
]

// Deliberately general — no specific school/employer names.
const education = [
  { year: '2015 – 2021', title: 'Secondary education, economics & modern languages', detail: 'graduated with distinction.' },
  { year: '2021 – 2024', title: "Bachelor's degree in Applied Computer Science", detail: 'graduated with great distinction.' },
  { year: '2024 – 2026', title: 'Graduate program in Graphic Design, online & offline', detail: 'graduated with great distinction.' }
]

const experience = [
  { year: '2021 – 2026', title: 'Cinema crew member', detail: 'customer-facing, organized, fast-paced environment.' },
  { year: '2024', title: 'Software engineering internship', detail: 'websites, flyers and event invitations.' },
  { year: '2024 – 2026', title: 'Freelance graphic design', detail: 'branding, flyers and photography for small clients.' },
  { year: '2026', title: 'Graphic design internship', detail: 'campaigns, branding and website work.' }
]

const tools = ['Figma', 'Illustrator', 'Photoshop', 'InDesign', 'After Effects', 'Premiere Pro', 'Lightroom', 'Vue', 'Angular', 'React', 'Laravel', 'HTML/CSS/JS', 'WordPress', 'TypeScript', 'Vue 3', 'TypeScript', 'GSAP', 'git' ]

const heroEl = ref<HTMLElement | null>(null)
const heroBackWordEl = ref<HTMLElement | null>(null)
const heroFrontWordEl = ref<HTMLElement | null>(null)
let heroScrollTrigger: ReturnType<typeof ScrollTrigger.create> | null = null
let heroSetupTimeout: ReturnType<typeof setTimeout> | undefined

onMounted(() => {
  // Rest positions mirror the CSS defaults, so reduced-motion visitors see the same final layout.
  const heroMotionEnabled = !prefersReducedMotion() && !!heroEl.value && !!heroBackWordEl.value && !!heroFrontWordEl.value
  const isMobile = window.matchMedia('(max-width: 480px)').matches
  const startX = isMobile ? 55 : 120
  const restX = isMobile ? 18 : 40

  // Set synchronously (not in the setTimeout below) to avoid a flash of the centered CSS state first.
  if (heroMotionEnabled) {
    gsap.set(heroBackWordEl.value, { xPercent: -startX, yPercent: -75 })
    gsap.set(heroFrontWordEl.value, { xPercent: startX, yPercent: -15 })
  }

  // Delayed so DefaultLayout's page-enter transition finishes before ScrollTrigger measures the pin.
  heroSetupTimeout = setTimeout(() => {
    if (heroMotionEnabled) {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: heroEl.value, start: 'top top', end: '+=90%', scrub: 0.6, pin: true }
      })
      tl.to(heroBackWordEl.value, { xPercent: -restX, yPercent: -75, ease: 'none' }, 0)
        .to(heroFrontWordEl.value, { xPercent: restX, yPercent: -15, ease: 'none' }, 0)
      heroScrollTrigger = (tl as any).scrollTrigger ?? null
    }
    ScrollTrigger.refresh()
  }, 800)
})

onBeforeUnmount(() => {
  if (heroSetupTimeout) clearTimeout(heroSetupTimeout)
  heroScrollTrigger?.kill()
})
</script>

<template>
  <div class="about-page">
    <section ref="heroEl" class="about-hero" aria-label="Louis Lefebure">
      <h1 class="sr-only">Software Engineer / Graphic Designer - Louis Lefebure</h1>
      <div class="about-hero__stage">
        <span ref="heroBackWordEl" class="about-hero__word about-hero__word--back" aria-hidden="true">
          Software<br />Engineer
        </span>
        <figure class="about-hero__photo">
          <img src="/Profielfoto_Normal.jpg" alt="Portrait of Louis Lefebure" loading="eager" fetchpriority="high" />
        </figure>
        <span ref="heroFrontWordEl" class="about-hero__word about-hero__word--front" aria-hidden="true">
          Graphic<br />Designer
        </span>
      </div>
      <div class="about-hero__scroll-cue" aria-hidden="true">
        <span class="type-eyebrow">Scroll</span>
        <span class="about-hero__scroll-arrow" />
      </div>
    </section>

    <section class="about-page__intro section container">
      <div class="about-page__copy">
        <p class="type-eyebrow">About Louis Lefebure</p>
        <p class="type-body-lg about-page__lede">
          VISULOX is what happens when a designer refuses to stop coding, and an engineer refuses
          to stop looking at type foundries at 2am. I'm a multidisciplinary creative who builds
          the visual system and the software that carries it, in the same breath.
        </p>
        <p class="about-page__body">
          Most studios split the two: someone designs, someone else implements, and the idea
          erodes a little at every handoff. I work the seam between them on purpose. A brand
          system I build gets stress-tested in a real browser before it's called finished; a
          piece of software I ship was drawn, gridded and typeset before a single component
          existed. That's the whole philosophy behind "the art of creating your vision": vision
          isn't a mood board, it's a thing you actually build.
        </p>
      </div>
    </section>

    <section class="about-page__disciplines section container">
      <div class="about-page__disciplines-head">
        <p class="type-eyebrow">Disciplines</p>
      </div>
      <ul class="about-page__discipline-list">
        <li v-for="d in disciplines" :key="d.title">
          <h3 class="type-display-sm">{{ d.title }}</h3>
          <p>{{ d.copy }}</p>
        </li>
      </ul>
    </section>

    <!-- mix-blend-mode: difference, same trick as the custom cursor (_cursor.scss). -->
    <section class="about-page__statement" aria-label="Philosophy">
      <div class="about-page__statement-bg" aria-hidden="true">
        <img src="/BACKGROUND_PICTURE.jpg" alt="" loading="lazy" decoding="async" />
      </div>
      <p class="about-page__statement-text">
        Most of the work happens where no one's looking.
      </p>
    </section>

    <section class="about-page__record section container">
      <div class="about-page__record-stack">
        <div class="about-page__record-col">
          <h2 class="about-page__record-title">Education</h2>
          <ol class="about-page__record-list">
            <li v-for="e in education" :key="e.year">
              <span class="about-page__record-year">{{ e.year }}</span>
              <span class="about-page__record-label">
                <strong>{{ e.title }}</strong> {{ e.detail }}
              </span>
            </li>
          </ol>
        </div>

        <div class="about-page__record-col">
          <h2 class="about-page__record-title">Experience</h2>
          <ol class="about-page__record-list">
            <li v-for="e in experience" :key="e.year + e.title">
              <span class="about-page__record-year">{{ e.year }}</span>
              <span class="about-page__record-label">
                <strong>{{ e.title }}</strong> {{ e.detail }}
              </span>
            </li>
          </ol>
        </div>
      </div>

      <!-- align-self: stretch matches this to the stack's full height (CSS below). -->
      <figure class="about-page__record-image" aria-hidden="true">
        <img src="/apple.jpg" alt="" loading="lazy" decoding="async" />
      </figure>
    </section>

    <section class="about-page__tools section container">
      <p class="type-eyebrow">Tools &amp; Craft</p>
      <ul class="about-page__tool-list">
        <li v-for="tool in tools" :key="tool">{{ tool }}</li>
      </ul>
    </section>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins' as m;

.about-hero {
  position: relative;
  height: 100svh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--color-ink);

  &__stage {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__photo {
    position: relative;
    z-index: 1;
    width: min(40vw, 480px);
    aspect-ratio: 1 / 1;
    flex-shrink: 0;

    @include m.tablet {
      width: min(66vw, 360px);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: grayscale(1) contrast(1.1);
    }
  }

  // Both words float above the photo now (z-index > photo); their differing
  // vertical offsets (-75% vs -15%) keep them from overlapping each other.
  &__word {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 2;
    transform: translate(calc(-50% - 35%), -75%);
    font-family: var(--font-display);
    font-size: clamp(2.2rem, 8vw, 5.5rem);
    line-height: 0.92;
    letter-spacing: var(--tracking-tight);
    font-weight: 700;
    text-transform: uppercase;
    text-align: center;
    white-space: nowrap;
    color: var(--color-cream);

    @include m.mobile {
      transform: translate(calc(-50% - 16%), -75%);
    }

    &--front {
      z-index: 3;
      transform: translate(calc(-50% + 35%), -15%);

      @include m.mobile {
        transform: translate(calc(-50% + 16%), -15%);
      }
    }
  }

  &__scroll-cue {
    position: absolute;
    bottom: var(--space-4);
    left: 50%;
    transform: translateX(-50%);
    z-index: 4;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-1);
    color: var(--color-cream-faint);
  }

  &__scroll-arrow {
    width: 9px;
    height: 9px;
    border-right: 1px solid var(--color-cream-faint);
    border-bottom: 1px solid var(--color-cream-faint);
    transform: rotate(45deg);
    animation: about-hero-scroll-bounce 1.6s ease-in-out infinite;
  }
}

@keyframes about-hero-scroll-bounce {
  0%,
  100% {
    transform: rotate(45deg) translate(0, 0);
    opacity: 0.6;
  }
  50% {
    transform: rotate(45deg) translate(4px, 4px);
    opacity: 1;
  }
}

.about-page {
  &__statement {
    position: relative;
    min-height: 70vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    isolation: isolate;

    @include m.mobile {
      min-height: 56vh;
    }
  }

  &__statement-bg {
    position: absolute;
    inset: 0;
    z-index: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 20%;
      filter: grayscale(1) contrast(1.25);
    }
  }

  &__statement-text {
    position: relative;
    z-index: 1;
    max-width: 22ch;
    padding-inline: var(--gutter);
    font-family: var(--font-display);
    font-size: clamp(2rem, 5.2vw, 4.5rem);
    line-height: 1.05;
    letter-spacing: var(--tracking-tight);
    font-weight: 700;
    text-align: center;
    text-transform: uppercase;
    color: var(--color-cream);
    mix-blend-mode: difference;
  }

  &__copy {
    max-width: 68ch;
  }

  &__lede {
    margin-top: var(--space-3);
  }

  &__body {
    margin-top: var(--space-3);
    max-width: 62ch;
    color: var(--color-cream-dim);
  }

  &__disciplines,
  &__record,
  &__tools {
    @include m.hairline(top);
  }

  &__discipline-list {
    margin-top: var(--space-5);
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-5) var(--space-4);

    @include m.laptop {
      grid-template-columns: repeat(2, 1fr);
    }

    @include m.tablet {
      grid-template-columns: 1fr;
    }

    p {
      margin-top: var(--space-1);
      font-size: var(--fs-small);
      color: var(--color-cream-dim);
    }
  }

  // Photo's align-self: stretch (below) matches it to the stack's rendered height.
  &__record {
    display: grid;
    grid-template-columns: 1fr auto;
    column-gap: var(--space-6);

    @include m.laptop {
      grid-template-columns: 1fr;
    }
  }

  &__record-stack {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
    min-width: 0;
  }

  &__record-col {
    min-width: 0;
  }

  &__record-title {
    font-family: var(--font-display);
    font-size: clamp(3rem, 6.5vw, 5.5rem);
    line-height: 0.94;
    letter-spacing: var(--tracking-tight);
    font-weight: 700;
    text-transform: uppercase;

    @include m.laptop {
      font-size: clamp(2.4rem, 9vw, 4rem);
    }
  }

  &__record-image {
    position: relative;
    align-self: stretch;
    width: min(26vw, 380px);
    overflow: hidden;

    @include m.laptop {
      display: none;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: grayscale(1) contrast(1.2);
    }
  }

  &__record-list {
    margin-top: var(--space-5);

    li {
      display: flex;
      gap: var(--space-4);
      padding-block: var(--space-2);
      @include m.hairline(bottom);
    }
  }

  &__record-year {
    font-family: var(--font-display);
    width: 9ch;
    flex-shrink: 0;
    color: var(--color-accent);
  }

  &__record-label {
    color: var(--color-cream-dim);

    strong {
      color: var(--color-cream);
      font-weight: 700;
    }
  }

  &__tool-list {
    margin-top: var(--space-5);
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);

    li {
      font-size: var(--fs-small);
      letter-spacing: var(--tracking-wide);
      text-transform: uppercase;
      border: 1px solid var(--color-border-strong);
      padding: var(--space-1) var(--space-3);
    }
  }
}
</style>
