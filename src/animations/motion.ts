/**
 * Centralized motion timing system.
 * Every GSAP tween in the project pulls its duration/easing from here so the
 * whole site shares one consistent, "premium" pace instead of ad-hoc values
 * scattered across components.
 */

import { reducedMotionOverride } from '@/composables/useMotionPreference'

export const EASE = {
  premium: 'expo.out',
  soft: 'power3.inOut',
  outQuad: 'power2.out',
  inOutQuad: 'power2.inOut',
  elastic: 'elastic.out(1, 0.6)'
} as const

export const DURATION = {
  fast: 0.35,
  base: 0.7,
  slow: 1.2,
  cinematic: 1.9
} as const

export const STAGGER = {
  tight: 0.03,
  base: 0.06,
  loose: 0.12
} as const

/** Reusable ScrollTrigger defaults for "enters when ~20% into viewport" reveals */
export const SCROLL_DEFAULTS = {
  start: 'top 85%',
  end: 'bottom 15%',
  toggleActions: 'play none none reverse'
} as const

// Respects the OS-level setting first, then layers the user's own in-app
// toggle on top (see useMotionPreference) — the toggle can only add
// reduction, never switch it off against an OS accessibility preference.
export const prefersReducedMotion = (): boolean =>
  reducedMotionOverride.value ||
  (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
