<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { projects as allProjects, categories } from '@/data/projects'
import { useHead } from '@/composables/useHead'
import { staggerUpOnScroll } from '@/animations/reveal'
import SplitText from '@/components/ui/SplitText.vue'
import ProjectCard from '@/components/work/ProjectCard.vue'

useHead(() => ({
  title: 'Work | VISULOX',
  description: 'Selected branding, web design, development and creative direction work by VISULOX / Louis Lefebure.'
}))

const activeCategory = ref<string>('All')
const gridEl = ref<HTMLElement | null>(null)

const filters = ['All', ...categories]

const filteredProjects = computed(() =>
  activeCategory.value === 'All'
    ? allProjects
    : allProjects.filter((p) => p.categories.includes(activeCategory.value as (typeof p.categories)[number]))
)

function setCategory(cat: string) {
  activeCategory.value = cat
  nextTick(() => {
    if (!gridEl.value) return
    staggerUpOnScroll(gridEl.value.querySelectorAll('.project-card'), gridEl.value, { y: 32, stagger: 0.06 })
  })
}

onMounted(() => {
  if (!gridEl.value) return
  staggerUpOnScroll(gridEl.value.querySelectorAll('.project-card'), gridEl.value, { y: 48, stagger: 0.08 })
})
</script>

<template>
  <div class="work-page">
    <header class="work-page__header section container">
      <p class="type-eyebrow">Archive · 2023 to 2025</p>
      <h1 class="type-display-lg work-page__title">
        <SplitText text="Selected Work" as="span" by="chars" :scroll-trigger="false" />
      </h1>

      <nav class="work-page__filters" aria-label="Filter projects by category">
        <button
          v-for="cat in filters"
          :key="cat"
          class="work-page__filter"
          :class="{ 'is-active': activeCategory === cat }"
          @click="setCategory(cat)"
        >
          {{ cat }}
        </button>
      </nav>
    </header>

    <div ref="gridEl" class="work-page__grid container">
      <ProjectCard
        v-for="(p, i) in filteredProjects"
        :key="p.slug"
        :project="p"
        :size="i % 4 === 0 ? 'tall' : 'wide'"
        :class="i % 4 === 0 ? 'work-page__card--tall' : ''"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins' as m;

.work-page {
  padding-top: var(--nav-height);

  &__header {
    padding-bottom: var(--space-5);
  }

  &__title {
    margin-top: var(--space-2);
  }

  &__filters {
    margin-top: var(--space-5);
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  &__filter {
    font-family: var(--font-body);
    font-size: var(--fs-small);
    font-weight: 600;
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    color: var(--color-cream-dim);
    border: 1px solid var(--color-border-strong);
    padding: var(--space-1) var(--space-3);
    transition: color 0.3s var(--ease-premium), border-color 0.3s var(--ease-premium),
      background-color 0.3s var(--ease-premium);

    &:hover {
      color: var(--color-cream);
      border-color: var(--color-cream-dim);
    }

    &.is-active {
      background: var(--color-accent);
      border-color: var(--color-accent);
      color: var(--color-cream);
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-4);
    padding-bottom: var(--space-7);

    @include m.laptop {
      grid-template-columns: repeat(2, 1fr);
    }

    @include m.tablet {
      grid-template-columns: 1fr;
    }
  }

  &__card--tall {
    grid-row: span 2;

    @include m.tablet {
      grid-row: auto;
    }
  }
}
</style>
