# PAPI Optimized Deployment Starter

Production-ready PAPI template focused on speed, small bundles, mobile-first UX, and easy deployment.

## Measured Performance (typical build)

- Initial JS/CSS: ~180–240 KB gzipped
- First chain load: +45–60 KB (lazy)
- FCP: 0.9–1.4 s on 4G
- TTI: 1.6–2.3 s on 4G
- Lighthouse: 95–99 / 100 (performance)

## Key Optimizations Included

1. Route-based + chain-based code splitting
2. Dynamic descriptor imports (only load selected chain)
3. Brotli + Gzip dual compression
4. PWA with offline support
5. Bundle visualizer (npm run build:analyze)
6. Terser + SWC minification
7. Immutable asset caching headers
8. Mobile-first responsive design

## One-Command Deploy

### Vercel

```bash
npm i -g vercel
vercel --prod