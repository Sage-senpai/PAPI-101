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
          'papi-core': ['polkadot-api'],
          'papi-providers': ['@polkadot-api/sm-provider'],
          'vendor': ['react', 'react-dom'],
          'visualization': ['d3-force', 'd3-zoom', 'recharts'],
          'ui': ['lucide-react', 'framer-motion', '@radix-ui/react-tabs'],
        },
      },
    },
  },
  server: {
    port: 3006,
  },
})