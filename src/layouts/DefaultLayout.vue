<script setup lang="ts">
import { gsap } from 'gsap'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'

function onEnter(el: Element, done: () => void) {
  gsap.fromTo(
    el,
    { autoAlpha: 0, y: 24 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.7,
      ease: 'expo.out',
      // Without this, GSAP leaves an inline `transform: translate3d(0,0,0)`
      // on the page root even after the tween finishes — a no-op visually,
      // but any element with a `transform` becomes a new containing block
      // for `position: fixed` descendants. That silently broke every
      // ScrollTrigger `pin: true` section on every routed page: the pinned
      // element was going "fixed" relative to this transformed page wrapper
      // instead of the actual viewport, so it just scrolled normally instead
      // of holding in place. Clearing all GSAP-set inline styles once the
      // transition completes removes that hazard.
      clearProps: 'all',
      onComplete: done
    }
  )
}

function onLeave(el: Element, done: () => void) {
  gsap.to(el, { autoAlpha: 0, y: -16, duration: 0.4, ease: 'power2.in', onComplete: done })
}
</script>

<template>
  <Navbar />

  <main id="main-content">
    <router-view v-slot="{ Component, route }">
      <transition :css="false" mode="out-in" @enter="onEnter" @leave="onLeave">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </main>

  <Footer />
</template>
