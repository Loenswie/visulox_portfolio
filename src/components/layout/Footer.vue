<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLenis } from '@/composables/useLenis'
import MotionToggle from '@/components/ui/MotionToggle.vue'
import SoundToggle from '@/components/ui/SoundToggle.vue'

const route = useRoute()
const router = useRouter()
const lenis = useLenis()
const year = new Date().getFullYear()

const socials = [
  { label: 'Behance', href: 'https://behance.net/visulox' },
  { label: 'Instagram', href: 'https://instagram.com/visulox' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/louis-lefebure-057a33280/' }
]

// Zedelgem is Europe/Brussels — Intl resolves DST automatically.
const clockTime = ref('')
const clockDate = ref('')
let clockInterval: ReturnType<typeof setInterval> | undefined

function updateClock() {
  const now = new Date()
  clockTime.value = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Brussels',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(now)

  clockDate.value = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Brussels',
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZoneName: 'shortOffset'
  }).format(now)
}

onMounted(() => {
  updateClock()
  clockInterval = setInterval(updateClock, 1000)
})

onBeforeUnmount(() => {
  if (clockInterval) clearInterval(clockInterval)
})

function backToTop() {
  lenis.scrollTo(0)
}

function goHome() {
  if (route.path !== '/') router.push('/')
  else lenis.scrollTo(0)
}

function goWork() {
  router.push('/work')
}

function goAbout() {
  router.push('/about')
}

function goContact() {
  if (route.path !== '/') router.push('/#finale')
  else lenis.scrollTo('#finale')
}
</script>

<template>
  <footer class="footer">
    <div class="container footer__main">
      <nav class="footer__nav" aria-label="Footer navigation">
        <p class="type-eyebrow footer__eyebrow">Navigation</p>
        <button class="footer__nav-link" @click="goHome">Home</button>
        <button class="footer__nav-link" @click="goWork">Work</button>
        <button class="footer__nav-link" @click="goAbout">About</button>
        <button class="footer__nav-link" @click="goContact">Contact</button>
      </nav>

      <div class="footer__socials-col">
        <p class="type-eyebrow footer__eyebrow">Socials</p>
        <ul class="footer__socials" aria-label="Social links">
          <li v-for="s in socials" :key="s.label">
            <a :href="s.href" target="_blank" rel="noopener noreferrer" v-magnetic="0.3">{{ s.label }} ↗</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="container footer__bottom">
      <p class="footer__clock">
        <span class="footer__clock-line">Zedelgem, West-Vlaanderen  ·  {{ clockTime }}</span>
        <span class="footer__clock-line footer__clock-line--dim">{{ clockDate }}</span>
      </p>

      <button class="footer__top" v-magnetic="0.3" @click="backToTop">Back to top ↑</button>

      <div class="footer__meta">
        <SoundToggle />
        <MotionToggle />
        <p class="footer__copy">© {{ year }} VISULOX. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins' as m;

.footer {
  position: relative;
  border-top: 1px solid var(--color-border);
  background: var(--color-ink);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100svh;
  padding-top: var(--space-7);
  padding-bottom: var(--space-4);

  @include m.tablet {
    min-height: 0;
    padding-top: var(--space-6);
  }

  &__main {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: var(--space-6);

    @include m.tablet {
      flex-direction: column;
      gap: var(--space-5);
    }
  }

  &__eyebrow {
    margin-bottom: var(--space-3);
  }

  &__nav {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  &__nav-link {
    font-family: var(--font-display);
    font-size: clamp(6rem, 9vw, 9rem);
    line-height: 0.95;
    letter-spacing: var(--tracking-tight);
    text-transform: uppercase;
    font-weight: 700;
    color: var(--color-cream-dim);
    transition: color 0.35s var(--ease-premium);
    padding: 0;

    @include m.tablet {
      font-size: clamp(3.5rem, 12vw, 6rem);
    }

    @include m.mobile {
      font-size: clamp(2.2rem, 13vw, 3.6rem);
    }

    @include m.fine-pointer-only {
      &:hover {
        color: var(--color-cream);
      }
    }
  }

  &__socials-col {
    align-self: start;

    @include m.tablet {
      align-self: auto;
    }
  }

  &__socials {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);

    a {
      font-family: var(--font-body);
      font-size: var(--fs-body);
      font-weight: 600;
      color: var(--color-cream-dim);
      transition: color 0.3s var(--ease-premium);

      &:hover {
        color: var(--color-accent);
      }
    }
  }

  &__bottom {
    margin-top: var(--space-6);
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--space-4);
    flex-wrap: wrap;

    @include m.mobile {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-3);
    }
  }

  &__clock {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-family: var(--font-body);
    font-weight: 600;
    font-size: var(--fs-small);
    color: var(--color-cream);
  }

  &__clock-line {
    font-variant-numeric: tabular-nums;

    &--dim {
      font-weight: 400;
      color: var(--color-cream-faint);
      font-size: var(--fs-micro);
      letter-spacing: var(--tracking-wide);
      text-transform: uppercase;
    }
  }

  &__top {
    @include m.eyebrow;
    color: var(--color-cream);
    border-bottom: 1px solid var(--color-border-strong);
    padding-bottom: 2px;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: var(--space-4);

    @include m.mobile {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-2);
    }
  }

  &__copy {
    font-size: var(--fs-small);
    font-weight: 600;
    color: var(--color-cream-dim);
  }
}
</style>
