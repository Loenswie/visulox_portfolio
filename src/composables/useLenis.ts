import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null
let refCount = 0

// The ticker callback is bound to the module (not to a given Lenis instance)
// exactly once, ever. Previously `init()` re-added a *new* `gsap.ticker.add`
// callback every time it ran after a `destroy()` (e.g. repeated mount/unmount
// during dev HMR) — each stale callback stuck around forever since `destroy()`
// never removed it, so every animation frame did progressively more redundant
// work the longer a session went on. Guarding with a plain module-level flag
// means the callback is attached once and simply no-ops (via `lenis?.raf`)
// whenever there's no live instance.
let tickerBound = false

/**
 * Single shared Lenis instance for the whole app, synced to GSAP's ticker so
 * ScrollTrigger and smooth-scroll never fight over the same frame.
 * Reference-counted: safe to call from multiple components, torn down only
 * when the last consumer unmounts.
 */
export function useLenis() {
  function init() {
    refCount++
    if (lenis) return lenis

    lenis = new Lenis({
      // Shorter catch-up window than before (1.15s -> 0.8s) — the scroll
      // position settles into place noticeably quicker after each input,
      // which means less sustained per-frame interpolation work trailing
      // every scroll/wheel event. Still eased (not instant/native), just a
      // lighter touch than before.
      duration: 0.8,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 1
    })

    lenis.on('scroll', ScrollTrigger.update)

    if (!tickerBound) {
      gsap.ticker.add((time) => {
        lenis?.raf(time * 1000)
      })
      gsap.ticker.lagSmoothing(0)
      tickerBound = true
    }

    return lenis
  }

  function destroy() {
    refCount = Math.max(0, refCount - 1)
    if (refCount === 0 && lenis) {
      lenis.destroy()
      lenis = null
    }
  }

  function scrollTo(target: string | number | HTMLElement, opts: Record<string, unknown> = {}) {
    lenis?.scrollTo(target as any, { duration: 1.4, easing: (t: number) => 1 - Math.pow(1 - t, 3), ...opts })
  }

  function stop() {
    lenis?.stop()
  }

  function start() {
    lenis?.start()
  }

  return { init, destroy, scrollTo, stop, start, instance: () => lenis }
}
