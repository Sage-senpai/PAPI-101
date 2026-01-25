// ============================================================================
// FILE: papi-event-orchestrator/vite.config.ts
// PURPOSE: Vite build and development configuration
// STATUS: READY - Optimized for Week 3 project
// ============================================================================

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  
  // Path resolution for imports
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },

  // Build optimization (Day 18: Performance)
  build: {
    target: 'es2020',
    
    // Optimize bundle chunks
    rollupOptions: {
      output: {
        manualChunks: {
          'papi-core': ['polkadot-api'],
          'vendor': ['react', 'react-dom'],
          'ui': ['lucide-react'],
        },
      },
    },
  },

  // Development server configuration
  server: {
    port: 3003,
    open: true,
  },
})