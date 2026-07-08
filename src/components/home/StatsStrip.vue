<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { counterOnScroll } from '@/animations/reveal'

const stripEl = ref<HTMLElement | null>(null)

// Honest numbers rather than inflated ones — this is a graduate portfolio,
// not an agency with a decade of client history, and it reads more credibly
// (not less impressively) for saying so plainly.
const stats = [
  { value: 2, suffix: '', label: 'Years of Formal Training' },
  { value: 8, suffix: '', label: 'Self-Initiated Projects' },
  { value: 12, suffix: '+', label: 'Tools & Technologies' },
  { value: 6, suffix: '', label: 'Creative Disciplines' }
]

const counterRefs = ref<(HTMLElement | null)[]>([])

// Typed against what Vue's `:ref` callback actually hands back (it can be a
// component instance, not just a DOM element, depending on what's bound) —
// narrowing to HTMLElement here rather than declaring the narrower `Element`
// type is what the inline callback below needs to type-check.
function setCounterRef(el: Element | ComponentPublicInstance | null, i: number) {
  counterRefs.value[i] = el instanceof HTMLElement ? el : null
}

onMounted(() => {
  stats.forEach((stat, i) => {
    const el = counterRefs.value[i]
    if (el && stripEl.value) counterOnScroll(el, stat.value, stripEl.value, { suffix: stat.suffix })
  })
})
</script>

<template>
  <section ref="stripEl" class="stats-strip section">
    <div class="container stats-strip__row">
      <div v-for="(stat, i) in stats" :key="stat.label" class="stats-strip__item">
        <p class="stats-strip__value type-display-lg">
          <span :ref="(el) => setCounterRef(el, i)">0</span>
        </p>
        <p class="type-eyebrow stats-strip__label">{{ stat.label }}</p>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins' as m;

.stats-strip {
  @include m.hairline(top);
  @include m.hairline(bottom);

  &__row {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: var(--space-4);

    @include m.tablet {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &__item {
    text-align: left;
  }

  &__value {
    color: var(--color-cream);
  }

  &__label {
    margin-top: var(--space-1);
  }
}
</style>
