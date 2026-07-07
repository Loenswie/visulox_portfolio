/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Note: split-type ships its own TypeScript declarations, so no manual
// `declare module 'split-type'` shim is added here (that would conflict).
