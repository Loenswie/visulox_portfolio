<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import type { Poster } from '@/data/posters'
import { useLockScroll } from '@/composables/useLockScroll'

defineProps<{ posters: Poster[] }>()

const { lock, unlock } = useLockScroll()
const activeIndex = ref<number | null>(null)

function open(i: number) {
  activeIndex.value = i
  lock()
  // Custom cursor's difference-blend can get lost against a busy fullscreen
  // image — force a plain, always-visible style while the lightbox is open.
  document.body.classList.add('poster-lightbox-open')
  window.addEventListener('keydown', onKeydown)
}

function close() {
  activeIndex.value = null
  unlock()
  document.body.classList.remove('poster-lightbox-open')
  window.removeEventListener('keydown', onKeydown)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.classList.remove('poster-lightbox-open')
})
</script>

<template>
  <section v-if="posters.length" class="poster-gallery section container" aria-label="Posters">
    <p class="type-eyebrow poster-gallery__eyebrow">Posters</p>

    <div class="poster-gallery__grid">
      <button
        v-for="(p, i) in posters"
        :key="p.image"
        type="button"
        class="poster-gallery__item"
        @click="open(i)"
      >
        <img :src="p.image" :alt="p.title" loading="lazy" decoding="async" />
      </button>
    </div>

    <Teleport to="body">
      <div v-if="activeIndex !== null" class="poster-lightbox" @click.self="close">
        <button type="button" class="poster-lightbox__close" aria-label="Close" @click="close">✕</button>
        <img
          v-if="activeIndex !== null"
          :src="posters[activeIndex].image"
          :alt="posters[activeIndex].title"
          class="poster-lightbox__img"
        />
      </div>
    </Teleport>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins' as m;

.poster-gallery {
  &__eyebrow {
    margin-bottom: var(--space-3);
  }

  // CSS columns masonry — each poster keeps its own original aspect ratio, no cropping.
  &__grid {
    column-count: 4;
    column-gap: var(--space-3);

    @include m.laptop {
      column-count: 3;
    }

    @include m.tablet {
      column-count: 2;
    }
  }

  &__item {
    display: block;
    width: 100%;
    break-inside: avoid;
    margin-bottom: var(--space-3);
    overflow: hidden;
    background: var(--color-ink-soft);
    cursor: pointer;

    img {
      width: 100%;
      height: auto;
      display: block;
      transition: transform 0.5s var(--ease-premium);
    }

    &:hover img {
      transform: scale(1.04);
    }
  }
}

.poster-lightbox {
  position: fixed;
  inset: 0;
  z-index: var(--z-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-5);
  background: rgba(5, 5, 5, 0.94);

  &__close {
    position: absolute;
    top: var(--space-4);
    right: var(--space-4);
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 1px solid var(--color-border-strong);
    color: var(--color-cream);
    font-size: 1.1rem;
    line-height: 1;
    cursor: pointer;
    transition: background-color 0.3s var(--ease-premium), color 0.3s var(--ease-premium);

    &:hover {
      background: var(--color-cream);
      color: var(--color-ink);
    }
  }

  &__img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
}
</style>
