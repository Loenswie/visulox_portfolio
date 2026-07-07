import type { Directive } from 'vue'
import { gsap } from 'gsap'

/**
 * v-magnetic — attaches a subtle magnetic pull to buttons/links so the pointer
 * appears to "pull" the element toward it, then eases back on leave.
 * Disabled on touch/coarse-pointer devices automatically.
 */
export const vMagnetic: Directive<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    const strength = binding.value ?? 0.35
    const isFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!isFine) return

    const quickX = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' })
    const quickY = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' })

    function onMove(e: MouseEvent) {
      const rect = el.getBoundingClientRect()
      const relX = e.clientX - (rect.left + rect.width / 2)
      const relY = e.clientY - (rect.top + rect.height / 2)
      quickX(relX * strength)
      quickY(relY * strength)
    }

    function onLeave() {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' })
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    ;(el as any).__magneticCleanup = () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  },
  unmounted(el) {
    ;(el as any).__magneticCleanup?.()
  }
}
