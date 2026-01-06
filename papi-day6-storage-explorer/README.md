# Storage Explorer - PAPI Day 6

Complete file structure and implementation guide.

## File Structure
```
papi-storage-explorer/
├── README.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
└── src/
    ├── main.ts
    └── style.css
```

---

## 1. README.md

```markdown
# 🗄️ Storage Explorer - PAPI Day 6

An interactive web application demonstrating Polkadot's typed storage queries using PAPI (Polkadot API). This educational project showcases the power of type-safe blockchain data access.



## 📚 What You'll Learn

- **Type-Safe Queries**: Execute fully typed storage queries with autocomplete
- **Real-Time Updates**: Subscribe to blockchain state changes
- **Storage Structure**: Understand how Polkadot organizes on-chain data
- **PAPI vs Traditional**: See the difference between typed and untyped approaches

## ✨ Features

- 🔍 **Live Storage Queries** - Query any storage item from Polkadot
- 📡 **Real-Time Subscriptions** - Watch balance changes as they happen
- 🎯 **Multiple Storage Items** - Explore Balances, System, Staking, Identity, and more
- 📊 **Visual Flow Diagram** - Understand the query lifecycle
- 💻 **Type Information Display** - See TypeScript types in action
- 🎨 **Modern UI** - Responsive design with Polkadot branding

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Basic understanding of TypeScript
- Internet connection (connects to Polkadot RPC)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Sage-senpai/PAPI-101/tree/main/papi-day6-storage-explorer
cd papi-storage-explorer
```

2. **Install dependencies**
```bash
npm install
```

3. **Generate PAPI descriptors**
```bash
npm run setup
```

This command does two things:
- Downloads Polkadot chain metadata
- Generates TypeScript types for all storage items

4. **Start development server**
```bash
npm run dev
```

The app will open at `http://localhost:5173`

## 📖 How It Works

### The PAPI Advantage

**Traditional Approach (Painful):**
```typescript
// 1. Construct storage key manually
const key = api.query.balances.account.key(address);

// 2. Fetch raw hex data
const raw = await api.rpc.state.getStorage(key);

// 3. Manually decode (error-prone)
const decoded = api.registry.createType('AccountData', raw);

// 4. Hope the structure is right
const balance = decoded.free; // Is it .free? .data.free? Who knows!
```

**PAPI Approach (Magical):**
```typescript
// One line, fully typed, always correct
const account = await dotApi.query.Balances.Account(address);
const balance = account.data.free; // TypeScript knows this exists!
```

### Query Flow

1. **Your Query** → `dotApi.query.Balances.Account(address)`
2. **PAPI Translates** → Generates correct storage key
3. **Blockchain Response** → Returns encoded data
4. **PAPI Decodes** → Automatically converts to TypeScript types
5. **Your Result** → Fully typed object ready to use

## 🎮 Using the Explorer

### Basic Query

1. Enter a Polkadot address (or click "Random" for a sample)
2. Select a storage item from the dropdown
3. Click "Execute Query"
4. View the typed result with full property information

### Real-Time Subscription

1. Enter an address
2. Click "Subscribe to Updates"
3. Watch as balance changes stream in real-time
4. Click again to unsubscribe

### Available Storage Items

- **Balances.Account** - Account balance information
- **System.Account** - Full account data including nonce
- **Timestamp.Now** - Current block timestamp
- **Staking.Bonded** - Staking controller account
- **Identity.IdentityOf** - On-chain identity information

## 🏗️ Project Structure

```
src/
├── main.ts          # Main application logic
│   ├── StorageExplorer class
│   ├── PAPI client initialization
│   ├── Query execution
│   ├── Subscription management
│   └── UI interactions
│
├── style.css        # Modern, responsive styling
│   ├── Polkadot brand colors
│   ├── Glassmorphism effects
│   ├── Responsive grid layouts
│   └── Dark theme optimized
│
└── index.html       # Application structure
    ├── Query builder interface
    ├── Results display
    ├── Visualization section
    └── Console output
```

## 🔧 Configuration

### Connecting to Different Chains

Edit `src/main.ts` to change the RPC endpoint:

```typescript
// Polkadot (default)
this.client = createClient(getWsProvider('wss://rpc.polkadot.io'));

// Kusama
this.client = createClient(getWsProvider('wss://kusama-rpc.polkadot.io'));

// Local node
this.client = createClient(getWsProvider('ws://localhost:9944'));
```

### Adding Custom Storage Items

Extend the storage item dropdown in `index.html`:

```html
<select id="storage-item">
  <option value="your-pallet-item">YourPallet.StorageItem</option>
</select>
```

Then add the query logic in `src/main.ts`:

```typescript
case 'your-pallet-item':
  result = await this.dotApi.query.YourPallet.StorageItem(params);
  queryString = `await dotApi.query.YourPallet.StorageItem(params)`;
  break;
```

## 🛠️ Development

### Build for Production

```bash
npm run build
```

Outputs to `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Type Checking

```bash
npx tsc --noEmit
```

## 📚 Key Concepts

### 1. Storage Structure

Polkadot storage is organized into:
- **Pallets** - Modules (e.g., Balances, System, Staking)
- **Storage Items** - Data within pallets (e.g., Account, Events)
- **Keys** - Parameters to query specific data

### 2. Type Safety

PAPI generates TypeScript types from chain metadata:
- **Compile-time safety** - Catch errors before runtime
- **Autocomplete** - IDE knows all properties
- **Runtime resilience** - Types update with chain upgrades

### 3. Query Types

- **getValue()** - Single query, returns current value
- **watchValue()** - Subscription, returns observable
- **entries()** - Get all entries in a storage map
- **size()** - Get storage size for an item

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit with clear messages**
   ```bash
   git commit -m "Add amazing feature"
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Contribution Ideas

- [ ] Add more storage item examples
- [ ] Implement historical queries (at specific block)
- [ ] Add storage size estimation
- [ ] Create query history/favorites
- [ ] Add export to different formats
- [ ] Implement multi-chain support
- [ ] Add query performance metrics

## 🐛 Troubleshooting

### "Failed to connect to Polkadot"

- Check your internet connection
- Verify the RPC endpoint is accessible
- Try a different public RPC endpoint

### "Module not found: @polkadot-api/descriptors"

- Run `npm run setup` to generate descriptors
- Ensure `.papi/` directory exists

### Types not working in IDE

- Restart TypeScript server in your editor
- Run `npm run setup` again
- Check `tsconfig.json` includes the `.papi/` directory

## 📖 Resources

- [PAPI Documentation](https://papi.how/)
- [Polkadot Wiki - Storage](https://wiki.polkadot.network/docs/learn-storage)
- [PAPI GitHub](https://github.com/polkadot-api/polkadot-api)
- [#PAPI30Days Challenge](https://twitter.com/search?q=%23PAPI30Days)

## 📄 License

MIT License - feel free to use this project for learning and teaching!

## 🙏 Acknowledgments

- Built with [Polkadot API (PAPI)](https://papi.how/)
- Part of the #PAPI30Days learning challenge
- Inspired by the Polkadot developer community

## 📬 Contact

Questions or feedback? 
- Open an issue
- Tag @PolkadotAPI on Twitter
- Join the Polkadot Discord

---

**Day 6 of #PAPI30Days** - Master typed storage queries! 🚀
```

---

## 2. package.json

```json
{
  "name": "papi-day6-storage-explorer",
  "version": "1.0.0",
  "description": "Interactive storage query explorer for Polkadot using PAPI",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "setup": "papi add dot -n polkadot && papi"
  },
  "keywords": [
    "polkadot",
    "papi",
    "blockchain",
    "storage",
    "typescript"
  ],
  "dependencies": {
    "polkadot-api": "^1.7.4",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@polkadot-api/cli": "^0.11.4",
    "@types/node": "^22.10.2",
    "typescript": "^5.7.2",
    "vite": "^6.0.3"
  },
  "license": "MIT"
}
```

---

## 3. tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["vite/client"]
  },
  "include": ["src", ".papi"],
  "exclude": ["node_modules", "dist"]
}
```

---

## 4. vite.config.ts

```typescript
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  },
  server: {
    port: 5173,
    open: true,
    cors: true
  },
  optimizeDeps: {
    exclude: ['polkadot-api']
  }
});
```

---

## 5. .gitignore

```
# Dependencies
node_modules/
.pnpm-store/
package-lock.json
yarn.lock
pnpm-lock.yaml

# PAPI Auto-generated
.papi/

# Build outputs
dist/
dist-ssr/
*.local

# Logs
logs
*.log
npm-debug.log*

# Editor
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store

# Environment
.env
.env.local

# TypeScript
*.tsbuildinfo

# Testing
coverage/
```

---

## Installation Instructions

1. Create a new directory and save all files above
2. Run `npm install`
3. Run `npm run setup` (this generates PAPI types)
4. Run `npm run dev`

The application will connect to Polkadot mainnet and allow real-time storage queries with full type safety!