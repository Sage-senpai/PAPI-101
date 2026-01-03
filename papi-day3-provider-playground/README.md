# 🚀 PAPI Provider Playground - Day 3 Challenge

A interactive TypeScript web application that demonstrates and compares **Smoldot (light client)** vs **WSS (WebSocket)** providers for connecting to the Polkadot blockchain using PAPI (Polkadot-API).



## 📋 Table of Contents

- [What This Project Does](#what-this-project-does)
- [Why This Matters](#why-this-matters)
- [Features](#features)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)

## 🎯 What This Project Does

This is a **real-time comparison tool** that lets you:

1. **Connect to Polkadot** using two different provider types side-by-side
2. **Compare performance metrics** like connection time, latency, and block heights
3. **Understand the tradeoffs** between decentralized (Smoldot) and centralized (WSS) connections
4. **See live blockchain data** without writing any code

### The Two Providers:

**🍃 Smoldot Provider (Light Client)**
- ✅ Runs entirely in your browser
- ✅ No central servers needed (true decentralization)
- ✅ Lower resource usage
- ❌ Slower initial connection (30-60 seconds)
- 🎯 **Best for:** dApps prioritizing decentralization and user sovereignty

**⚡ WSS Provider (WebSocket)**
- ✅ Lightning-fast connections (sub-second)
- ✅ High throughput for queries
- ✅ Production-ready reliability
- ❌ Depends on centralized RPC nodes
- 🎯 **Best for:** High-performance apps and backends

## 🌟 Why This Matters

When building on Polkadot, choosing the right provider affects:
- **User experience** (connection speed)
- **Infrastructure costs** (RPC node fees)
- **Decentralization** (trustlessness)
- **App architecture** (client-side vs server-side)

This playground lets you **test both in real-time** before committing to one.

## ✨ Features

- 🎨 **Beautiful Polkadot-themed UI** with gradient cards
- 📊 **Real-time metrics** showing latency, block heights, connection times
- 📈 **Performance comparison charts** with visual bars
- 📟 **Live console log** showing connection events
- 🔄 **One-click switching** between providers
- 📱 **Fully responsive** design
- 💨 **Fast development** with Vite + TypeScript

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** 9+ (comes with Node.js)
- A modern browser (Chrome, Firefox, Edge, Safari)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Sage-senpai/PAPI-101/tree/main/papi-day3-provider-playground.git
cd papi-day3-provider-playground

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open your browser to http://localhost:5173
```

That's it! You should see the Provider Playground interface.

### Building for Production

```bash
# Build optimized production bundle
npm run build

# Preview the production build
npm run preview
```

## 📁 Project Structure

```
papi-day3-provider-playground/
├── src/
│   ├── main.ts           # Main application logic
│   └── style.css         # Polkadot-themed styles
├── index.html            # Entry point
├── package.json          # Dependencies & scripts
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite build configuration
└── README.md            # This file!
```

### Key Files Explained

- **`src/main.ts`** - Contains the `ProviderPlayground` class that handles:
  - Connecting to providers
  - Monitoring blockchain metrics
  - Updating the UI with real-time data
  
- **`src/style.css`** - Custom CSS with:
  - Polkadot brand colors
  - Smooth animations
  - Responsive design
  
- **`index.html`** - The UI structure with:
  - Provider comparison cards
  - Metrics display
  - Console log output

## 🔧 How It Works

### Connecting with Smoldot

```typescript
import { createClient } from 'polkadot-api'
import { getSmProvider } from 'polkadot-api/sm-provider'
import { chainSpec } from 'polkadot-api/chains/polkadot'
import { startFromWorker } from 'polkadot-api/smoldot/from-worker'
import SmWorker from 'polkadot-api/smoldot/worker?worker'

// Initialize Smoldot worker
const worker = new SmWorker()
const smoldot = startFromWorker(worker)

// Add Polkadot chain
const chain = await smoldot.addChain({ chainSpec })

// Create PAPI client
const client = createClient(getSmProvider(chain))
```

### Connecting with WSS

```typescript
import { createClient } from 'polkadot-api'
import { getWsProvider } from 'polkadot-api/ws-provider'

// Connect to public RPC node
const client = createClient(
  getWsProvider('wss://rpc.polkadot.io')
)
```

### Getting Chain Data

```typescript
// Get typed API (after generating types with `papi`)
const dotApi = client.getTypedApi(dot)

// Query chain info
const version = await dotApi.constants.System.Version()
const header = await dotApi.query.System.Header.getValue()

console.log(`Chain version: ${version.specVersion}`)
console.log(`Latest block: ${header.number}`)
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Found a Bug?

1. Check if it's already reported in [Issues](https://github.com/Sage-senpai/PAPI-101/tree/main/papi-day3-provider-playground/issues)
2. If not, create a new issue with:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

### Want to Add a Feature?

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly: `npm run dev`
5. Commit with clear messages: `git commit -m "Add amazing feature"`
6. Push to your fork: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style

- Use TypeScript for type safety
- Follow existing code formatting
- Add comments for complex logic
- Keep functions small and focused

### Testing Your Changes

```bash
# Run development server
npm run dev

# Build to check for errors
npm run build

# Format code
npm run format

# Lint code
npm run lint
```

## 🐛 Troubleshooting

### Common Issues

**❌ "Cannot find module 'polkadot-api'"**
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**❌ Smoldot takes forever to connect**
- This is normal for first connection (30-60s)
- Smoldot needs to sync with the network
- Subsequent connections are faster

**❌ WSS connection fails**
- Check your internet connection
- Public RPC nodes can have rate limits
- Try a different endpoint: `wss://polkadot-rpc.dwellir.com`

**❌ TypeScript errors**
```bash
# Solution: Regenerate types (if you've run `papi`)
papi add dot -n polkadot
```

**❌ Port 5173 already in use**
```bash
# Solution: Use a different port
npm run dev -- --port 3000
```

### Still Having Issues?

1. Check the [PAPI Documentation](https://docs.polkadot.com/develop/toolkit/api-libraries/papi/)
2. Search [GitHub Issues](https://github.com/polkadot-api/polkadot-api/issues)
3. Ask in [Polkadot Stack Exchange](https://substrate.stackexchange.com/)
4. Ask me on X (https://x.com/sage_senpeak)

## 📚 Learn More

- [PAPI Documentation](https://docs.polkadot.com/develop/toolkit/api-libraries/papi/)
- [Polkadot Wiki](https://wiki.polkadot.network/)
- [Smoldot Light Client](https://github.com/smol-dot/smoldot)
- [#PAPI30Days Challenge](https://twitter.com/search?q=%23PAPI30Days)

## 📝 License

MIT License - feel free to use this in your own projects!

## 🙏 Acknowledgments

- Built as part of the **#PAPI30Days Challenge**
- Powered by [Polkadot-API (PAPI)](https://github.com/polkadot-api/polkadot-api)
- Inspired by the Polkadot community
- UI design influenced by [Polkadot.js Apps](https://polkadot.js.org/)

## 🌐 Connect

- Follow the challenge: **#PAPI30Days**
- Contribute to [PAPI on GitHub](https://github.com/polkadot-api/polkadot-api)

---

**⚡ Day 3: Provider Choice** - *Smoldot vs WSS: Choose your fighter!*

Made with ❤️ by [@Sage_senpeak](https://x.com/Sage_senpeak)