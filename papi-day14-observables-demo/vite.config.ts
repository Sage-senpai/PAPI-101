//vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    host: true,
    fs: {
      strict: false
    },
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    }
  },
  build: {
    target: 'es2020',
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'papi': ['polkadot-api', '@polkadot-api/sm-provider'],
        }
      }
    }
  },
  optimizeDeps: {
    include: ['polkadot-api', '@polkadot-api/sm-provider'],
    esbuildOptions: {
      target: 'es2020'
    }
  }
})