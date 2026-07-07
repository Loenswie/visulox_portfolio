<script setup lang="ts">
import { useHead } from '@/composables/useHead'
import MagneticButton from '@/components/ui/MagneticButton.vue'

useHead(() => ({ title: 'Page not found | VISULOX' }))
</script>

<template>
  <section class="not-found">
    <div class="container not-found__inner">
      <p class="type-eyebrow">404</p>
      <h1 class="type-display-lg not-found__title">This page wandered off.</h1>
      <p class="not-found__copy">The page you're looking for doesn't exist, or has moved.</p>
      <div class="not-found__actions">
        <MagneticButton label="Back home" to="/" />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.not-found {
  min-height: 80svh;
  display: flex;
  align-items: center;
  padding-top: var(--nav-height);

  &__title {
    margin-top: var(--space-2);
  }

  &__copy {
    margin-top: var(--space-3);
    color: var(--color-cream-dim);
    max-width: 40ch;
  }

  &__actions {
    margin-top: var(--space-5);
  }
}
</style>
