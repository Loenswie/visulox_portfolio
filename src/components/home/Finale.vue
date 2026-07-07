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
    <div class="container">
      <p class="type-eyebrow finale__eyebrow">Let's talk</p>
      <h2 class="type-display-lg finale__title">
        <SplitText text="Let's bring your vision into view." as="span" by="words" />
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
  @include m.hairline(top);
  text-align: left;

  &__title {
    margin-top: var(--space-3);
    max-width: 18ch;
  }

  &__actions {
    margin-top: var(--space-6);
    display: flex;
    align-items: center;
    flex-wrap: wrap;
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
      color: var(--color-cream-dim);
      transition: color 0.3s var(--ease-premium);

      &:hover {
        color: var(--color-accent);
      }
    }
  }
}
</style>
