<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useUiStore } from '@/stores/ui'
import { useLenis } from '@/composables/useLenis'
import AppLoader from '@/components/AppLoader.vue'
import CustomCursor from '@/components/CustomCursor.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const ui = useUiStore()
const lenis = useLenis()

onMounted(() => {
  lenis.init()
})

onBeforeUnmount(() => {
  lenis.destroy()
})

function onLoaderDone() {
  ui.finishLoading()
}
</script>

<template>
  <a class="skip-link" href="#main-content">Skip to content</a>

  <AppLoader v-if="ui.isLoading" @done="onLoaderDone" />

  <CustomCursor />

  <DefaultLayout />
</template>
