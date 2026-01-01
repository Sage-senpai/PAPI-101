# 🌐 PAPI Day 2: Type Generator & Explorer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue)](https://www.typescriptlang.org/)

> **Day 2 Challenge of #PAPI30Days** - Automatically generate TypeScript types from Polkadot metadata and explore them with style! 🎨

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Commands Reference](#-commands-reference)
- [Project Structure](#-project-structure)
- [How It Works](#-how-it-works)
- [Frontend Details](#-frontend-details)
- [ASCII Art & Styling](#-ascii-art--styling)
- [Contributing](#-contributing)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## 🎯 Overview

This project demonstrates automatic TypeScript type generation from Polkadot blockchain metadata using **Polkadot-API (PAPI)**. It includes:

- **Backend**: Node.js scripts that generate and explore types
- **Frontend**: Browser-based Smoldot light client demo with live blockchain connection

Perfect for developers learning to work with Polkadot's type-safe API! 🚀

---

## ✨ Features

### Backend (Node.js)
- ✅ Automatic type generation from Polkadot metadata
- ✅ Type explorer with file previews
- ✅ Colorful CLI output with ASCII art
- ✅ Error handling and helpful messages

### Frontend (Browser)
- ✅ Smoldot light client integration
- ✅ Live blockchain connection (no full node needed!)
- ✅ Real-time finalized block display
- ✅ Beautiful gradient UI with glassmorphism
- ✅ Console-style output for debugging

---

## 📦 Prerequisites

Before you begin, ensure you have:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- A code editor (VS Code recommended)

Check your versions:
```bash
node -v    # Should be >= 18.0.0
npm -v     # Any recent version
```

---

## 🚀 Installation

### Option 1: Clone the Repository

```bash
# Clone the repo
git clone https://github.com/Sage-senpeak/PAPI-101/papi-day2-type-generator.git

# Navigate to project directory
cd papi-day2-type-generator

# Install dependencies
npm install
```

### Option 2: Start from Scratch

```bash
# Create new directory
mkdir papi-day2-type-generator
cd papi-day2-type-generator

# Initialize npm project
npm init -y

# Copy the package.json from this repo and run:
npm install
```

---

## ⚡ Quick Start

### 1️⃣ Generate Types (First Time Setup)

This downloads Polkadot metadata and generates TypeScript types:

```bash
npm run setup
```

**What happens:**
- Adds Polkadot chain configuration
- Fetches latest metadata from Polkadot network
- Generates type descriptors in `.papi/descriptors/`

### 2️⃣ Explore Generated Types

View what types were created:

```bash
npm run explore
```

**Output example:**
```
🔍 Exploring PAPI Type Descriptors

✓ Found 3 file(s):

📄 dot.d.ts
   Size: 45.32 KB
   Preview:
   export declare const dot: ChainDefinition<...>
```

### 3️⃣ Run the Main Script

```bash
npm start
```

Shows ASCII banner and confirms setup ✨

### 4️⃣ Launch Frontend Demo

```bash
npm run dev:frontend
```

Opens browser at `http://localhost:5173` with live blockchain connection! 🌐

---

## 📚 Commands Reference

### Backend Commands

| Command | Description | When to Use |
|---------|-------------|-------------|
| `npm install` | Install all dependencies | First time setup, after cloning |
| `npm run setup` | Generate Polkadot types | Initial setup, after chain upgrades |
| `npm run explore` | View generated type files | After setup, to inspect types |
| `npm start` | Run main Node.js script | Test backend functionality |
| `npm run build:node` | Compile TypeScript to JavaScript | Before running compiled code |
| `npm run dev:node` | Run TypeScript directly (dev mode) | During development |
| `npm run dev:explore` | Explore types in dev mode | Quick type inspection |
| `npm run clean` | Remove node_modules & reinstall | Fix dependency issues |

### Frontend Commands

| Command | Description | When to Use |
|---------|-------------|-------------|
| `npm run dev:frontend` | Start Vite dev server | Frontend development |
| `npm run build:frontend` | Build for production | Deployment |
| `npm run preview` | Preview production build | Test production build |

### 🎯 Typical Workflow

```bash
# 1. Fresh install
npm install

# 2. Generate types
npm run setup

# 3. Explore what was generated
npm run explore

# 4. Start frontend
npm run dev:frontend
```

---

## 📁 Project Structure

```
papi-day2-type-generator/
├── src/
│   ├── index.ts              # Main backend script
│   ├── frontend.ts           # Browser entry point
│   ├── styles/
│   │   └── styles.scss       # Frontend styles
│   └── utils/
│       └── explorer.ts       # Type file explorer
├── .papi/
│   └── descriptors/          # Auto-generated types ✨
│       ├── dot.d.ts          # Polkadot type definitions
│       ├── dot.js            # Runtime descriptors
│       └── package.json      # Descriptor package info
├── dist/                     # Compiled JavaScript (auto-generated)
├── index.html                # Frontend HTML
├── package.json              # Dependencies & scripts
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite bundler config (if added)
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
└── README.md                 # You are here! 📍
```

---

## 🔧 How It Works

### Type Generation Process

1. **Add Chain Configuration**
   ```bash
   npx papi add dot -n polkadot
   ```
   Downloads Polkadot chain specification

2. **Generate Types**
   ```bash
   npx papi
   ```
   - Fetches latest metadata from Polkadot
   - Parses runtime types (pallets, extrinsics, storage, events)
   - Generates TypeScript definitions in `.papi/descriptors/`

3. **Use Generated Types**
   ```typescript
   import { dot } from '@polkadot-api/descriptors';
   import { createClient } from 'polkadot-api';
   
   const client = createClient(/* provider */);
   const api = client.getTypedApi(dot);
   
   // Now you have full type safety! 🎉
   const balance = await api.query.System.Account.getValue(address);
   ```

### Backend Architecture

```
┌─────────────────┐
│   src/index.ts  │  Main script with ASCII banner
└────────┬────────┘
         │
         ├─► figlet: Creates ASCII art banner
         ├─► chalk: Adds colors to console output
         └─► child_process: Runs PAPI CLI commands
         
┌──────────────────────┐
│ src/utils/explorer.ts│  Inspects generated files
└─────────┬────────────┘
          │
          └─► fs/promises: Reads .papi directory
```

### Frontend Architecture

```
┌──────────────────┐
│ src/frontend.ts  │  Browser entry point
└────────┬─────────┘
         │
         ├─► Smoldot: In-browser light client
         ├─► Polkadot-API: Type-safe blockchain interactions
         └─► SCSS: Styling with glassmorphism effects
         
┌─────────────────┐
│  index.html     │  HTML structure
└─────────────────┘
```

---

## 🎨 Frontend Details

### What is Smoldot?

**Smoldot** is a lightweight Polkadot client that runs entirely in the browser! 

**Benefits:**
- ⚡ No backend server needed
- 🌐 Direct blockchain connection
- 🔒 Secure (client-side only)
- 📦 Small bundle size (~2MB)

### How the Frontend Works

1. **Initialize Smoldot**
   ```typescript
   const smoldot = start();
   const chain = await smoldot.addChain({ chainSpec: polkadotChainSpec });
   ```

2. **Create PAPI Client**
   ```typescript
   const client = createClient(getSmProvider(chain));
   ```

3. **Fetch Blockchain Data**
   ```typescript
   const finalizedHash = await client._request("chain_getFinalizedHead", []);
   const header = await client._request("chain_getHeader", [finalizedHash]);
   ```

### UI Features

- **Glassmorphism Effect**: Frosted glass appearance with backdrop blur
- **Gradient Background**: Polkadot pink to purple gradient
- **Console Output**: Simulated terminal with color-coded messages
- **Status Display**: Live blockchain data (block number, connection status)
- **Responsive Design**: Works on desktop and mobile

### Styling System

```scss
// Example: Console styling
.console {
  background: #1a1a1a;           // Dark background
  border-radius: 12px;
  font-family: 'Courier New';    // Monospace font
  color: #00ff00;                // Matrix green!
}

.console-output { color: #00ff88; }  // Success messages
.console-warning { color: #ffb74d; } // Warnings
.console-error { color: #ff5252; }   // Errors
```

---

## 🎭 ASCII Art & Styling

### Figlet Integration

**Figlet** generates ASCII art from text. We use it for the banner:

```typescript
import figlet from 'figlet';

const banner = figlet.textSync('PAPI Day 2', { font: 'Big' });
console.log(chalk.cyan(banner));
```

**Output:**
```
  _____        _____ _____   _____               ___  
 |  __ \ /\   |  __ \_   _| |  __ \             |__ \ 
 | |__) /  \  | |__) || |   | |  | | __ _ _   _    ) |
 |  ___/ /\ \ |  ___/ | |   | |  | |/ _` | | | |  / / 
 | |  / ____ \| |    _| |_  | |__| | (_| | |_| | / /_ 
 |_| /_/    \_\_|   |_____| |_____/ \__,_|\__, ||____|
                                            __/ |      
                                           |___/       
```

### Available Fonts

```bash
# Try different fonts in src/index.ts
figlet.textSync('PAPI Day 2', { font: 'Standard' });
figlet.textSync('PAPI Day 2', { font: 'Slant' });
figlet.textSync('PAPI Day 2', { font: 'Big' });      // Current
figlet.textSync('PAPI Day 2', { font: '3D-ASCII' });
```

### Chalk Color System

**Chalk** adds colors to terminal output:

```typescript
import chalk from 'chalk';

console.log(chalk.cyan('Info message'));      // Cyan
console.log(chalk.green('✓ Success'));        // Green
console.log(chalk.yellow('⚠ Warning'));       // Yellow
console.log(chalk.red('✗ Error'));            // Red
console.log(chalk.magenta('Highlight'));      // Magenta
console.log(chalk.gray('Dim text'));          // Gray
```

### Emoji Usage

Strategic emojis make CLI output more readable:

- ✓ Success indicators
- ✗ Error markers
- ⚠ Warnings
- 🔧 Configuration
- 📦 Files/packages
- 🔍 Exploration
- 🌐 Network operations
- ✨ Completion

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### 1️⃣ Fork & Clone

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/Sage-senpeak/PAPI-101/papi-day2-type-generator.git
cd papi-day2-type-generator
```

### 2️⃣ Create a Branch

```bash
git checkout -b feature/your-feature-name
```

**Branch naming conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code improvements

### 3️⃣ Make Changes

```bash
# Install dependencies
npm install

# Make your changes
# Test thoroughly!
npm run setup
npm start
npm run dev:frontend
```

### 4️⃣ Commit & Push

```bash
git add .
git commit -m "feat: add amazing feature"
git push origin feature/your-feature-name
```

**Commit message format:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Adding tests

### 5️⃣ Create Pull Request

1. Go to GitHub repository
2. Click "Pull Request"
3. Fill in description
4. Wait for review! 🎉

### Development Guidelines

- ✅ Follow existing code style
- ✅ Add comments for complex logic
- ✅ Test before submitting
- ✅ Update README if needed
- ✅ Keep commits focused and small

### Ideas for Contributions

- 🌟 Support additional chains (Kusama, Westend)
- 🌟 Add more frontend features (transaction signing)
- 🌟 Improve error messages
- 🌟 Add tests
- 🌟 Optimize performance
- 🌟 Enhance documentation

---

## 🐛 Troubleshooting

### Common Issues

#### ❌ "Cannot use import statement outside a module"

**Solution:**
```bash
# Ensure package.json has:
"type": "module"

# Or rename files to .mjs
```

#### ❌ "Module not found: @polkadot-api/descriptors"

**Solution:**
```bash
npm run setup  # Generate types first
```

#### ❌ Vite build errors

**Solution:**
```bash
npm run clean  # Clean install
npm install
```

#### ❌ "PAPI command not found"

**Solution:**
```bash
npx papi --help  # Use npx prefix
```

#### ⚠️ Slow Smoldot startup

**Normal!** First connection takes 30-60 seconds while syncing.

### Getting Help

- 📖 [Polkadot-API Docs](https://papi.how/)
- 💬 [Polkadot Forum](https://forum.polkadot.network/)
- 🐦 Twitter: #PAPI30Days
- 💡 [Open an issue](https://github.com/yourusername/papi-day2-type-generator/issues)

---

## 📸 Screenshots

### Backend Console
```
  _____        _____ _____   _____               ___  
 |  __ \ /\   |  __ \_   _| |  __ \             |__ \ 
 | |__) /  \  | |__) || |   | |  | | __ _ _   _    ) |
 |  ___/ /\ \ |  ___/ | |   | |  | |/ _` | | | |  / / 
 | |  / ____ \| |    _| |_  | |__| | (_| | |_| | / /_ 
 |_| /_/    \_\_|   |_____| |_____/ \__,_|\__, ||____|
                                            __/ |      
                                           |___/       

📋 Checking dependencies...
✓ Node version: v18.0.0
🔧 Setting up PAPI types...
✓ Types generated successfully!
```

### Frontend UI
- Gradient background (pink to purple)
- Live blockchain connection status
- Real-time block numbers
- Console-style output

## 🌟 Credits

Built with:
- [Polkadot-API (PAPI)](https://github.com/polkadot-api/polkadot-api)
- [Smoldot](https://github.com/smol-dot/smoldot)
- [Figlet](https://github.com/patorjk/figlet.js)
- [Chalk](https://github.com/chalk/chalk)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)

Part of the **#PAPI30Days** learning challenge! 🎓

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

---

## 🚀 Next Steps

1. ⭐ **Star this repo** if you found it helpful!
2. 🍴 **Fork it** to create your own version
3. 🐦 **Share** with #PAPI30Days hashtag
4. 🔨 **Build** something awesome with Polkadot!

---

<div align="center">

**Built with ❤️ by Sage_senpeak**

[Report Bug](https://github.com/yourusername/papi-day2-type-generator/issues) · [Request Feature](https://github.com/yourusername/papi-day2-type-generator/issues)

</div>