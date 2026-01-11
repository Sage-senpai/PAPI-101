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
    }
  },
  build: {
    target: 'es2020',
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'papi': ['polkadot-api', '@polkadot-api/descriptors', '@polkadot-api/sm-provider'],
          'chains': ['@polkadot/util', '@polkadot/util-crypto'],
          'ui': ['react', 'react-dom', 'framer-motion'],
          'charts': ['recharts'],
          'utils': ['zustand', 'clsx', 'tailwind-merge']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['polkadot-api', '@polkadot-api/sm-provider', '@polkadot/util']
  }
})