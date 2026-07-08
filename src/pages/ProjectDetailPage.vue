<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAdjacentProject, getProjectBySlug } from '@/data/projects'
import { useHead } from '@/composables/useHead'
import { maskRevealImage } from '@/animations/reveal'
import MagneticButton from '@/components/ui/MagneticButton.vue'

const props = defineProps<{ slug: string }>()
const route = useRoute()
const router = useRouter()

const project = computed(() => getProjectBySlug(props.slug ?? (route.params.slug as string)))
const nextProject = computed(() => project.value && getAdjacentProject(project.value.slug, 1))

const galleryRefs = ref<HTMLElement[]>([])

useHead(() => ({
  title: project.value ? `${project.value.title} | VISULOX` : 'Project | VISULOX',
  description: project.value?.shortDescription ?? '',
  image: project.value?.heroImage
}))

// See StatsStrip.vue for why this is typed against Element | ComponentPublicInstance
// rather than just Element — that's the actual type Vue's `:ref` callback passes.
function setGalleryRef(el: Element | ComponentPublicInstance | null, i: number) {
  if (el instanceof HTMLElement) galleryRefs.value[i] = el
}

onMounted(() => {
  galleryRefs.value.forEach((wrapper) => {
    const img = wrapper.querySelector('img')
    if (img) maskRevealImage(wrapper, img)
  })
})

if (!project.value) {
  router.replace('/work')
}
</script>

<template>
  <article v-if="project" class="project-detail">
    <header class="project-detail__hero">
      <img :src="project.heroImage" :alt="project.title" class="project-detail__hero-img" fetchpriority="high" />
      <div class="project-detail__hero-overlay" />
      <div class="project-detail__hero-content container">
        <ul class="project-detail__categories">
          <li v-for="cat in project.categories" :key="cat">{{ cat }}</li>
        </ul>
        <h1 class="type-display-lg project-detail__title">{{ project.title }}</h1>
      </div>
    </header>

    <section class="project-detail__intro section container">
      <div class="project-detail__intro-grid">
        <p class="type-display-sm project-detail__lede">{{ project.shortDescription }}</p>
        <div class="project-detail__facts">
          <div>
            <p class="type-eyebrow">Services</p>
            <ul class="project-detail__chip-list">
              <li v-for="s in project.services" :key="s">{{ s }}</li>
            </ul>
          </div>
          <div>
            <p class="type-eyebrow">Technologies</p>
            <ul class="project-detail__chip-list">
              <li v-for="t in project.technologies" :key="t">{{ t }}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="project-detail__narrative">
        <div class="project-detail__narrative-item">
          <p class="type-eyebrow">01 — Challenge</p>
          <p>{{ project.challenge }}</p>
        </div>
        <div class="project-detail__narrative-item">
          <p class="type-eyebrow">02 — Approach</p>
          <p>{{ project.approach }}</p>
        </div>
        <div class="project-detail__narrative-item">
          <p class="type-eyebrow">03 — Result</p>
          <p>{{ project.result }}</p>
        </div>
      </div>

      <div class="project-detail__links">
        <MagneticButton v-if="project.externalLink" label="Visit live site" :href="project.externalLink" />
        <MagneticButton
          v-if="project.showBehance && project.behanceLink"
          label="View on Behance"
          :href="project.behanceLink"
          variant="ghost"
        />
      </div>
    </section>

    <section class="project-detail__gallery container" aria-label="Project gallery">
      <div
        v-for="(img, i) in project.galleryImages"
        :key="img"
        :ref="(el) => setGalleryRef(el, i)"
        class="project-detail__gallery-item"
      >
        <img :src="img" :alt="`${project.title} image ${i + 1}`" loading="lazy" decoding="async" />
      </div>
    </section>

    <footer class="project-detail__nav container">
      <router-link to="/work" class="project-detail__nav-btn project-detail__nav-btn--back">
        <span class="project-detail__nav-arrow" aria-hidden="true">←</span>
        <span>All Work</span>
      </router-link>
      <router-link
        v-if="nextProject"
        :to="`/work/${nextProject.slug}`"
        class="project-detail__nav-btn project-detail__nav-btn--next"
      >
        <span>Next — {{ nextProject.title }}</span>
        <span class="project-detail__nav-arrow" aria-hidden="true">→</span>
      </router-link>
    </footer>
  </article>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins' as m;

.project-detail {
  &__hero {
    position: relative;
    height: 90svh;
    overflow: hidden;
    display: flex;
    align-items: flex-end;
  }

  &__hero-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(0.3);
  }

  &__hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(5, 5, 5, 0.92), rgba(5, 5, 5, 0.1) 55%);
  }

  &__hero-content {
    position: relative;
    padding-bottom: var(--space-6);
  }

  // Small chips sitting above the title, matching the work-overview cards.
  &__categories {
    @include m.chip-list;
  }

  &__title {
    margin-top: var(--space-2);
    text-transform: uppercase;
  }

  &__intro-grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: var(--space-6);

    @include m.tablet {
      grid-template-columns: 1fr;
      gap: var(--space-4);
    }
  }

  &__lede {
    max-width: 40ch;
    text-transform: none;
    color: var(--color-cream);
  }

  &__facts {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-4);

    @include m.mobile {
      grid-template-columns: 1fr;
    }
  }

  &__chip-list {
    @include m.chip-list;
    margin-top: var(--space-2);
  }

  // Replaces what used to be a single long-form paragraph. Three equal
  // columns at desktop (each a self-contained beat: Challenge / Approach /
  // Result), stacked with hairline-separated rows once there's no room to
  // read three columns side by side.
  &__narrative {
    margin-top: var(--space-6);
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-5);
    padding-top: var(--space-5);
    @include m.hairline(top);

    @include m.tablet {
      grid-template-columns: 1fr;
      gap: var(--space-4);
    }
  }

  &__narrative-item {
    max-width: 42ch;

    .type-eyebrow {
      margin-bottom: var(--space-2);
    }

    p:not(.type-eyebrow) {
      font-size: var(--fs-body-lg);
      color: var(--color-cream-dim);
    }
  }

  &__links {
    margin-top: var(--space-5);
    display: flex;
    gap: var(--space-4);
    flex-wrap: wrap;
  }

  // Masonry-style overview via CSS columns: each image keeps its own natural
  // aspect ratio instead of being stretched edge to edge, so a tall portrait
  // shot and a wide landscape shot sit naturally side by side.
  &__gallery {
    column-count: 2;
    column-gap: var(--space-4);
    padding-block: var(--space-6);

    @include m.laptop {
      column-count: 1;
    }
  }

  &__gallery-item {
    display: block;
    width: 100%;
    break-inside: avoid;
    margin-bottom: var(--space-4);
    overflow: hidden;

    img {
      width: 100%;
      height: auto;
      display: block;
    }
  }

  &__nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-block: var(--space-6);
    @include m.hairline(top);

    @include m.tablet {
      flex-direction: column;
      gap: var(--space-3);
      align-items: flex-start;
    }
  }

  // Tight rectangle-behind-text chip rather than a plain text link — a solid
  // cream plane hugging the label closely, flipping to the accent color on
  // hover. Deliberately snugger padding than the homepage's MagneticButton
  // (that one stays untouched); this is its own, tighter-fitting style.
  &__nav-btn {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    background: var(--color-cream);
    color: var(--color-ink);
    font-family: var(--font-body);
    font-weight: 700;
    font-size: var(--fs-small);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
    padding: 8px 12px;
    transition: background-color 0.3s var(--ease-premium), color 0.3s var(--ease-premium);

    &:hover {
      background: var(--color-accent);
      color: var(--color-cream);
    }
  }

  &__nav-arrow {
    font-size: 1.05em;
    line-height: 1;
  }
}
</style>
