import { useLenis } from './useLenis'

let savedScrollY = 0

/**
 * Locks/unlocks Lenis + native scroll — used by the About overlay and the
 * mobile nav menu.
 *
 * Uses the "fix the body at a negative top offset" technique rather than
 * plain `overflow: hidden` on the body. `overflow: hidden` alone does not
 * reliably block touch-driven scrolling on iOS Safari — the real page can
 * still scroll behind a "locked" panel there. That's exactly what was
 * causing the mobile menu to look broken/jumbled whenever it was opened
 * anywhere other than the very top of the page: the background was still
 * scrolling (and its own scroll-triggered animations still firing) behind
 * the fixed menu, fighting with Lenis and the menu's own layout.
 * `position: fixed` on the body itself is the standard cross-browser fix —
 * it can't be scrolled at all, on any platform, and restoring `top` + a
 * `window.scrollTo` on unlock puts the page back exactly where it was.
 */
export function useLockScroll() {
  const lenis = useLenis()

  function lock() {
    savedScrollY = window.scrollY
    lenis.stop()
    document.body.style.position = 'fixed'
    document.body.style.top = `-${savedScrollY}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
  }

  function unlock() {
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.left = ''
    document.body.style.right = ''
    window.scrollTo(0, savedScrollY)
    lenis.start()
  }

  return { lock, unlock }
}
