<script setup lang="ts">
import { computed } from 'vue'
import { useCustomCursor } from '@/composables/useCustomCursor'

interface Props {
  label: string
  to?: string
  href?: string
  variant?: 'primary' | 'ghost'
  cursorLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  cursorLabel: ''
})

const emit = defineEmits<{ click: [] }>()
const { setVariant, reset } = useCustomCursor()

const tag = computed(() => (props.href ? 'a' : props.to ? 'router-link' : 'button'))

function onEnter() {
  setVariant(props.cursorLabel ? 'view' : 'hover', props.cursorLabel)
}
</script>

<template>
  <component
    :is="tag"
    v-magnetic="0.3"
    class="magnetic-btn"
    :class="`magnetic-btn--${variant}`"
    :to="to"
    :href="href"
    :target="href ? '_blank' : undefined"
    :rel="href ? 'noopener noreferrer' : undefined"
    @mouseenter="onEnter"
    @mouseleave="reset"
    @click="emit('click')"
  >
    <span class="magnetic-btn__label">{{ label }}</span>
    <span class="magnetic-btn__circle" aria-hidden="true">→</span>
  </component>
</template>

<style lang="scss" scoped>
.magnetic-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  font-family: var(--font-body);
  font-weight: 700;
  font-size: var(--fs-small);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  padding: var(--space-2) var(--space-2);
  transition: gap 0.4s var(--ease-premium);

  &:hover {
    gap: var(--space-4);
  }

  &__circle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border: 1px solid var(--color-border-strong);
    transition: background-color 0.4s var(--ease-premium), border-color 0.4s var(--ease-premium),
      transform 0.4s var(--ease-premium);
  }

  &:hover &__circle {
    background: var(--color-accent);
    border-color: var(--color-accent);
    transform: rotate(45deg);
  }

  &--primary {
    color: var(--color-cream);
  }

  &--ghost {
    color: var(--color-cream-dim);
  }
}
</style>
