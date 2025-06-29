import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    // Optimize chunks
    rollupOptions: {
      output: {
        manualChunks: {
          'emailjs': ['emailjs-com']
        }
      }
    },
    // Asset optimization
    assetsInlineLimit: 4096,
    // CSS code splitting
    cssCodeSplit: true
  },
  server: {
    port: 3000,
    open: true
  }
})