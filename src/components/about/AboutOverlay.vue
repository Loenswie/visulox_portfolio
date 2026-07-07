<!--
  DEPRECATED / UNUSED: About is now a dedicated routed page, see
  src/pages/AboutPage.vue (see task history — the overlay was converted to a
  page). This component is not imported anywhere.

  It used to reference `ui.isAboutOpen` / `ui.closeAbout()`, both of which
  were removed from the ui store once the overlay went away — that's what
  was breaking the production TypeScript build (`vue-tsc` type-checks every
  .vue file under src, whether or not anything actually imports it). Stubbed
  down to inert markup, same treatment as GrainOverlay.vue, rather than
  deleted (files can't be deleted in this environment).
-->
<template>
  <div class="about-overlay-deprecated" aria-hidden="true" style="display: none" />
</template>
