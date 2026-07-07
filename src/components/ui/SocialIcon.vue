<script setup lang="ts">
interface Props {
  name: 'behance' | 'instagram' | 'linkedin'
}

defineProps<Props>()
</script>

<template>
  <svg
    v-if="name === 'instagram'"
    class="social-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
  </svg>

  <svg
    v-else-if="name === 'linkedin'"
    class="social-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="8.2" cy="8.4" r="1" fill="currentColor" stroke="none" />
    <line x1="8.2" y1="11.2" x2="8.2" y2="16.5" stroke-width="1.8" />
    <path d="M11.6 16.5v-3.4c0-1.4 0.9-2.3 2-2.3s1.9 0.8 1.9 2.3v3.4" stroke-width="1.8" stroke-linecap="round" />
  </svg>

  <svg
    v-else
    class="social-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <path d="M6.5 9.5h4.2c1.2 0 2 0.6 2 1.7s-0.8 1.7-2 1.7H6.5z" stroke-width="1.5" />
    <path d="M6.5 12.9h4.6c1.3 0 2.2 0.7 2.2 1.9s-0.9 1.7-2.2 1.7H6.5z" stroke-width="1.5" />
    <path d="M14.5 12.2c0-1.7 1.2-2.9 2.8-2.9s2.7 1.2 2.7 2.9c0 0.2 0 0.4-0.1 0.6h-4.9" stroke-width="1.5" />
    <path d="M14.5 13.9c0.3 1.1 1.2 1.8 2.4 1.8 0.9 0 1.7-0.4 2.2-1.1" stroke-width="1.5" stroke-linecap="round" />
    <line x1="15.5" y1="7.2" x2="18.7" y2="7.2" stroke-width="1.5" />
  </svg>
</template>

<style lang="scss" scoped>
.social-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}
</style>
