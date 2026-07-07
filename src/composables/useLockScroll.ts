import { useLenis } from './useLenis'

/** Locks/unlocks Lenis + native body scroll — used by the About overlay and mobile nav. */
export function useLockScroll() {
  const lenis = useLenis()

  function lock() {
    lenis.stop()
    document.body.style.overflow = 'hidden'
  }

  function unlock() {
    lenis.start()
    document.body.style.overflow = ''
  }

  return { lock, unlock }
}
