<!--
  DEPRECATED: removed for performance. This overlay sat above the entire
  page at opacity 0.05 with mix-blend-mode: overlay, which on the site's
  near-black background essentially cancels out the noise texture visually
  (overlay blend mode crushes grayscale noise toward black on a dark base),
  while still costing a full-viewport (200%x200%) fixed, infinitely-animating,
  blended layer every frame. Not visible, not free — dropped from App.vue and
  no longer @use'd in main.scss. Left in place only because files can't be
  deleted in this environment; not imported/rendered anywhere.
-->
<template>
  <div class="grain-overlay" aria-hidden="true">
    <div class="grain-overlay__layer" />
  </div>
</template>
