<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fadeUpOnScroll } from '@/animations/reveal'
import SplitText from '@/components/ui/SplitText.vue'
import MagneticButton from '@/components/ui/MagneticButton.vue'

const sectionEl = ref<HTMLElement | null>(null)

const socials = [
  { label: 'Behance', href: 'https://behance.net/visulox' },
  { label: 'Instagram', href: 'https://instagram.com/visulox' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/louis-lefebure-057a33280/' }
]

onMounted(() => {
  if (sectionEl.value) fadeUpOnScroll(sectionEl.value.querySelector('.finale__socials'), { y: 24 })
})
</script>

<template>
  <section id="finale" ref="sectionEl" class="finale section" aria-label="Contact">
    <!-- Subject looks camera-left into the empty grey space the headline sits in. -->
    <div class="finale__bg" aria-hidden="true">
      <img src="/looking.jpg" alt="" loading="lazy" decoding="async" />
      <div class="finale__bg-wash" />
    </div>

    <div class="container finale__content">
      <p class="type-eyebrow finale__eyebrow">Let's talk</p>
      <!-- Same sentence as before, split across 3 lines so "your vision" lands on his eyeline. -->
      <h2 class="type-display-lg finale__title">
        <span class="finale__title-line"><SplitText text="Let's bring" as="span" by="words" /></span>
        <span class="finale__title-line finale__title-line--accent">
          <SplitText text="your vision" as="span" by="words" :delay="0.1" />
        </span>
        <span class="finale__title-line"><SplitText text="into view." as="span" by="words" :delay="0.2" /></span>
      </h2>

      <div class="finale__actions">
        <MagneticButton label="Contact me" href="mailto:louis.lefebure@outlook.com" cursor-label="Say hi" />
        <MagneticButton label="View projects" to="/work" variant="ghost" />
      </div>

      <ul class="finale__socials">
        <li v-for="s in socials" :key="s.label">
          <a :href="s.href" target="_blank" rel="noopener noreferrer" v-magnetic="0.3">{{ s.label }} ↗</a>
        </li>
      </ul>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins' as m;

.finale {
  position: relative;
  text-align: left;
  min-height: 100svh;
  display: flex;
  align-items: center;
  overflow: hidden;

  @include m.mobile {
    min-height: 80vh;
  }

  &__bg {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  &__bg img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 62% center;
    filter: grayscale(1) contrast(1.05);
  }

  // Guarantees the black text stays readable regardless of exactly how the photo crops.
  &__bg-wash {
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, rgba(255, 251, 245, 0.35) 0%, rgba(255, 251, 245, 0.08) 55%, transparent 75%);
  }

  &__content {
    position: relative;
    z-index: 1;
  }

  &__eyebrow {
    color: var(--color-ink);
  }

  &__title {
    margin-top: var(--space-3);
    color: var(--color-ink);
  }

  &__title-line {
    display: block;

    &--accent {
      color: var(--color-accent);
    }
  }

  &__actions {
    margin-top: var(--space-6);
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    // MagneticButton is tuned cream-on-dark elsewhere; overridden here only.
    :deep(.magnetic-btn) {
      &.magnetic-btn--primary,
      &.magnetic-btn--ghost {
        color: var(--color-ink);
      }
    }

    :deep(.magnetic-btn__circle) {
      border-color: rgba(5, 5, 5, 0.3);
    }

    :deep(.magnetic-btn:hover .magnetic-btn__circle) {
      background: var(--color-accent);
      border-color: var(--color-accent);
    }
  }

  &__socials {
    margin-top: var(--space-6);
    display: flex;
    gap: var(--space-4);

    a {
      font-family: var(--font-body);
      font-size: var(--fs-small);
      font-weight: 600;
      letter-spacing: var(--tracking-wide);
      text-transform: uppercase;
      color: var(--color-ink);
      transition: color 0.3s var(--ease-premium);

      &:hover {
        color: var(--color-accent);
      }
    }
  }
}
</style>
