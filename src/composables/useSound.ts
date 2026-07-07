import { ref } from 'vue'

const enabled = ref(false)
let ambient: HTMLAudioElement | null = null

/**
 * Elegant, tasteful sound toggle. Defaults to muted. If no ambient track is
 * present at /audio/ambient.mp3 (public dir) it fails silently — the toggle
 * still works as a UI affordance, it just won't produce sound until a real
 * asset is added.
 */
export function useSound() {
  function ensureAudio() {
    if (ambient) return ambient
    ambient = new Audio('/audio/ambient.mp3')
    ambient.loop = true
    ambient.volume = 0.18
    return ambient
  }

  function toggle() {
    enabled.value = !enabled.value
    const audio = ensureAudio()
    if (enabled.value) {
      audio.play().catch(() => {
        // asset missing or autoplay blocked — keep UI state without throwing
      })
    } else {
      audio.pause()
    }
  }

  return { enabled, toggle }
}
