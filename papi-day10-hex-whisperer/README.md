# 🎩 PAPI Hex Whisperer - Day 10 Project

A sophisticated hex call data decoder that transforms mysterious blockchain hex strings into human-readable transactions using PAPI's `txFromCallData` method.


## 🎯 Features

- ✨ **Smart Hex Decoder**: Real-time decoding of any valid call data hex
- 🔍 **Byte Inspector**: Visual breakdown of hex bytes with color-coded explanations
- 📚 **Example Gallery**: Pre-loaded transaction examples to learn from
- 🛡️ **Error Resilience**: Graceful handling of invalid/malformed hex
- 📊 **Multi-format Output**: JSON and human-readable views
- 📋 **Copy & Export**: Export decoded transactions easily
- 🎨 **Beautiful UI**: Responsive design with magic-themed animations

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4 with custom animations
- **Blockchain**: Polkadot-API (PAPI) with Smoldot
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ (recommended: 20+)
- npm 9+ or pnpm 8+
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd papi-day10-hex-whisperer
```

### 2. Install Dependencies

```bash
npm install
```

Or if you prefer pnpm:

```bash
pnpm install
```

### 3. Initialize Tailwind CSS

```bash
npx tailwindcss init -p
```

### 4. Run Development Server

```bash
npm run dev
```

The app will open automatically at `http://localhost:3000`

## 📁 Project Structure

```
papi-day10-hex-whisperer/
├── src/
│   ├── components/
│   │   ├── HexDecoder.tsx       # Main hex input and decoding UI
│   │   ├── TransactionViewer.tsx # Displays decoded transaction
│   │   ├── ByteInspector.tsx    # Visual byte breakdown
│   │   └── MagicBackground.tsx  # Animated background
│   ├── hooks/
│   │   ├── usePolkadotAPI.ts    # PAPI connection hook
│   │   └── useHexDecoder.ts     # Hex decoding logic
│   ├── utils/
│   │   ├── hexUtils.ts          # Hex validation and formatting
│   │   ├── transactionExamples.ts # Example transactions
│   │   └── byteParser.ts        # Byte analysis utilities
│   ├── types/
│   │   └── decoding.ts          # TypeScript type definitions
│   ├── styles/
│   │   └── globals.css          # Global styles and Tailwind
│   └── App.tsx                  # Main application component
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎓 What This Project Does

### The Power of txFromCallData

This project demonstrates PAPI's `txFromCallData` method, which allows you to:

1. **Decode Hex Call Data**: Convert mysterious hex strings into readable transaction data
2. **Understand Transaction Structure**: See how transactions are encoded at the byte level
3. **Debug Failed Transactions**: Decode any transaction hex to understand what went wrong
4. **Learn SCALE Encoding**: Visualize how Substrate encodes data

### Example Usage

```typescript
import { Binary } from 'polkadot-api';

// Your mysterious hex string
const hex = '0x0400a0dec5ad1224d8e1c7c0c5c54e50e0e7e7d1b5a0...';

// Decode it using PAPI
const binary = Binary.fromHex(hex);
const tx = await dotApi.txFromCallData(binary);

// Access decoded data
console.log(tx.pallet);  // "Balances"
console.log(tx.method);  // "transfer"
console.log(tx.args);    // { dest: "...", value: "..." }
```

## 🔧 Implementation Details

### Key Components

1. **HexDecoder** - Main input component for hex strings
2. **TransactionViewer** - Displays decoded transaction in human-readable format
3. **ByteInspector** - Visual byte-by-byte breakdown with color coding
4. **MagicBackground** - Animated canvas background for visual appeal

### Key Hooks

1. **usePolkadotAPI** - Manages connection to Polkadot network via Smoldot
2. **useHexDecoder** - Handles hex validation and decoding logic

### Utility Functions

- `isValidHex()` - Validates hex format
- `formatHex()` - Formats hex for display
- `analyzeBytes()` - Breaks down hex into individual bytes
- `extractCallIndices()` - Extracts pallet and call indices

## 🐛 Troubleshooting

### Installation Issues

If you encounter npm install errors:

```bash
# Clear everything and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Tailwind Not Working

```bash
# Reinstall Tailwind
npm install -D tailwindcss@latest autoprefixer@latest postcss@latest
npx tailwindcss init -p
```

### TypeScript Errors

```bash
# Clean build files
rm -rf dist .papi node_modules/.cache
npm run build
```

### Port Already in Use

Change the port in `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    port: 3001  // Use different port
  }
})
```

## 🤝 Contributing

We welcome contributions! Here's how:

### 1. Fork & Clone

```bash
git clone https://github.com/your-username/papi-day10-hex-whisperer.git
cd papi-day10-hex-whisperer
```

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Make Changes

- Follow existing code style
- Add comments for complex logic
- Test thoroughly
- Update documentation if needed

### 4. Commit & Push

```bash
git add .
git commit -m "Add: your feature description"
git push origin feature/your-feature-name
```

### 5. Create Pull Request

- Describe your changes
- Link any related issues
- Request review

## 📚 Learning Resources

- [PAPI Documentation](https://papi.how)
- [Polkadot Wiki](https://wiki.polkadot.network)
- [SCALE Codec](https://docs.substrate.io/reference/scale-codec/)
- [#PAPI30Days Campaign](https://twitter.com/hashtag/PAPI30Days)

## 🎯 Day 10 Mission Objectives

✅ **Learn**: How to decode hex call data using PAPI  
✅ **Understand**: SCALE encoding structure  
✅ **Build**: A visual hex decoder tool  
✅ **Practice**: Runtime metadata-driven decoding  

## 🌟 Next Steps (Day 11)

Tomorrow we'll build on this by:
- Integrating Polkadot.js extension
- Signing decoded transactions
- Broadcasting to the network
- Building a complete transaction workflow

## 📄 License

MIT License - feel free to use this project for learning!

## 💬 Support & Community

- **Issues**: Open an issue for bugs or questions
- **Discussions**: Join the conversation in discussions
- **Twitter**: Share your progress with #PAPI30Days
- **Star**: If you find this useful, give it a star ⭐

## 🙏 Acknowledgments

- Built for the #PAPI30Days educational campaign
- Powered by Polkadot-API (PAPI)
- Inspired by the Polkadot developer community

---

**Built with ❤️ by Dvyne (https://x.com/sage_sepeak) for the #PAPI30Days Campaign**

*"Turning hex into magic 🎩"*

---

## 📝 Additional Notes

### Understanding the Hex Structure

Every Substrate transaction hex follows this pattern:

```
0x [Pallet Index] [Call Index] [Parameters...]
   └─── 1 byte ──┘ └── 1 byte ─┘ └─── Variable ───┘
```

Example: `0x0400...`
- `04` = Pallet Index (Balances pallet)
- `00` = Call Index (transfer method)
- Rest = Encoded parameters (destination, amount)

### Color Coding in Byte Inspector

- 🟣 **Purple**: Pallet Index (first byte)
- 🔵 **Blue**: Call Index (second byte)
- 🟢 **Green**: Length prefixes
- 🟡 **Yellow**: Parameter data

### Common Pallet Indices

- `0x04` - Balances
- `0x07` - Staking
- `0x18` - Utility
- `0x1E` - Multisig
- `0x32` - Assets
- `0x0C` - Governance

---

**Ready to become a hex whisperer? Let's decode! 👨‍💻**