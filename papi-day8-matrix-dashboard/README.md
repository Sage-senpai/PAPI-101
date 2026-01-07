# 🔵 PAPI Matrix Dashboard

A Matrix-themed React dashboard showcasing Week 1 of the #PAPI30Days campaign. This educational project demonstrates how to connect to Polkadot using PAPI (Polkadot-API), fetch real chain data, and build type-safe dApps with light-clients.

![PAPI Matrix Dashboard](https://img.shields.io/badge/PAPI-30Days-green) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue) ![React](https://img.shields.io/badge/React-19-61dafb)

## 🎯 What This Project Demonstrates

### Week 1 Recap - Core PAPI Concepts:
- **Day 1-2**: PAPI installation and setup with type generation
- **Day 3**: Provider selection (Smoldot light-client for decentralization)
- **Day 4**: TypedApi instance creation for fully typed chain interactions
- **Day 5**: Reading chain constants (live, not hardcoded)
- **Day 6**: Querying storage for dynamic state
- **Day 7**: Calling runtime APIs for execution logic

## ✨ Features

- 🌐 **Decentralized Connection**: Uses Smoldot light-client (runs in browser)
- 🔐 **Type-Safe**: Auto-generated types from Polkadot metadata
- 📊 **Real-Time Data**: Live chain info, blocks, balances
- 🎨 **Matrix Theme**: Animated falling code effect
- 📱 **Responsive Design**: Works on desktop and mobile
- ⚡ **Fast Setup**: One command to start

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/papi-day8-matrix-dashboard.git
cd papi-day8-matrix-dashboard

# Install dependencies
npm install

# Generate PAPI types (important!)
npx papi

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

## 🏗️ Project Structure

```
papi-day8-matrix-dashboard/
├── src/
│   ├── components/
│   │   ├── MatrixBackground.tsx   # Animated Matrix rain effect
│   │   ├── ConnectionStatus.tsx   # Connection state indicator
│   │   └── ChainInfo.tsx          # Main dashboard with chain data
│   ├── hooks/
│   │   └── usePolkadotAPI.ts      # Custom hook for PAPI connection
│   ├── styles/
│   │   └── globals.css            # Tailwind + custom styles
│   ├── App.tsx                    # Main app component
│   └── main.tsx                   # Entry point
├── .papi/                         # Auto-generated PAPI types
├── package.json
├── vite.config.ts
└── README.md
```

## 🎓 Educational Content

### What You'll Learn

#### 1. **PAPI Setup** (Days 1-2)
```typescript
// Install PAPI
npm i polkadot-api@latest

// Add chain and generate types
npx papi add dot -n polkadot
npx papi
```

#### 2. **Provider Selection** (Day 3)
```typescript
import { getSmProvider } from '@polkadot-api/sm-provider';
import { startFromWorker } from '@polkadot-api/smoldot/from-worker';

// Smoldot = Decentralized light-client (no RPC needed)
const smoldot = startFromWorker(new Worker(...));
const provider = getSmProvider(smoldot.addChain({ chainSpec }));
```

#### 3. **TypedApi Creation** (Day 4)
```typescript
import { createClient } from 'polkadot-api';
import { dot } from '@polkadot-api/descriptors';

const client = createClient(provider);
const api = client.getTypedApi(dot); // Fully typed!
```

#### 4. **Reading Constants** (Day 5)
```typescript
// Constants = Chain truths (never change until runtime upgrade)
const version = await api.constants.System.Version();
const existentialDeposit = await api.constants.Balances.ExistentialDeposit();
```

#### 5. **Querying Storage** (Day 6)
```typescript
// Storage = Dynamic chain state
const account = await api.query.System.Account.getValue(address);
const balance = account.data.free;
```

#### 6. **Runtime APIs** (Day 7)
```typescript
// Runtime APIs = On-chain computation
const metadata = await api.apis.Metadata.metadata_at_version(15);
```

## 🔧 Key Components Explained

### `usePolkadotAPI` Hook
Manages the entire PAPI connection lifecycle:
- Initializes Smoldot provider
- Creates PAPI client
- Fetches chain info (constants, storage, runtime APIs)
- Handles errors and loading states
- Cleanup on disconnect

### `ChainInfo` Component
Displays real-time data from Polkadot:
- Chain name & version
- Current block number
- Existential deposit
- Example account balance
- Latest block hash

### `MatrixBackground` Component
Pure visual enhancement - animated falling code with PAPI-related terms.

## 📦 Build & Deploy

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Test thoroughly**: `npm run dev` and `npm run build`
5. **Commit**: `git commit -m 'Add amazing feature'`
6. **Push**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Maintain type safety (no `any` types)
- Add comments for complex logic
- Test on multiple screen sizes
- Keep dependencies minimal

## 🐛 Troubleshooting

### "Types not found" Error
```bash
# Regenerate PAPI types
npx papi
```

### Connection Issues
- Check internet connection (Smoldot needs initial chain spec download)
- Try clearing browser cache
- Check console for detailed error logs

### Build Errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📚 Resources

- [PAPI Documentation](https://papi.how/)
- [Polkadot-API GitHub](https://github.com/polkadot-api/polkadot-api)
- [#PAPI30Days Campaign](https://twitter.com/hashtag/PAPI30Days)
- [Polkadot Wiki](https://wiki.polkadot.network/)

## 🎯 Next Steps

After mastering Week 1:
- **Week 2**:  Reading Blockchain Data : Dive into querying storage, constants, and runtime APIs with typed interfaces.
- **Week 3**: Transactions & Interactions: Learn to send transactions, handle call data, and integrate signing options.
- **Week 4**: Advanced Topics & Projects: Explore multi-chain setups, performance optimization, and build capstone projects.

## 📄 License

MIT License - feel free to use this for learning and building!

## 🙏 Acknowledgments

- Polkadot-API team for the amazing library
- #PAPI30Days community for inspiration
- Matrix movie for the aesthetic 🔵

---

**Built with ❤️ by Dvyne (https://x.com/sage_senpeak) for the Polkadot ecosystem**

*"I can see the types now" - Neo, probably*