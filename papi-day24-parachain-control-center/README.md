# Parachain Control Center

A cross-chain dashboard that monitors multiple Polkadot-ecosystem parachains simultaneously, powered by PAPI's multi-chain API.

## Quick Start

```bash
npm install
npm run dev        # → http://localhost:3006
npm run build      # production bundle
npm run preview    # serve the production bundle locally
```

## What it does

| Section | Description |
|---|---|
| **Chain Selector** | Toggle pills to pick which chains appear on the dashboard |
| **Live Overview** | Per-chain cards with block height, peers, block time and account count — ticks every 6 s |
| **Cross-Chain Comparison** | Recharts bar graphs comparing block time, peers and accounts across selected chains; highlights the best performer |
| **Network Topology** | d3-force directed graph showing relay ↔ parachain links (XCM channels) with a settling animation |
| **Alert Panel** | Auto-refreshing feed of simulated chain events colour-coded by severity |

## Project layout

```
src/
├── App.tsx                          # Root layout, header, hero, footer
├── index.css                        # Tailwind v4 directives + theme tokens + base reset
├── main.tsx                         # React 19 entry point
├── components/
│   ├── ChainSelector.tsx            # Animated toggle pills
│   ├── ChainDashboard.tsx           # Aggregate stats + ChainCard grid
│   ├── ChainCard.tsx                # Single-chain info card
│   ├── CrossChainCompare.tsx        # Recharts bar comparison
│   ├── NetworkGraph.tsx             # d3-force SVG graph
│   └── AlertPanel.tsx               # Severity-coded alert feed
└── services/
    └── chainRegistry.ts             # Chain configs + shared types
```

## Bugs fixed in this version

| # | File | Problem | Fix |
|---|---|---|---|
| 1 | `ChainDashboard.tsx` | Used `<Cpu>` icon but never imported it → runtime crash | Added `Cpu` to the lucide import |
| 2 | `index.css` | Default Vite styles (`body { place-items: center }`, `#root { max-width }`) broke the full-bleed dark layout | Replaced with a proper reset and Tailwind v4 theme block |
| 3 | `index.css` | Tailwind v4 theme tokens (colours, animations) were only in `tailwind.config.js`, which v4 ignores | Moved all `@theme` / `@keyframes` into `index.css` using `@import "tailwindcss"` |
| 4 | `vite.config.ts` | `manualChunks` referenced `react-query` which was never installed → build warning | Removed phantom chunk; kept only real dependencies |
| 5 | `tsconfig.json` | `references` only pointed at `tsconfig.node.json`; Vite 7's `tsc -b` also needs `tsconfig.app.json` | Added both references |
| 6 | `package.json` | Missing `@types/d3-zoom`; `@types/d3` listed but only `d3-force`/`d3-zoom` are used | Replaced with the two correct type packages |
| 7 | *missing* | `ChainSelector`, `CrossChainCompare`, `NetworkGraph`, `AlertPanel` were imported but never existed | Built all four components from scratch |

## Supported chains

| Chain | Token | Type | Colour |
|---|---|---|---|
| Polkadot | DOT | Relay | `#E6007A` |
| Kusama | KSM | Relay | `#c8c8c8` |
| Astar | ASTR | Parachain | `#0085FF` |
| Moonbeam | GLMR | Parachain | `#5A4FCF` |
| Acala | ACA | Parachain | `#FF4F7D` |
| Parallel Finance | PARA | Parachain | `#EF3A37` |