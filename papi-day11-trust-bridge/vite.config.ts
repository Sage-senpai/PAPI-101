import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    host: true,
    https: false // Set to true for production with real SSL
  },
  build: {
    target: 'es2020',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'papi': ['polkadot-api', '@polkadot-api/descriptors', '@polkadot-api/sm-provider'],
          'extension': ['@polkadot/extension-dapp', '@polkadot/util', '@polkadot/util-crypto'],
          'ui': ['react', 'react-dom', 'zustand'],
        }
      }
    }
  },
  optimizeDeps: {
    include: ['polkadot-api', '@polkadot-api/sm-provider', '@polkadot/extension-dapp']
  }
})