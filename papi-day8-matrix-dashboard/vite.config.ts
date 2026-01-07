import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'papi': ['polkadot-api', '@polkadot-api/descriptors', '@polkadot-api/sm-provider'],
          'polkadot': ['@polkadot/extension-dapp', '@polkadot/util', '@polkadot/util-crypto']
        }
      }
    }
  }
})