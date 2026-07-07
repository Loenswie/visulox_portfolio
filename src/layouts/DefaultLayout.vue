<script setup lang="ts">
import { gsap } from 'gsap'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'

function onEnter(el: Element, done: () => void) {
  gsap.fromTo(el, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'expo.out', onComplete: done })
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
