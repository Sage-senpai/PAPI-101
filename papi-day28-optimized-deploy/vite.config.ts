import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'
import compression from 'vite-plugin-compression'
import { visualizer } from 'vite-plugin-bundle-visualizer'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    compression({ algorithm: 'brotliCompress', ext: '.br', threshold: 1024 }),
    compression({ algorithm: 'gzip', ext: '.gz', threshold: 1024 }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icons/*.png'],
      manifest: {
        name: 'PAPI Optimized dApp',
        short_name: 'PAPI App',
        description: 'Fast, light Polkadot dApp powered by PAPI',
        theme_color: '#0ea5e9',
        background_color: '#0f172a',
        display: 'standalone',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [{
          urlPattern: /^https:\/\/rpc\.polkadot\.io\/.*/i,
          handler: 'NetworkFirst',
          options: { cacheName: 'rpc-cache', expiration: { maxEntries: 50 } },
        }],
      },
    }),
    mode === 'analyze' && visualizer({ open: true, gzipSize: true, brotliSize: true }),
  ],
  build: {
    target: 'es2020',
    minify: 'terser',
    terserOptions: { compress: { drop_console: mode === 'production' } },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          polkadot: ['polkadot-api'],
          ui: ['lucide-react', 'date-fns'],
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 400,
    sourcemap: mode !== 'production',
  },
  optimizeDeps: { exclude: ['@polkadot-api/descriptors'] },
}))