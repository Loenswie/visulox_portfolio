import SplitType from 'split-type'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DURATION, EASE, STAGGER, prefersReducedMotion } from './motion'

gsap.registerPlugin(ScrollTrigger)

export interface KineticRevealOptions {
  /** split by 'words' | 'chars' | 'lines' */
  by?: 'words' | 'chars' | 'lines'
  delay?: number
  stagger?: number
  y?: number
  scrollTrigger?: boolean
  trigger?: Element | string
}

/**
 * Kinetic typography reveal: splits text into words/chars/lines with SplitType
 * and animates each fragment up + in. Returns the SplitType instance so callers
 * can `.revert()` it on unmount (important to avoid memory leaks on route change).
 */
export function kineticReveal(target: string | HTMLElement, options: KineticRevealOptions = {}) {
  const { by = 'words', delay = 0, stagger = STAGGER.base, y = '110%', scrollTrigger = false, trigger } = options

  const split = new SplitType(target as HTMLElement, { types: `${by}` as any })
  const fragments = by === 'chars' ? split.chars : by === 'lines' ? split.lines : split.words

  if (!fragments || fragments.length === 0) return split

  // wrap each fragment for the mask effect (overflow hidden on parent line)
  fragments.forEach((el) => {
    el.style.willChange = 'transform, opacity'
  })

  if (prefersReducedMotion()) {
    gsap.set(fragments, { opacity: 1, y: 0 })
    return split
  }

  gsap.fromTo(
    fragments,
    { yPercent: 110, opacity: 0 },
    {
      yPercent: 0,
      opacity: 1,
      duration: DURATION.slow,
      delay,
      stagger,
      ease: EASE.premium,
      scrollTrigger: scrollTrigger
        ? {
            trigger: (trigger ?? (target as Element)) as Element,
            start: 'top 85%'
          }
        : undefined
    }
  )

  return split
}
