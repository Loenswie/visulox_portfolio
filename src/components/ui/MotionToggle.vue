<script setup lang="ts">
import { useMotionPreference } from '@/composables/useMotionPreference'

const { reducedMotionOverride, toggle } = useMotionPreference()
</script>

<template>
  <button
    type="button"
    class="motion-toggle"
    :aria-pressed="reducedMotionOverride"
    @click="toggle"
  >
    <span class="motion-toggle__dot" aria-hidden="true" />
    <span>{{ reducedMotionOverride ? 'Motion reduced' : 'Reduce motion' }}</span>
  </button>
</template>

<style lang="scss" scoped>
.motion-toggle {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-body);
  font-size: var(--fs-micro);
  font-weight: 600;
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--color-cream-dim);
  transition: color 0.3s var(--ease-premium);

  &:hover {
    color: var(--color-cream);
  }

  &__dot {
    width: 7px;
    height: 7px;
    flex-shrink: 0;
    background: var(--color-cream-faint);
    transform: rotate(45deg);
    transition: background-color 0.3s var(--ease-premium);
  }

  &[aria-pressed='true'] &__dot {
    background: var(--color-accent);
  }
}
</style>
