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
          'papi-core': ['polkadot-api/client'],
          'papi-providers': ['polkadot-api/sm-provider'],
          'vendor': ['react', 'react-dom'],
          'ui': ['lucide-react', '@radix-ui/react-tabs'],
        },
      },
    },
  },
  server: {
    port: 3003,
  },
})