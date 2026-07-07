<script setup lang="ts">
import type { Project } from '@/data/projects'
import { useCustomCursor } from '@/composables/useCustomCursor'

interface Props {
  project: Project
  size?: 'tall' | 'wide'
}

withDefaults(defineProps<Props>(), { size: 'wide' })

const { setVariant, reset } = useCustomCursor()
</script>

<template>
  <router-link
    :to="`/work/${project.slug}`"
    class="project-card"
    :class="`project-card--${size}`"
    @mouseenter="setVariant('view', 'View')"
    @mouseleave="reset"
  >
    <div class="project-card__media">
      <img :src="project.thumbnail" :alt="project.title" loading="lazy" decoding="async" />
    </div>
    <div class="project-card__meta">
      <h3 class="type-display-sm project-card__title">{{ project.title }}</h3>
      <ul class="project-card__categories">
        <li v-for="cat in project.categories" :key="cat">{{ cat }}</li>
      </ul>
    </div>
    <span class="project-card__arrow" aria-hidden="true">↗</span>
  </router-link>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins' as m;

.project-card {
  position: relative;
  display: block;
  overflow: hidden;

  &__media {
    position: relative;
    overflow: hidden;
    aspect-ratio: 4 / 5;
    background: var(--color-ink-soft);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transform: scale(1.01);
      transition: transform 0.9s var(--ease-premium), filter 0.9s var(--ease-premium);
      filter: grayscale(0.6) contrast(1.05);
    }
  }

  &--wide &__media {
    aspect-ratio: 16 / 11;
  }

  &:hover &__media img {
    transform: scale(1.08);
    filter: grayscale(0) contrast(1.1);
  }

  &__meta {
    display: flex;
    flex-direction: column;
    // Tighter than the space-2 gap used elsewhere — the categories read as
    // a caption on the title, so they should sit close under it rather than
    // floating with a full spacing-scale gap in between.
    gap: 6px;
    margin-top: var(--space-3);
  }

  &__title {
    text-transform: uppercase;
  }

  // Light chip on dark background, sharp corners (no border-radius) —
  // deliberately high-contrast so the categories read as distinct tags
  // rather than a plain inline text line. Shared with the project detail
  // hero and the services/technologies lists via the chip-list mixin.
  &__categories {
    @include m.chip-list;
  }

  &__arrow {
    position: absolute;
    top: var(--space-3);
    right: var(--space-3);
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(5, 5, 5, 0.5);
    backdrop-filter: blur(6px);
    opacity: 0;
    transform: translate(-6px, 6px) rotate(-20deg);
    transition: opacity 0.4s var(--ease-premium), transform 0.4s var(--ease-premium);
  }

  &:hover &__arrow {
    opacity: 1;
    transform: translate(0, 0) rotate(0deg);
  }
}
</style>
