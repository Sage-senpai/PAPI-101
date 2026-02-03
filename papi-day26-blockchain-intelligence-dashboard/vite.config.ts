import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
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
          'vendor': ['react', 'react-dom'],
          'charts': ['recharts'],
          'ui': ['lucide-react', 'framer-motion'],
        },
      },
    },
  },
  server: {
    port: 3008,
    host: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'recharts', 'lucide-react'],
  },
});