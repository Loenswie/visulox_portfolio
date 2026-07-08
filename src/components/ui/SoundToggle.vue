<script setup lang="ts">
import { useSound } from '@/composables/useSound'

const { enabled, toggle } = useSound()
</script>

<template>
  <button
    class="sound-toggle"
    :class="{ 'is-on': enabled }"
    :aria-pressed="enabled"
    aria-label="Toggle ambient sound"
    title="Toggle ambient sound"
    @click="toggle"
  >
    <span class="sound-toggle__bars" aria-hidden="true">
      <span class="sound-toggle__bar" />
      <span class="sound-toggle__bar" />
      <span class="sound-toggle__bar" />
    </span>
    <span>{{ enabled ? 'Sound on' : 'Sound off' }}</span>
  </button>
</template>

<style lang="scss" scoped>
.sound-toggle {
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

  &__bars {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    width: 16px;
    height: 12px;
  }

  &__bar {
    display: inline-block;
    width: 3px;
    height: 40%;
    background: var(--color-cream-faint);
    transition: height 0.3s var(--ease-premium), background-color 0.3s var(--ease-premium);
  }

  &:hover &__bar {
    background: var(--color-cream-dim);
  }

  &.is-on &__bar {
    background: var(--color-accent);
    animation: sound-bounce 0.9s ease-in-out infinite;

    &:nth-child(1) {
      animation-delay: 0s;
    }
    &:nth-child(2) {
      animation-delay: 0.15s;
    }
    &:nth-child(3) {
      animation-delay: 0.3s;
    }
  }
}

@keyframes sound-bounce {
  0%,
  100% {
    height: 30%;
  }
  50% {
    height: 100%;
  }
}
</style>
