<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useHead } from '@/composables/useHead'
import { fadeUpOnScroll, gsap, ScrollTrigger, staggerUpOnScroll } from '@/animations/reveal'
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

// Kept general on purpose — real degree/role shape, without naming specific
// schools or employers, which reads better on a portfolio than a literal CV.
const education = [
  { year: '2015 – 2021', label: 'Secondary education, economics & modern languages — graduated with distinction.' },
  { year: '2021 – 2024', label: "Bachelor's degree in Applied Computer Science — graduated with great distinction." },
  { year: '2024 – 2026', label: 'Graduate program in Graphic Design, online & offline — currently completing.' }
]

const experience = [
  { year: '2021 – 2026', label: 'Cinema crew member — customer-facing, organized, fast-paced environment.' },
  { year: '2024', label: 'Software engineering internship — websites, flyers and event invitations.' },
  { year: '2024 – 2026', label: 'Freelance graphic design — branding, flyers and photography for small clients.' },
  { year: '2026', label: 'Graphic design internship — campaigns, branding and website work.' }
]

const tools = ['Figma', 'Illustrator', 'Photoshop', 'After Effects', 'Vue 3', 'TypeScript', 'GSAP', 'Three.js', 'Node.js', 'Blender']

const disciplineListEl = ref<HTMLElement | null>(null)
const educationEl = ref<HTMLElement | null>(null)
const experienceEl = ref<HTMLElement | null>(null)
const toolsEl = ref<HTMLElement | null>(null)
const introEl = ref<HTMLElement | null>(null)

const heroEl = ref<HTMLElement | null>(null)
const heroBackWordEl = ref<HTMLElement | null>(null)
const heroFrontWordEl = ref<HTMLElement | null>(null)
// Typed loosely (like Hero.vue's own scrollTween) — the ScrollTrigger
// instance is attached to the timeline at runtime by the plugin, and isn't
// part of GSAP's own Timeline type declarations.
let heroScrollTrigger: ReturnType<typeof ScrollTrigger.create> | null = null
let heroSetupTimeout: ReturnType<typeof setTimeout> | undefined

onMounted(() => {
  if (introEl.value) fadeUpOnScroll(introEl.value, { y: 32 })
  if (disciplineListEl.value) {
    staggerUpOnScroll(disciplineListEl.value.querySelectorAll('li'), disciplineListEl.value, { y: 28, stagger: 0.06 })
  }
  if (educationEl.value) {
    staggerUpOnScroll(educationEl.value.querySelectorAll('li'), educationEl.value, { y: 20, stagger: 0.05 })
  }
  if (experienceEl.value) {
    staggerUpOnScroll(experienceEl.value.querySelectorAll('li'), experienceEl.value, { y: 20, stagger: 0.05 })
  }
  if (toolsEl.value) fadeUpOnScroll(toolsEl.value, { y: 20 })

  // The photo never moves — it's pinned dead center for the whole section.
  // The two words arrive one at a time, not simultaneously, so they never
  // occupy the same space mid-scroll: "Software Engineer" (behind the photo)
  // slides in from the left and settles upper-left during the first half of
  // the scroll; only once it's fully in place does "Graphic Designer" (in
  // front of the photo) slide in from the right and settle lower-right,
  // during the second half. Same rest positions as the CSS defaults below,
  // so reduced-motion visitors see the identical final layout, just without
  // the scroll-driven approach.
  //
  // Delayed on purpose: this component mounts while DefaultLayout's own
  // page-enter transition (0.7s) is still animating the whole page's y/
  // opacity. Creating a `pin: true` ScrollTrigger while an ancestor is
  // mid-transform gives it a wrong initial measurement — the pin ends up
  // useless (the section just scrolls normally instead of holding in
  // place). Waiting until that transition has actually finished, then
  // creating it fresh, is what makes the pin behave correctly.
  heroSetupTimeout = setTimeout(() => {
    if (!prefersReducedMotion() && heroEl.value && heroBackWordEl.value && heroFrontWordEl.value) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroEl.value,
          start: 'top top',
          end: '+=140%',
          scrub: 0.6,
          pin: true
        }
      })
      tl.fromTo(
        heroBackWordEl.value,
        { xPercent: -260, yPercent: -85 },
        { xPercent: -68, yPercent: -85, ease: 'none', duration: 0.5 },
        0
      ).fromTo(
        heroFrontWordEl.value,
        { xPercent: 260, yPercent: -12 },
        { xPercent: 68, yPercent: -12, ease: 'none', duration: 0.5 },
        0.5
      )
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
      <h1 class="sr-only">Software Engineer / Graphic Designer — Louis Lefebure</h1>
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
      <p class="type-eyebrow about-hero__scroll-cue">Scroll</p>
    </section>

    <section class="about-page__intro section container">
      <div ref="introEl" class="about-page__copy">
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
      <ul ref="disciplineListEl" class="about-page__discipline-list">
        <li v-for="d in disciplines" :key="d.title">
          <h3 class="type-display-sm">{{ d.title }}</h3>
          <p>{{ d.copy }}</p>
        </li>
      </ul>
    </section>

    <section class="about-page__education section container">
      <p class="type-eyebrow">Education</p>
      <ol ref="educationEl" class="about-page__record-list">
        <li v-for="e in education" :key="e.year">
          <span class="about-page__record-year">{{ e.year }}</span>
          <span class="about-page__record-label">{{ e.label }}</span>
        </li>
      </ol>
    </section>

    <section class="about-page__experience section container">
      <p class="type-eyebrow">Experience</p>
      <ol ref="experienceEl" class="about-page__record-list">
        <li v-for="e in experience" :key="e.year + e.label">
          <span class="about-page__record-year">{{ e.year }}</span>
          <span class="about-page__record-label">{{ e.label }}</span>
        </li>
      </ol>
    </section>

    <section ref="toolsEl" class="about-page__tools section container">
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

  // Square portrait, dead center, sits between the two text layers.
  &__photo {
    position: relative;
    z-index: 1;
    width: min(34vw, 420px);
    aspect-ratio: 1 / 1;
    flex-shrink: 0;

    @include m.tablet {
      width: min(60vw, 320px);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: grayscale(1) contrast(1.1);
    }
  }

  // Diagonal rest layout by default — "Software Engineer" upper-left behind
  // the photo, "Graphic Designer" lower-right in front of it — matching
  // exactly where the GSAP scroll animation (see script) settles each word,
  // so reduced-motion visitors (who never get that tween) still see the
  // intended final composition, not an overlapping mess in the center.
  &__word {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 0;
    transform: translate(calc(-50% - 68%), -85%);
    font-family: var(--font-display);
    font-size: clamp(2.2rem, 6.4vw, 5.5rem);
    line-height: 0.92;
    letter-spacing: var(--tracking-tight);
    font-weight: 700;
    text-transform: uppercase;
    text-align: center;
    white-space: nowrap;
    color: var(--color-cream);

    &--front {
      z-index: 2;
      transform: translate(calc(-50% + 68%), -12%);
    }
  }

  &__scroll-cue {
    position: absolute;
    bottom: var(--space-4);
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
    color: var(--color-cream-faint);
  }
}

.about-page {
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
  &__education,
  &__experience,
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
