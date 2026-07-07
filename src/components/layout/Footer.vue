<script setup lang="ts">
import { useLenis } from '@/composables/useLenis'
import SocialIcon from '@/components/ui/SocialIcon.vue'

const lenis = useLenis()
const year = new Date().getFullYear()

const socials = [
  { label: 'Behance', icon: 'behance' as const, href: 'https://behance.net/visulox' },
  { label: 'Instagram', icon: 'instagram' as const, href: 'https://instagram.com/visulox' },
  { label: 'LinkedIn', icon: 'linkedin' as const, href: 'https://www.linkedin.com/in/louis-lefebure-057a33280/' }
]

function backToTop() {
  lenis.scrollTo(0)
}
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <div class="footer__brand">
        <p class="footer__wordmark">VISULOX</p>
        <p class="footer__quote">The art of creating your vision.</p>
      </div>

      <ul class="footer__socials" aria-label="Social links">
        <li v-for="s in socials" :key="s.label">
          <a :href="s.href" target="_blank" rel="noopener noreferrer" v-magnetic="0.3">
            <SocialIcon :name="s.icon" />
            <span>{{ s.label }}</span>
          </a>
        </li>
      </ul>

      <div class="footer__meta">
        <button class="footer__top" v-magnetic="0.3" @click="backToTop">Back to top ↑</button>
        <p class="footer__copy">© {{ year }} Louis Lefebure.</p>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins' as m;

.footer {
  border-top: 1px solid var(--color-border);
  padding-block: var(--space-6) var(--space-4);

  &__inner {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr;
    gap: var(--space-4);

    @include m.tablet {
      grid-template-columns: 1fr;
      gap: var(--space-4);
    }
  }

  &__wordmark {
    font-family: var(--font-display);
    font-size: clamp(1.8rem, 4vw, 2.6rem);
    letter-spacing: var(--tracking-tighter);
  }

  &__quote {
    margin-top: var(--space-2);
    font-size: var(--fs-small);
    color: var(--color-cream-dim);
    font-style: italic;
    max-width: 28ch;
  }

  &__socials {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    align-self: start;

    a {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      font-family: var(--font-body);
      font-size: var(--fs-body);
      font-weight: 600;
      color: var(--color-cream-dim);
      transition: color 0.3s var(--ease-premium);

      .social-icon {
        transition: transform 0.4s var(--ease-premium), color 0.3s var(--ease-premium);
      }

      &:hover {
        color: var(--color-accent);

        .social-icon {
          transform: scale(1.15) rotate(-8deg);
        }
      }
    }
  }

  &__meta {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-3);
  }

  &__top {
    @include m.eyebrow;
    color: var(--color-cream);
    border-bottom: 1px solid var(--color-border-strong);
    padding-bottom: 2px;
  }

  &__copy {
    font-size: var(--fs-micro);
    color: var(--color-cream-faint);
  }
}
</style>
