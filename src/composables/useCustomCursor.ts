import { reactive } from 'vue'

export type CursorVariant = 'default' | 'hover' | 'view' | 'drag' | 'accent'

interface CursorState {
  variant: CursorVariant
  label: string
}

// Module-level singleton so any component can push cursor state without prop
// drilling or an event bus. Kept intentionally tiny.
const state = reactive<CursorState>({ variant: 'default', label: '' })

export function useCustomCursor() {
  function setVariant(variant: CursorVariant, label = '') {
    state.variant = variant
    state.label = label
  }

  function reset() {
    state.variant = 'default'
    state.label = ''
  }

  return { state, setVariant, reset }
}
