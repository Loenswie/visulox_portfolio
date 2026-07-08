import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null
let refCount = 0
// Bound once for the module's lifetime; guards against re-adding a ticker callback on every init().
let tickerBound = false

/**
 * Single shared Lenis instance, synced to GSAP's ticker so ScrollTrigger and
 * smooth-scroll never fight over the same frame. Reference-counted: safe to
 * call from multiple components, torn down only when the last one unmounts.
 */
export function useLenis() {
  function init() {
    refCount++
    if (lenis) return lenis

    lenis = new Lenis({
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
