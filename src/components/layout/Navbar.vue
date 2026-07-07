<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUiStore } from '@/stores/ui'
import { useLenis } from '@/composables/useLenis'
import { useLockScroll } from '@/composables/useLockScroll'

const ui = useUiStore()
const route = useRoute()
const router = useRouter()
const lenis = useLenis()
const { lock, unlock } = useLockScroll()

const isScrolled = ref(false)

function onScroll() {
  isScrolled.value = window.scrollY > 24
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

// The mobile menu never actually locked page scroll — Lenis kept running
// and the body stayed scrollable underneath it, so on a phone you could
// scroll the real page behind the (mostly opaque) menu panel; the one
// strip that IS transparent when not yet "scrolled" is the nav bar itself,
// so that scrolling page content became visible right through/behind the
// logo. Watching isMenuOpen here means every way the menu can close
// (the burger, or any of the nav-link handlers below calling
// toggleMenu(false)) reliably unlocks again too.
watch(
  () => ui.isMenuOpen,
  (open) => (open ? lock() : unlock())
)

onBeforeUnmount(() => {
  if (ui.isMenuOpen) unlock()
})

function goHome() {
  ui.toggleMenu(false)
  if (route.path !== '/') router.push('/')
  else lenis.scrollTo(0)
}

function goWork() {
  ui.toggleMenu(false)
  router.push('/work')
}

function goContact() {
  ui.toggleMenu(false)
  if (route.path !== '/') {
    router.push('/#finale')
  } else {
    lenis.scrollTo('#finale')
  }
}

function goAbout() {
  ui.toggleMenu(false)
  router.push('/about')
}

function toggleMobileMenu() {
  ui.toggleMenu()
}
</script>

<template>
  <header class="navbar" :class="{ 'navbar--scrolled': isScrolled || ui.isMenuOpen }">
    <div class="navbar__inner container">
      <nav class="navbar__links navbar__links--left" aria-label="Primary">
        <button class="navbar__link" :class="{ 'is-active': route.path === '/' }" @click="goHome">
          <span>Home</span>
        </button>
        <button class="navbar__link" :class="{ 'is-active': route.path.startsWith('/work') }" @click="goWork">
          <span>Work</span>
        </button>
      </nav>

      <button class="navbar__logo" v-magnetic="0.2" aria-label="VISULOX Home" @click="goHome">
        <img src="/logo_white.png" alt="VISULOX" class="navbar__logo-img" />
      </button>

      <div class="navbar__right">
        <nav class="navbar__links navbar__links--right" aria-label="Secondary">
          <button class="navbar__link" :class="{ 'is-active': route.path === '/about' }" @click="goAbout">
            <span>About</span>
          </button>
          <button class="navbar__link" @click="goContact"><span>Contact</span></button>
        </nav>

        <button
          class="navbar__burger"
          :class="{ 'is-open': ui.isMenuOpen }"
          :aria-expanded="ui.isMenuOpen"
          aria-label="Toggle menu"
          @click="toggleMobileMenu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </div>

    <Transition name="mobile-menu">
      <div
        v-if="ui.isMenuOpen"
        class="navbar__mobile"
        id="mobile-menu"
        @click.self="ui.toggleMenu(false)"
      >
        <button class="navbar__mobile-link" @click="goHome">Home</button>
        <button class="navbar__mobile-link" @click="goWork">Work</button>
        <button class="navbar__mobile-link" @click="goAbout">About</button>
        <button class="navbar__mobile-link" @click="goContact">Contact</button>
        <p class="navbar__mobile-quote">"The art of creating your vision."</p>
      </div>
    </Transition>
  </header>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins' as m;

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-nav);
  height: var(--nav-height);
  transition: background-color 0.5s var(--ease-premium), backdrop-filter 0.5s var(--ease-premium), border-color 0.5s var(--ease-premium);
  border-bottom: 1px solid transparent;

  &--scrolled {
    background: rgba(5, 5, 5, 0.72);
    backdrop-filter: blur(14px) saturate(140%);
    border-bottom-color: var(--color-border);
  }

  // 1fr / auto / 1fr keeps the logo mathematically centered on the row at
  // every breakpoint: the two outer tracks always share the remaining space
  // equally, regardless of how much content (or none) sits in them.
  &__inner {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: var(--space-4);

    // The centered-logo grid isn't worth fighting at phone width — once the
    // links are hidden and it's just the logo + burger left, a plain flex
    // row with space-between (logo left, burger right) is simpler and more
    // predictable than trying to keep the 3-column grid math centered.
    @include m.mobile {
      display: flex;
      justify-content: space-between;
    }
  }

  &__logo {
    display: inline-flex;
    align-items: center;
    justify-self: center;
    height: 34px;

    &-img {
      height: 100%;
      width: auto;
    }
  }

  &__links {
    display: flex;
    gap: var(--space-4);

    // Kept as a real, non-hamburger nav all the way down to the actual
    // phone breakpoint — it used to switch at the laptop tier (1080px),
    // which meant tablets/iPads lost the full nav way earlier than needed.
    @include m.mobile {
      display: none;
    }

    &--left {
      justify-self: start;
    }
  }

  &__right {
    display: flex;
    align-items: center;
    justify-self: end;
    gap: var(--space-4);
  }

  // Hover/active state is a rectangular plane that wipes in left-to-right
  // behind the label (not an underline), and the button itself never moves —
  // only the fill and the text color transition.
  &__link {
    position: relative;
    overflow: hidden;
    font-family: var(--font-body);
    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    color: var(--color-cream-dim);
    padding: 5px 9px;
    transition: color 0.35s var(--ease-premium);

    span {
      position: relative;
      z-index: 1;
    }

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--color-accent);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.45s var(--ease-premium);
    }

    &:hover,
    &.is-active {
      color: var(--color-cream);
    }

    &:hover::before,
    &.is-active::before {
      transform: scaleX(1);
    }
  }

  &__burger {
    display: none;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    width: 34px;
    margin-right: 2px;
    height: 22px;

    @include m.mobile {
      display: flex;
    }

    span {
      display: block;
      height: 1px;
      width: 100%;
      background: var(--color-cream);
      transition: transform 0.4s var(--ease-premium), opacity 0.3s var(--ease-premium);
    }

    // 3 lines at rest; opening collapses the middle one and rotates the
    // outer two into an X, rather than only ever having 2 lines.
    &.is-open span:nth-child(1) {
      transform: translateY(6px) rotate(45deg);
    }

    &.is-open span:nth-child(2) {
      opacity: 0;
    }

    &.is-open span:nth-child(3) {
      transform: translateY(-6px) rotate(-45deg);
    }
  }

  &__mobile {
    display: none;

    @include m.mobile {
      display: flex;
    }
    position: fixed;
    width: 100%;
    z-index: 1;
    transform: translateZ(0);
    background: var(--color-ink);
    flex-direction: column;
    justify-content: center;
    gap: var(--space-3);
    padding: var(--space-5) var(--gutter);
  }
  

  &__mobile-link {
    font-family: var(--font-display);
    font-size: clamp(1.8rem, 8vw, 2.6rem);
    letter-spacing: var(--tracking-tight);
    text-align: left;
    color: var(--color-cream);
    text-transform: uppercase;
  }

  &__mobile-link:active {
    background-color: var(--color-cream);
    color: var(--color-ink);
  }

  &__mobile-quote {
    margin-top: var(--space-4);
    font-family: var(--font-body);
    font-size: var(--fs-small);
    color: var(--color-cream-dim);
    font-style: italic;
  }
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.35s var(--ease-premium), transform 0.35s var(--ease-premium);
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
