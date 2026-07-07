import { ref, watch } from 'vue'

const STORAGE_KEY = 'visulox-reduce-motion'

function readStoredPreference(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(STORAGE_KEY) === '1'
}

// Module-level singleton, not created inside the composable function, so
// every import (component or plain .ts file) shares the exact same reactive
// flag rather than each call spinning up its own independent ref.
export const reducedMotionOverride = ref(readStoredPreference())

watch(reducedMotionOverride, (value) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, value ? '1' : '0')
})

/**
 * User-facing opt-in on top of the OS-level `prefers-reduced-motion`
 * setting (see animations/motion.ts). Deliberately one-directional: this
 * can only ever ADD reduction, never override an OS setting back to "full
 * motion" for someone who has reduced motion on system-wide.
 *
 * Scope note: most of this site's scroll-triggered/entrance animations are
 * set up once per component mount, not re-evaluated on every frame. Toggling
 * this stops any *new* animation that mounts or triggers after the change
 * (e.g. navigating to another page, revisiting a section), but won't reach
 * back in and cancel something already mid-flight on the current view.
 */
export function useMotionPreference() {
  function toggle() {
    reducedMotionOverride.value = !reducedMotionOverride.value
  }

  return { reducedMotionOverride, toggle }
}
