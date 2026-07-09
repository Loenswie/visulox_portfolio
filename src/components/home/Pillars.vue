<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { staggerUpOnScroll } from '@/animations/reveal'

const listEl = ref<HTMLElement | null>(null)

// Index into `pillars` for the hovered row's side preview; null hides the panel.
const activeIndex = ref<number | null>(null)

const pillars = [
  {
    index: '01',
    title: 'Branding',
    summary: 'Marks and systems built to hold up outside a moodboard.',
    detail: 'Strategy, naming, visual identity and the guidelines to keep it intact once it leaves my hands.',
    tags: ['Strategy', 'Identity', 'Guidelines'],
    image: '/projects/VERRA/Label_Tag_Mockup_2.jpg'
  },
  {
    index: '02',
    title: 'Campaigns',
    summary: 'One idea, carried consistently across every touchpoint.',
    detail: 'Art direction, key visuals and templated systems that scale across print, social and screen.',
    tags: ['Art Direction', 'Social', 'Print'],
    image: '/projects/GFIETST/GFIETST_AFFICHE_V1_overzicht.jpg'
  },
  {
    index: '03',
    title: 'Packaging',
    summary: 'Structural and print design worth picking up off the shelf.',
    detail: 'From structural concepts to print-ready files, built to survive production, not just a render.',
    tags: ['Structural Design', 'Print'],
    image: '/projects/PANDA_PIXELS/Chocolate_Bar_Mockup.jpg'
  },
  {
    index: '04',
    title: 'Web Design',
    summary: 'Interfaces engineered to feel considered, not templated.',
    detail: 'Editorial layout, motion systems and interaction craft, built for people and tuned for performance.',
    tags: ['UX', 'UI', 'Art Direction'],
    image: 'https://picsum.photos/seed/visulox-pillar-webdesign/900/1200'
  },
  {
    index: '05',
    title: 'Development',
    summary: 'The code that actually carries the vision through.',
    detail: 'Vue, TypeScript and a design-system mindset, where build quality is part of the craft.',
    tags: ['Engineering', 'Performance', 'Craft'],
    image: 'https://picsum.photos/seed/visulox-pillar-webdev/900/1200'
  }
]

function showPreview(i: number) {
  activeIndex.value = i
}

function clearPreview() {
  activeIndex.value = null
}

onMounted(() => {
  if (!listEl.value) return
  staggerUpOnScroll(listEl.value.querySelectorAll('.pillars__item'), listEl.value, { y: 40 })
})
</script>

<template>
  <section class="pillars section" aria-label="What I do">
    <!-- Visually hidden — the oversized row titles are the heading now, this is just for the outline/a11y. -->
    <h2 class="sr-only">What I do</h2>

    <ul
      ref="listEl"
      class="pillars__list container"
      @mouseleave="clearPreview"
    >
      <li
        v-for="(p, i) in pillars"
        :key="p.index"
        class="pillars__item"
        @mouseenter="showPreview(i)"
      >
        <span class="pillars__index">{{ p.index }}</span>
        <div class="pillars__body">
          <h3 class="pillars__title">{{ p.title }}</h3>
          <div class="pillars__detail">
            <div class="pillars__detail-inner">
              <p class="pillars__detail-lead">{{ p.summary }}</p>
              <p>{{ p.detail }}</p>
              <ul class="pillars__tags">
                <li v-for="tag in p.tags" :key="tag">{{ tag }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Anchored to this row (not viewport-fixed); only mounted while hovered, so unhovered images never load. -->
        <Transition name="pillars-preview">
          <div v-if="activeIndex === i" class="pillars__item-preview" aria-hidden="true">
            <img :src="p.image" alt="" loading="lazy" decoding="async" />
          </div>
        </Transition>
      </li>
    </ul>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins' as m;

.pillars {
  position: relative;

  &__list {
    margin-top: var(--space-2);
  }

  &__item {
    position: relative;
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: baseline;
    column-gap: var(--space-4);
    padding-block: var(--space-2);
    @include m.hairline(top);
    transition: background-color 0.5s var(--ease-premium);

    &:last-child {
      @include m.hairline(bottom);
    }

    @include m.fine-pointer-only {
      &:hover {
        .pillars__index,
        .pillars__title {
          color: var(--color-accent);
        }
        .pillars__detail {
          grid-template-rows: 1fr;
          opacity: 1;
          margin-top: var(--space-3);
        }
      }
    }

    @include m.tablet {
      grid-template-columns: 1fr;
      row-gap: 0;
    }
  }

  &__index,
  &__title {
    font-family: var(--font-display);
    font-size: clamp(2.75rem, 7vw, 6.25rem);
    line-height: 0.94;
    letter-spacing: var(--tracking-tight);

    @include m.laptop {
      font-size: clamp(2.4rem, 8.5vw, 4.5rem);
    }
  }

  &__index {
    font-weight: 400;
    color: var(--color-cream-faint);
    transition: color 0.5s var(--ease-premium);
  }

  &__title {
    font-weight: 700;
    text-transform: uppercase;
    transition: color 0.5s var(--ease-premium);
  }

  &__detail {
    display: grid;
    grid-template-rows: 0fr;
    opacity: 0;
    transition: grid-template-rows 0.5s var(--ease-premium), opacity 0.4s var(--ease-premium),
      margin-top 0.5s var(--ease-premium);
  }

  // Single wrapping child so the grid 0fr row actually collapses to zero (extra direct children break this).
  &__detail-inner {
    overflow: hidden;
    min-height: 0;

    > p {
      overflow: hidden;
      max-width: 56ch;
      color: var(--color-cream-faint);

      &.pillars__detail-lead {
        color: var(--color-cream-dim);
        font-size: var(--fs-body-lg);
        margin-bottom: var(--space-1);
      }
    }
  }

  &__tags {
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1);
    margin-top: var(--space-2);

    li {
      font-size: var(--fs-micro);
      letter-spacing: var(--tracking-wide);
      text-transform: uppercase;
      border: 1px solid var(--color-border-strong);
      padding: 4px var(--space-2);
      color: var(--color-cream-dim);
    }
  }

  &__item-preview {
    position: absolute;
    top: 50%;
    right: 0;
    z-index: 1;
    width: min(26vw, 380px);
    aspect-ratio: 3 / 4;
    transform: translateY(-50%);
    pointer-events: none;
    overflow: hidden;

    @include m.laptop {
      display: none;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: grayscale(0.08) contrast(1.05);
    }
  }

  &-preview-enter-active,
  &-preview-leave-active {
    transition: opacity 0.35s var(--ease-premium);
  }

  &-preview-enter-from,
  &-preview-leave-to {
    opacity: 0;
  }
}
</style>
