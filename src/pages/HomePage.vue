<script setup lang="ts">
import { useHead } from '@/composables/useHead'
import Hero from '@/components/home/Hero.vue'
import StatsStrip from '@/components/home/StatsStrip.vue'
import Pillars from '@/components/home/Pillars.vue'
import WorkPreview from '@/components/home/WorkPreview.vue'
import Finale from '@/components/home/Finale.vue'

useHead(() => ({
  title: 'Home | VISULOX',
  description:
    'VISULOX is the creative identity of Louis Lefebure, a graphic designer working across branding, campaigns and digital experiences, with front-end development to bring it all to life. The art of creating your vision.',
  image: '/Profielfoto_Grungy.jpg'
}))
</script>

<template>
  <div class="home-page">
    <Hero />
    <Pillars />
    <WorkPreview />
    <StatsStrip />
    <Finale />
  </div>
</template>
