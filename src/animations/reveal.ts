import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DURATION, EASE, SCROLL_DEFAULTS, STAGGER, prefersReducedMotion } from './motion'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

/**
 * Fade + rise reveal for any element as it scrolls into view.
 * Uses transform + opacity exclusively — cheap for the compositor, no layout thrash.
 */
export function fadeUpOnScroll(
  target: gsap.TweenTarget,
  opts: { y?: number; delay?: number; trigger?: Element | string } = {}
) {
  if (prefersReducedMotion()) {
    gsap.set(target, { opacity: 1, y: 0 })
    return
  }
  const { y = 48, delay = 0, trigger } = opts
  gsap.fromTo(
    target,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration: DURATION.slow,
      delay,
      ease: EASE.premium,
      scrollTrigger: {
        trigger: (trigger ?? (target as Element)) as Element,
        ...SCROLL_DEFAULTS
      }
    }
  )
}

/** Stagger-reveal a NodeList / array of elements as a group scrolls into view. */
export function staggerUpOnScroll(
  targets: gsap.TweenTarget,
  trigger: Element | string,
  opts: { y?: number; stagger?: number } = {}
) {
  if (prefersReducedMotion()) {
    gsap.set(targets, { opacity: 1, y: 0 })
    return
  }
  const { y = 32, stagger = STAGGER.base } = opts
  gsap.fromTo(
    targets,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration: DURATION.base,
      stagger,
      ease: EASE.premium,
      scrollTrigger: {
        trigger,
        ...SCROLL_DEFAULTS
      }
    }
  )
}

/**
 * Cinematic masked image reveal: a clip-path/scale wipe combined with a slow
 * counter-scale on the inner <img> to fake a parallax "settle" on entrance.
 */
export function maskRevealImage(wrapper: Element, img: Element) {
  if (prefersReducedMotion()) {
    gsap.set(img, { scale: 1 })
    return
  }
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: wrapper,
      ...SCROLL_DEFAULTS
    }
  })
  tl.fromTo(
    wrapper,
    { clipPath: 'inset(100% 0% 0% 0%)' },
    { clipPath: 'inset(0% 0% 0% 0%)', duration: DURATION.cinematic, ease: EASE.premium }
  ).fromTo(
    img,
    { scale: 1.28, opacity: 0.6 },
    { scale: 1, opacity: 1, duration: DURATION.cinematic, ease: EASE.premium },
    0
  )
  return tl
}

/** Subtle vertical parallax layer tied to scroll progress. */
export function parallaxLayer(target: gsap.TweenTarget, trigger: Element | string, amount = 80) {
  if (prefersReducedMotion()) return
  gsap.to(target, {
    yPercent: amount,
    ease: 'none',
    scrollTrigger: {
      trigger,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.6
    }
  })
}

/** Animated numeric counter, triggered once when scrolled into view. */
export function counterOnScroll(
  el: HTMLElement,
  value: number,
  trigger: Element | string,
  opts: { duration?: number; suffix?: string } = {}
) {
  const { duration = DURATION.slow * 1.4, suffix = '' } = opts
  const state = { val: 0 }
  ScrollTrigger.create({
    trigger,
    start: 'top 80%',
    once: true,
    onEnter: () => {
      gsap.to(state, {
        val: value,
        duration: prefersReducedMotion() ? 0 : duration,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = Math.round(state.val).toString() + suffix
        }
      })
    }
  })
}
