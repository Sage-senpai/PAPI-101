//vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    host: true
  },
  build: {
    target: 'es2020',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'papi': ['polkadot-api', '@polkadot-api/descriptors', '@polkadot-api/sm-provider'],
          'ui': ['react', 'react-dom', 'react-hook-form'],
          'utils': ['zod', '@hookform/resolvers']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['polkadot-api', '@polkadot-api/sm-provider']
  }
})