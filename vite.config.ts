import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // Real personal assets (logo + portraits) live in /SOURCEFILES at the project
  // root. Treating it as the public dir means they're served at "/" in dev
  // and copied verbatim into dist/ on build — no duplication needed.
  publicDir: 'SOURCEFILES',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manifest: false,
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        manualChunks: {
          gsap: ['gsap'],
          vendor: ['vue', 'vue-router', 'pinia']
        }
      }
    }
  },
  server: {
    port: 5173,
    open: true
  }
})
