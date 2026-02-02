# Batch Transaction Studio

Interactive visual builder for composing, simulating, and exporting optimised PAPI batch transactions on Polkadot.

## What it does

- **Drag-and-drop builder** — pull operations from a filterable palette onto a canvas, reorder them live.
- **Real-time gas calculator** — instantly compares individual-transaction cost vs. batched cost with a visual savings bar.
- **Batch templates** — one-click presets for common workflows (DeFi staking cycle, governance bundle, multi-asset sweep).
- **Simulation** — animated step-by-step replay that validates your batch before it ever hits the chain.
- **Code export** — generates ready-to-paste TypeScript using the PAPI client, downloadable as `.ts`.
- **Batch type selector** — choose between `batch_all` (atomic), `batch` (continue on failure), or `force_batch`.

## Quick start

```bash
npm install
npm run dev
# → http://localhost:3007
```

## Project layout

```
src/
├── App.tsx                      # Root state, template loading, simulate logic
├── index.css                    # Tailwind v4 theme tokens, keyframes, base styles
├── main.tsx                     # React entry
├── components/
│   ├── BatchBuilder.tsx         # DnD palette + canvas + reorder
│   ├── GasCalculator.tsx        # Cost comparison cards + savings bar + type selector
│   ├── PreviewPanel.tsx         # Structure view, code preview, download
│   └── BatchSimulator.tsx       # Simulate button + animated step replay + summary
├── data/
│   └── palletOperations.ts      # Operation definitions & batch templates
└── types/
    └── batch.types.ts           # All shared TypeScript interfaces
```

## Supported pallets

| Pallet | Operations |
|---|---|
| Balances | `transfer_keep_alive` |
| Staking | `bond`, `nominate` |
| Utility | `batch_all`, `batch`, `force_batch` |
| Democracy | `vote` |
| Multisig | `approve_as_multi` |
| Assets | `transfer` |

## Tech stack

React 19 · TypeScript · Vite 7 · Tailwind CSS v4 · react-dnd · lucide-react · framer-motion