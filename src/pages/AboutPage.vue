<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useHead } from '@/composables/useHead'
import { fadeUpOnScroll, staggerUpOnScroll } from '@/animations/reveal'

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

const timeline = [
  { year: '2018', label: 'First lines of code, first design tools, self-taught, in parallel.' },
  { year: '2020', label: 'Started freelancing across branding and small web projects.' },
  { year: '2022', label: 'Began formal software engineering studies.' },
  { year: '2024', label: 'VISULOX becomes a full creative practice, not just a name.' },
  { year: 'Now', label: 'Building cinematic, hybrid design/development work for select clients.' }
]

const tools = ['Figma', 'Illustrator', 'Photoshop', 'After Effects', 'Vue 3', 'TypeScript', 'GSAP', 'Three.js', 'Node.js', 'Blender']

const disciplineListEl = ref<HTMLElement | null>(null)
const timelineEl = ref<HTMLElement | null>(null)
const toolsEl = ref<HTMLElement | null>(null)
const introEl = ref<HTMLElement | null>(null)

onMounted(() => {
  if (introEl.value) fadeUpOnScroll(introEl.value, { y: 32 })
  if (disciplineListEl.value) {
    staggerUpOnScroll(disciplineListEl.value.querySelectorAll('li'), disciplineListEl.value, { y: 28, stagger: 0.06 })
  }
  if (timelineEl.value) {
    staggerUpOnScroll(timelineEl.value.querySelectorAll('li'), timelineEl.value, { y: 20, stagger: 0.05 })
  }
  if (toolsEl.value) fadeUpOnScroll(toolsEl.value, { y: 20 })
})
</script>

<template>
  <div class="about-page">
    <section class="about-page__intro section container">
      <div ref="introEl" class="about-page__grid">
        <figure class="about-page__portrait">
          <img src="/Profielfoto_Normal.jpg" alt="Portrait of Louis Lefebure" loading="eager" fetchpriority="high" />
        </figure>

        <div class="about-page__copy">
          <p class="type-eyebrow">About Louis Lefebure</p>
          <h1 class="type-display-lg about-page__title">Software engineer /<br />Graphic designer</h1>
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

    <section class="about-page__timeline section container">
      <p class="type-eyebrow">Timeline</p>
      <ol ref="timelineEl">
        <li v-for="t in timeline" :key="t.year">
          <span class="about-page__timeline-year">{{ t.year }}</span>
          <span class="about-page__timeline-label">{{ t.label }}</span>
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

.about-page {
  padding-top: var(--nav-height);

  &__grid {
    display: grid;
    grid-template-columns: 0.8fr 1.2fr;
    gap: var(--space-6);
    align-items: end;

    // Portrait + long-form text side by side needs real width to breathe,
    // so this stacks a breakpoint earlier than most 2-column layouts,
    // covering iPad portrait as well as phones.
    @include m.laptop {
      grid-template-columns: 1fr;
      gap: var(--space-4);
    }
  }

  &__portrait img {
    width: 100%;
    aspect-ratio: 4 / 5;
    object-fit: cover;
    filter: grayscale(1) contrast(1.05);
  }

  &__title {
    margin-top: var(--space-3);
  }

  &__lede {
    margin-top: var(--space-4);
  }

  &__body {
    margin-top: var(--space-3);
    max-width: 62ch;
    color: var(--color-cream-dim);
  }

  &__disciplines,
  &__timeline,
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

  &__timeline {
    ol {
      margin-top: var(--space-5);
    }

    li {
      display: flex;
      gap: var(--space-4);
      padding-block: var(--space-2);
    }
  }

  &__timeline-year {
    font-family: var(--font-display);
    width: 5ch;
    flex-shrink: 0;
    color: var(--color-accent);
  }

  &__timeline-label {
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
