<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getFeaturedProjects } from '@/data/projects'
import { staggerUpOnScroll } from '@/animations/reveal'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import MagneticButton from '@/components/ui/MagneticButton.vue'
import ProjectCard from '@/components/work/ProjectCard.vue'

const projects = getFeaturedProjects().slice(0, 4)
const gridEl = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!gridEl.value) return
  staggerUpOnScroll(gridEl.value.querySelectorAll('.project-card'), gridEl.value, { y: 56, stagger: 0.1 })
})
</script>

<template>
  <section class="work-preview section" aria-label="Selected work">
    <div class="container work-preview__head">
      <SectionHeading eyebrow="Selected Work" title="Recent projects" />
      <MagneticButton label="View all work" to="/work" />
    </div>

    <div ref="gridEl" class="work-preview__grid container">
      <ProjectCard
        v-for="(p, i) in projects"
        :key="p.slug"
        :project="p"
        :size="i % 3 === 1 ? 'tall' : 'wide'"
        :class="`work-preview__card work-preview__card--${i}`"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins' as m;

.work-preview {
  &__head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--space-4);

    @include m.tablet {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  &__grid {
    margin-top: var(--space-6);
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-4);

    @include m.laptop {
      grid-template-columns: repeat(2, 1fr);
    }

    @include m.tablet {
      grid-template-columns: 1fr;
    }
  }

  &__card--0 {
    grid-column: span 2;

    @include m.laptop {
      grid-column: span 1;
    }
  }

  &__card--1 {
    margin-top: var(--space-6);

    @include m.tablet {
      margin-top: 0;
    }
  }

  &__card--3 {
    grid-column: span 2;

    @include m.laptop {
      grid-column: span 1;
    }
  }
}
</style>
