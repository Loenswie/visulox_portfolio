import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    isLoading: true,
    hasLoadedOnce: false,
    isMenuOpen: false
  }),
  actions: {
    finishLoading() {
      this.isLoading = false
      this.hasLoadedOnce = true
    },
    toggleMenu(force?: boolean) {
      this.isMenuOpen = force ?? !this.isMenuOpen
    }
  }
})
