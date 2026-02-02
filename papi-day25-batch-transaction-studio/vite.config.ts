import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          'dnd': ['react-dnd', 'react-dnd-html5-backend'],
          'vendor': ['react', 'react-dom'],
          'ui': ['lucide-react'],
        },
      },
    },
  },
  server: {
    port: 3007,
  },
})