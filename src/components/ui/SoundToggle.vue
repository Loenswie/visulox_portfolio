<!--
  DEPRECATED / UNUSED: the sound toggle was removed from the navbar per
  feedback. Kept in place rather than deleted. Safe to remove later, along
  with src/composables/useSound.ts.
-->
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
    @click="toggle"
  >
    <span class="sound-toggle__bar" />
    <span class="sound-toggle__bar" />
    <span class="sound-toggle__bar" />
  </button>
</template>

<style lang="scss" scoped>
.sound-toggle {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  width: 22px;
  height: 16px;

  &__bar {
    display: inline-block;
    width: 3px;
    height: 40%;
    background: var(--color-cream-faint);
    border-radius: 2px;
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
