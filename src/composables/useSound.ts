import { ref } from 'vue'

const enabled = ref(false)
let ambient: HTMLAudioElement | null = null

/** Elegant, tasteful sound toggle. Defaults to muted, kept deliberately quiet. */
export function useSound() {
  function ensureAudio() {
    if (ambient) return ambient
    ambient = new Audio('/audio.mp3')
    ambient.loop = true
    ambient.volume = 0.03
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
