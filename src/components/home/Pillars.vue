<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { staggerUpOnScroll } from '@/animations/reveal'

const listEl = ref<HTMLElement | null>(null)

// Hovered row drives the side preview image — index into `pillars`, null
// when nothing is hovered (panel hidden).
const activeIndex = ref<number | null>(null)

const pillars = [
  {
    index: '01',
    title: 'Visual Identity',
    summary: 'Marks and systems built to hold up outside a moodboard.',
    detail: 'Strategy, naming, visual identity and the guidelines to keep it intact once it leaves my hands.',
    tags: ['Strategy', 'Identity', 'Guidelines'],
    image: 'https://picsum.photos/seed/visulox-pillar-identity/900/1200'
  },
  {
    index: '02',
    title: 'Campaigns',
    summary: 'One idea, carried consistently across every touchpoint.',
    detail: 'Art direction, key visuals and templated systems that scale across print, social and screen.',
    tags: ['Art Direction', 'Social', 'Print'],
    image: 'https://picsum.photos/seed/visulox-pillar-campaigns/900/1200'
  },
  {
    index: '03',
    title: 'Packaging',
    summary: 'Structural and print design worth picking up off the shelf.',
    detail: 'From structural concepts to print-ready files, built to survive production, not just a render.',
    tags: ['Structural Design', 'Print', 'Prototyping'],
    image: 'https://picsum.photos/seed/visulox-pillar-packaging/900/1200'
  },
  {
    index: '04',
    title: 'Web Design',
    summary: 'Interfaces engineered to feel considered, not templated.',
    detail: 'Editorial layout, motion systems and interaction craft, built for people and tuned for performance.',
    tags: ['UX', 'Art Direction', 'Motion'],
    image: 'https://picsum.photos/seed/visulox-pillar-webdesign/900/1200'
  },
  {
    index: '05',
    title: 'Development',
    summary: 'The code that actually carries the vision through.',
    detail: 'Vue, TypeScript and a design-system mindset, where build quality is part of the craft.',
    tags: ['Vue 3', 'TypeScript', 'Performance'],
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
    <!-- Section no longer carries a visible display title — the oversized
         row titles themselves are the heading now. Kept as a real heading
         for document outline / screen-reader users, just visually hidden. -->
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

        <!-- Anchored to this row specifically (not a viewport-fixed panel),
             so the image always sits right where its own title is, at the
             side, regardless of how far down the page that row happens to
             be. Only mounted while this exact row is hovered, so the other
             four images never load over the network at all until hovered. -->
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
    // Tight, table-of-contents rhythm — rows sit right against each other
    // rather than floating with generous space around them; the number +
    // title alone (no permanently-visible summary line anymore) carry the
    // section on their own size/weight.
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

  // Numbers matched 1:1 to the title's size/line-height so both read as one
  // oversized, kinetic block rather than a small label next to a big word.
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

  // The actual reason the gap wasn't closing: .pillars__detail had THREE
  // direct children (lead, detail paragraph, tags list). Grid only collapses
  // the ONE explicit 0fr row — anything past the first child falls into an
  // auto-generated implicit row that ignores grid-template-rows entirely and
  // keeps its natural height regardless of the 0fr/opacity state. Wrapping
  // all three in a single child makes that child the sole grid item, so the
  // whole block now genuinely collapses to zero instead of just fading out
  // while still occupying its full layout height.
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

  // Anchored to its own row (the `<li>` above is `position: relative`), so
  // it always sits exactly at that row's title, on the right — not tied to
  // the pointer, not fixed to the viewport centre. Absolutely positioned
  // elements stack above normal-flow siblings by default, so this needs no
  // z-index gymnastics to sit above neighbouring rows.
  &__item-preview {
    position: absolute;
    top: 50%;
    right: 0;
    // Explicit z-index (not just relying on DOM order) — the image is taller
    // than a single row and deliberately overflows into the rows above/below
    // it, so without this the *next* li's own paint (its hairline, its text)
    // would otherwise land on top of the overflow and clip it.
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
      filter: grayscale(0.5) contrast(1.05);
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
