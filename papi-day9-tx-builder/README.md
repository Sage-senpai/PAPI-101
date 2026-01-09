# 🏎️ PAPI Turbo Transaction Builder - Day 9 Project

A sophisticated dashboard for building, inspecting, and validating Polkadot transactions using PAPI's `tx` method. Features real-time transaction construction, call data inspection, and multi-pallet support.


## 📋 Table of Contents

- [Features](#-features)
- [What You'll Learn](#-what-youll-learn)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [How It Works](#-how-it-works)
- [Contributing](#-contributing)
- [Troubleshooting](#-troubleshooting)

## 🎯 Features

- **Multi-pallet Explorer**: Browse all available pallets and calls on Polkadot
- **Transaction Builder**: Form-based transaction construction with real-time validation
- **Call Data Inspector**: Hex viewer with breakdown of encoded transaction
- **Chain Status**: Real-time connection to Polkadot via light-client (Smoldot)
- **Turbo Mode**: Auto-suggest parameters based on selected call
- **Error Prevention**: Runtime validation before transaction creation
- **Export Options**: Copy call data, transaction details
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## 🧠 What You'll Learn

This project demonstrates:

1. **PAPI's `tx` Method**: How to build fully-typed transactions without manual encoding
2. **Runtime Metadata**: How PAPI uses runtime metadata for type safety
3. **Call Data Encoding**: Understanding transaction encoding and hex representation
4. **Multi-pallet Support**: Working with different pallets (Balances, Staking, etc.)
5. **Light Client Integration**: Using Smoldot for substrate chain connections
6. **Form Validation**: Real-time parameter validation using Zod
7. **TypeScript Best Practices**: Leveraging TypeScript for blockchain development

## ⚡ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: v9.0.0 or higher (comes with Node.js)
- **Git**: ([Download](https://git-scm.com/))
- A modern web browser (Chrome, Firefox, Edge, or Safari)

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone (link)
cd papi-day9-tx-builder
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all necessary packages including:
- `polkadot-api` - The Polkadot API library
- `@polkadot-api/descriptors` - Type descriptors for Polkadot
- `@polkadot-api/sm-provider` - Smoldot light client provider
- React, TypeScript, Tailwind CSS, and other dependencies

### Step 3: Initialize Tailwind CSS (if needed)

If Tailwind isn't configured, run:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Step 4: Start the Development Server

```bash
npm run dev
```

The application will open in your browser at `http://localhost:3000`

## 💻 Usage

### Connecting to Polkadot

1. Click the **"Connect to Polkadot"** button
2. Wait for the light client to synchronize (this may take 10-30 seconds)
3. Once connected, you'll see the chain status with:
   - Current block number
   - Runtime version
   - Existential deposit
   - Connection status

### Building a Transaction

1. **Select a Pallet**: Browse the Pallet Explorer on the left
2. **Choose a Call**: Click on any available call (e.g., `Balances.transfer_keep_alive`)
3. **Fill Parameters**: The form will auto-fill with example parameters
4. **Customize**: Modify the destination address and amount as needed
5. **Build**: Click "Build Transaction" to generate the call data

### Inspecting Call Data

After building a transaction:
- View the hexadecimal encoded call data
- See the breakdown of pallet index and call index
- Copy the call data for use in other tools
- Review transaction parameters

### Supported Operations

#### Balances Pallet
- `transfer` - Transfer DOT to another account
- `transfer_keep_alive` - Transfer keeping sender alive
- `transfer_all` - Transfer all available balance

#### Staking Pallet
- `bond` - Bond tokens for staking
- `bond_extra` - Add more tokens to stake
- `unbond` - Schedule tokens for unbonding
- `nominate` - Nominate validators

#### Utility Pallet
- `batch` - Execute multiple calls atomically
- `batch_all` - Execute multiple calls with revert on failure

## 📁 Project Structure

```
papi-day9-tx-builder/
├── public/                  # Static assets
│   └── vite.svg
├── src/
│   ├── components/          # React components
│   │   ├── ChainStatus.tsx           # Connection status display
│   │   ├── PalletExplorer.tsx        # Pallet and call browser
│   │   ├── TransactionBuilder.tsx    # Transaction form
│   │   ├── TransactionInspector.tsx  # Call data viewer
│   │   └── TurboBackground.tsx       # Animated background
│   ├── hooks/               # Custom React hooks
│   │   ├── usePolkadotAPI.ts         # PAPI connection hook
│   │   └── useTransactionBuilder.ts  # Transaction building logic
│   ├── types/               # TypeScript type definitions
│   │   └── transaction.ts            # Transaction types
│   ├── utils/               # Utility functions
│   │   ├── formatters.ts             # Display formatters
│   │   ├── validators.ts             # Input validation
│   │   └── palletsData.ts            # Pallet information
│   ├── styles/              # CSS styles
│   │   └── globals.css               # Global styles with Tailwind
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Application entry point
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── vite.config.ts           # Vite build configuration
└── README.md                # This file
```

## 🔧 How It Works

### 1. Connection (usePolkadotAPI Hook)

```typescript
const smoldotProvider = getSmProvider("wss://rpc.polkadot.io");
const papiClient = createClient(smoldotProvider);
const typedApi = papiClient.getTypedApi(dot);
```

- Uses Smoldot light client for substrate connection
- No need for external RPC providers
- Fully decentralized and trustless

### 2. Transaction Building (tx Method)

```typescript
const tx = api.tx.Balances.transfer_keep_alive({
  dest: MultiAddress.Id(address),
  value: BigInt(amount)
});

const callData = tx.encodedCallData;
```

- PAPI automatically encodes parameters
- Type-safe at compile time
- Runtime-aware for compatibility

### 3. Type Safety

All types are generated from chain metadata:

```typescript
interface TransactionCall {
  pallet: string;
  method: string;
  args: Record<string, unknown>;
  callData: string;
  description: string;
}
```

### 4. Validation Pipeline

1. **Form Validation** (Zod) - Validates input format
2. **Type Validation** (TypeScript) - Ensures correct types
3. **Runtime Validation** (PAPI) - Checks against chain metadata

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Reporting Bugs

1. Check if the issue already exists
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

### Suggesting Features

1. Open an issue with the "enhancement" label
2. Describe the feature and its benefits
3. Provide examples if possible

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add comments for complex logic
- Update documentation as needed
- Ensure TypeScript types are correct
- Test on multiple browsers

## 🐛 Troubleshooting

### Installation Issues

**Problem**: `npm install` fails with Tailwind errors

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

**Problem**: Tailwind command not found

**Solution**:
```bash
# Install Tailwind as dev dependency
npm install -D tailwindcss postcss autoprefixer

# Initialize config
npx tailwindcss init -p
```

### Connection Issues

**Problem**: "Connection failed" error

**Solutions**:
- Check your internet connection
- Try a different RPC endpoint in `usePolkadotAPI.ts`:
  ```typescript
  getSmProvider("wss://polkadot-rpc.dwellir.com")
  ```
- Disable browser extensions that might block WebSocket

**Problem**: Light client takes too long to sync

**Solution**: This is normal on first connection (10-60 seconds). Smoldot needs to sync chain state.

### Build Issues

**Problem**: TypeScript errors about missing types

**Solution**:
```bash
# Regenerate PAPI descriptors
npx papi add dot wss://rpc.polkadot.io
```

**Problem**: Build fails with module errors

**Solution**:
```bash
# Check Node version (must be 18+)
node --version

# Update if needed
nvm install 18
nvm use 18
```

### Runtime Issues

**Problem**: Transaction building fails

**Possible causes**:
- Invalid address format (must be 47-48 characters)
- Amount too low (below existential deposit)
- API not fully connected yet

**Problem**: Call data looks incorrect

**Solution**: This is normal! PAPI handles encoding. The hex represents:
- Pallet index (first byte)
- Call index (second byte)
- Encoded parameters (remaining bytes)

## 📚 Additional Resources

- **PAPI Documentation**: [https://papi.how](https://papi.how)
- **Polkadot Wiki**: [https://wiki.polkadot.network](https://wiki.polkadot.network)
- **#PAPI30Days**: Follow the campaign on Twitter
- **Substrate Docs**: [https://docs.substrate.io](https://docs.substrate.io)

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Polkadot-API Team** for creating an amazing developer experience
- **#PAPI30Days Campaign** for the learning journey
- **Substrate Community** for continuous support



**Built with ❤️ by Dvye (https://x.com/sage_senpeak) for #PAPI30Days Campaign • Day 9: Transaction Building**

*"So smooth, it feels illegal 🏎️"*