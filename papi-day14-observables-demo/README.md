# Day 14: Observables vs Promises - PAPI 30-Day Challenge

A React-based educational demo showcasing the difference between Promise-based (one-time) and Observable-based (real-time) data fetching with Polkadot-API (PAPI).

## 📋 Overview

This project demonstrates core blockchain development patterns:

- **Promises**: Single request → single response (one-time data fetches)
- **Observables**: Continuous stream of updates (real-time data subscriptions)

The demo tracks the Polkadot Treasury account balance to show how each approach differs in practice.

## ✨ Features

- **Promise-Based Fetching**: Manual refresh button to fetch balance once
- **Observable-Based Subscription**: Real-time live stream that updates on chain state changes
- **Real Chain Connection**: Uses Polkadot mainnet via smoldot light client (no wallet needed)
- **Interactive Comparison**: Side-by-side cards showing both approaches
- **Educational Table**: Technical comparison of features, memory management, and use cases
- **Console Logging**: Detailed logs showing Promise vs Observable behavior
- **Dark UI**: Modern gradient design with responsive layout

## 🔧 Tech Stack

- **Frontend**: React 18, TypeScript, Material-UI (MUI)
- **Blockchain**: Polkadot-API (PAPI), Smoldot Light Client
- **Build Tool**: Vite 5
- **Styling**: Emotion (CSS-in-JS), MUI theming
- **Utilities**: Decimal.js for number precision

## 📦 Installation

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

### Clone & Setup

```bash
# Clone the repository (or extract files)
cd papi-day14-observables-demo

# Install dependencies
npm install

# Install Polkadot chain specs (required for light client)
npm run prebuild

# Generate PAPI types from chain metadata
npm run papi
```

## 🏃 Running the Project

### Development Mode
```bash
npm run dev
```
Opens `http://localhost:3000` automatically. Hot-reload enabled.

### Production Build
```bash
npm run build
npm run preview
```

### Linting
```bash
npm run lint
```

## 📁 Project Structure

```
src/
├── main.tsx                    # React entry point with theme setup
├── App.tsx                     # Main container with header & layout
├── components/
│   ├── BalanceTracker.tsx      # Promise vs Observable demo cards
│   └── ComparisonTable.tsx     # Technical comparison table
├── utils/
│   └── polkadotClient.ts       # PAPI client initialization & metadata sync
└── styles/
    └── global.css              # Global styles, scrollbar, fonts
```

## 🎮 How to Use

### Promise-Based (One-time)
1. Click **"Fetch Balance (Promise)"** button
2. Balance is fetched once from the Polkadot Treasury account
3. Click again to manually refresh (requires new API call)
4. **Console shows**: Single fetch, no continuous updates

### Observable-Based (Real-time)
1. Click **"Start Live Stream"** button
2. Client subscribes to balance changes
3. Updates automatically when chain state changes
4. Click **"Stop Subscription"** to unsubscribe
5. **Console shows**: Continuous updates with change counter

### Understanding the Logs

**Promise logs:**
```
🔵 [PROMISE] Starting balance fetch...
✅ [PROMISE] Balance fetched: 1234.5678 DOT
⚠️  [PROMISE] Note: This only runs once. Need to call again for updates.
```

**Observable logs:**
```
🟣 [OBSERVABLE] Starting balance subscription...
✅ [OBSERVABLE] Subscription active - will auto-update on chain changes
🔄 [OBSERVABLE] Balance updated: 1234.5678 DOT
📊 [OBSERVABLE] Update count: 5
```

## ❓ FAQ

### Does this need my wallet connected?
**No.** This demo reads from the Polkadot Treasury account (`13UVJyLnbVp9RBZYFwFGyDvVd1y27Tt8tkntv6Q7JVPhFsTB`), which is publicly accessible on-chain. You don't need to connect your personal wallet or sign any transactions.

### How long does initialization take?
**First load: 10-30 seconds.** The smoldot light client syncs blockchain metadata on first use. Subsequent button clicks are much faster since the client is cached.

### What if initialization fails?
Check the error message displayed in the UI. Common issues:
- **Network connectivity**: Ensure you have internet access
- **Browser extension conflicts**: Disable browser extensions (especially Solana-related ones)
- **Timeout**: The Polkadot network may be temporarily unavailable; try refreshing

### Can I query a different account?
Yes! Edit the `TEST_ADDRESS` constant in `src/components/BalanceTracker.tsx`:
```typescript
const TEST_ADDRESS = 'PASTE_YOUR_ADDRESS_HERE'
```

### How do Promises differ from Observables?

| Aspect | Promise | Observable |
|--------|---------|-----------|
| **Calls** | Single request | Stream of updates |
| **Updates** | Manual refresh | Automatic |
| **Memory** | Auto cleanup | Requires unsubscribe |
| **Use Case** | One-time data | Real-time dashboards |
| **PAPI Method** | `.getValue()` | `.watchValue().subscribe()` |

## 🤝 Contributing

### Development Guidelines

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Code standards**
   - Use TypeScript for type safety
   - Follow existing code style
   - Add console logs for debugging
   - Keep components focused and reusable

3. **Testing locally**
   ```bash
   npm run dev        # Start dev server
   npm run lint       # Check code quality
   ```

4. **Commit & push**
   ```bash
   git add .
   git commit -m "feat: describe your changes"
   git push origin feature/your-feature-name
   ```

5. **Submit a pull request** with description of changes

### Ideas for Contribution

- Add more accounts to track
- Implement a chart showing balance history
- Add support for other chains (Kusama, Westend)
- Improve error handling and user feedback
- Add unit tests
- Optimize smoldot initialization
- Add transaction history tracking
- Create a comparison with `@polkadot/api` (legacy)

## 📚 Learning Resources

- **PAPI Docs**: https://docs.polkadot-api.dev/
- **Polkadot Learn**: https://learn.polkadot.network/
- **Observable Pattern**: https://rxjs.dev/
- **Smoldot Light Client**: https://github.com/smol-dot/smoldot

## 🐛 Troubleshooting

### Blank page on load
- Check browser console for errors (F12)
- Ensure all dependencies are installed: `npm install`
- Clear cache: `rm -rf node_modules && npm install`

### "Cannot read properties of undefined (reading 'metadataTypes')"
- Client metadata is still syncing
- Wait for "✅ PAPI client initialized" in console
- Try clicking button again after waiting 30 seconds

### "Failed to sync metadata after 15000ms"
- Network connection issue or Polkadot node unavailable
- Check your internet connection
- Disable browser extensions that might interfere
- Try refreshing the page

### Observable not updating
- Subscription might be paused
- Check that "Live subscription active" message appears
- Verify Treasury account hasn't transferred balance recently
- Check console for subscription errors

## 📝 Environment

Tested on:
- Node 18+ LTS
- Chrome, Firefox, Safari (latest)
- macOS, Windows, Linux

## 📄 License

ISC - Free to use and modify

## 🎓 Educational Purpose

This project is part of the **#PAPI30Days** challenge to learn Polkadot-API fundamentals. The code demonstrates best practices for connecting to Polkadot and understanding async patterns in blockchain development.

---

**Happy Learning!** 🚀 For questions, check the PAPI docs or Polkadot community forums.