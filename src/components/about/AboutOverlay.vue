<!--
  DEPRECATED / UNUSED: About is now a dedicated routed page, see
  src/pages/AboutPage.vue. This overlay component is no longer imported
  anywhere (kept in place rather than deleted). Safe to remove later.
-->
<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { gsap } from 'gsap'
import { useUiStore } from '@/stores/ui'
import { useLockScroll } from '@/composables/useLockScroll'

const ui = useUiStore()
const { unlock } = useLockScroll()

const panelEl = ref<HTMLElement | null>(null)
const closeBtn = ref<HTMLElement | null>(null)

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

const tools = [
  'Figma', 'Illustrator', 'Photoshop', 'After Effects',
  'Vue 3', 'TypeScript', 'GSAP', 'Three.js', 'Node.js', 'Blender'
]

function close() {
  ui.closeAbout()
  unlock()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

watch(
  () => ui.isAboutOpen,
  async (open) => {
    if (open) {
      window.addEventListener('keydown', onKeydown)
      await nextTick()
      gsap.fromTo(
        panelEl.value,
        { yPercent: 4, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: 0.9, ease: 'expo.out' }
      )
      closeBtn.value?.focus()
    } else {
      window.removeEventListener('keydown', onKeydown)
    }
  }
)

onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Transition name="about-fade">
    <div
      v-if="ui.isAboutOpen"
      class="about-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="About Louis Lefebure"
    >
      <button class="about-overlay__backdrop" aria-label="Close about" @click="close" />

      <div ref="panelEl" class="about-overlay__panel">
        <button ref="closeBtn" class="about-overlay__close" aria-label="Close" @click="close">
          <span /><span />
        </button>

        <div class="about-overlay__scroll">
          <div class="about-overlay__grid container">
            <figure class="about-overlay__portrait">
              <img src="/Profielfoto_Normal.jpg" alt="Portrait of Louis Lefebure" loading="lazy" />
            </figure>

            <div class="about-overlay__intro">
              <p class="type-eyebrow">About, Louis "Lo" Lefebure</p>
              <h2 class="type-display-lg about-overlay__title">Software engineer.<br />Graphic designer.<br />One practice.</h2>
              <p class="type-body-lg about-overlay__lede">
                VISULOX is what happens when a designer refuses to stop coding, and an engineer refuses
                to stop looking at type foundries at 2am. I'm a multidisciplinary creative who builds
                the visual system and the software that carries it, in the same breath.
              </p>
              <p class="about-overlay__body">
                Most studios split the two: someone designs, someone else implements, and the idea
                erodes a little at every handoff. I work the seam between them on purpose. A brand
                system I build gets stress-tested in a real browser before it's called finished; a
                piece of software I ship was drawn, gridded and typeset before a single component
                existed. That's the whole philosophy behind "the art of creating your vision": vision
                isn't a mood board, it's a thing you actually build.
              </p>
            </div>
          </div>

          <div class="about-overlay__disciplines container">
            <div class="about-overlay__disciplines-head">
              <p class="type-eyebrow">Disciplines</p>
              <figure class="about-overlay__disciplines-image">
                <img src="/Profielfoto_Grungy.jpg" alt="" loading="lazy" />
              </figure>
            </div>
            <ul class="about-overlay__discipline-list">
              <li v-for="d in disciplines" :key="d.title">
                <h3 class="type-display-sm">{{ d.title }}</h3>
                <p>{{ d.copy }}</p>
              </li>
            </ul>
          </div>

          <div class="about-overlay__timeline container">
            <p class="type-eyebrow">Timeline</p>
            <ol>
              <li v-for="t in timeline" :key="t.year">
                <span class="about-overlay__timeline-year">{{ t.year }}</span>
                <span class="about-overlay__timeline-label">{{ t.label }}</span>
              </li>
            </ol>
          </div>

          <div class="about-overlay__tools container">
            <p class="type-eyebrow">Tools &amp; Craft</p>
            <ul class="about-overlay__tool-list">
              <li v-for="tool in tools" :key="tool">{{ tool }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins' as m;

.about-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-overlay);

  &__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(5, 5, 5, 0.75);
    backdrop-filter: blur(6px);
  }

  &__panel {
    position: absolute;
    inset: 3vh 3vw;
    background: var(--color-ink-soft);
    border: 1px solid var(--color-border);
    overflow: hidden;
    display: flex;
    flex-direction: column;

    @include m.tablet {
      inset: 0;
    }
  }

  &__scroll {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    padding-block: var(--space-6) var(--space-7);
  }

  &__close {
    position: absolute;
    top: var(--space-3);
    right: var(--space-3);
    z-index: 2;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;

    span {
      position: absolute;
      width: 20px;
      height: 1px;
      background: var(--color-cream);
    }
    span:first-child {
      transform: rotate(45deg);
    }
    span:last-child {
      transform: rotate(-45deg);
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: 0.8fr 1.2fr;
    gap: var(--space-6);
    align-items: end;

    @include m.tablet {
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
    margin-top: var(--space-7);
  }

  &__disciplines-head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--space-4);
  }

  &__disciplines-image {
    width: 120px;
    flex-shrink: 0;

    img {
      width: 100%;
      aspect-ratio: 4 / 5;
      object-fit: cover;
      filter: grayscale(1) contrast(1.15);
    }

    @include m.mobile {
      display: none;
    }
  }

  &__discipline-list {
    margin-top: var(--space-4);
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-4);
    @include m.hairline(top);
    padding-top: var(--space-4);

    @include m.tablet {
      grid-template-columns: 1fr;
    }

    li {
      @include m.hairline(top);
      padding-top: var(--space-2);
    }

    p {
      margin-top: var(--space-1);
      font-size: var(--fs-small);
      color: var(--color-cream-dim);
    }
  }

  &__timeline ol {
    margin-top: var(--space-4);
  }

  &__timeline li {
    display: flex;
    gap: var(--space-4);
    padding-block: var(--space-2);
    @include m.hairline(bottom);
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
    margin-top: var(--space-4);
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);

    li {
      font-size: var(--fs-small);
      letter-spacing: var(--tracking-wide);
      text-transform: uppercase;
      border: 1px solid var(--color-border-strong);
      padding: var(--space-1) var(--space-3);
      border-radius: 999px;
    }
  }
}

.about-fade-enter-active,
.about-fade-leave-active {
  transition: opacity 0.4s var(--ease-premium);
}
.about-fade-enter-from,
.about-fade-leave-to {
  opacity: 0;
}
</style>
