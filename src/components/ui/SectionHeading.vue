<script setup lang="ts">
import SplitText from './SplitText.vue'

interface Props {
  eyebrow?: string
  title: string
  align?: 'left' | 'right'
}

withDefaults(defineProps<Props>(), { align: 'left' })
</script>

<template>
  <div class="section-heading" :class="`section-heading--${align}`">
    <p v-if="eyebrow" class="type-eyebrow section-heading__eyebrow">{{ eyebrow }}</p>
    <h2 class="type-display-lg section-heading__title">
      <SplitText :text="title" as="span" by="words" />
    </h2>
  </div>
</template>

<style lang="scss" scoped>
.section-heading {
  max-width: 20ch;

  &--right {
    margin-left: auto;
    text-align: right;
  }

  &__eyebrow {
    margin-bottom: var(--space-2);
  }

  &__title {
    text-transform: uppercase;
  }
}
</style>
