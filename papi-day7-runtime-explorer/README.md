# 🧠 Runtime Explorer - PAPI Day 7 Challenge


> **A powerful TypeScript web application that demonstrates direct runtime API calls to the Polkadot blockchain using PAPI (Polkadot API)**

## 📖 Table of Contents

- [Overview](#overview)
- [What This Project Teaches](#what-this-project-teaches)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Understanding Runtime APIs](#understanding-runtime-apis)
- [How It Works](#how-it-works)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [Resources](#resources)
- [License](#license)

---

## 🎯 Overview

**Runtime Explorer** is an educational project from the #PAPI30Days challenge (Day 7) that demonstrates the power of **direct runtime API calls** to blockchain networks. Unlike traditional approaches that go through multiple layers of abstraction, this application connects directly to the Polkadot runtime, showcasing type-safe, efficient blockchain interactions.

### What Makes This Special?

- **Direct Runtime Access**: No HTTP APIs, no RPC servers - just your code talking directly to the blockchain's brain
- **Type-Safe**: Full TypeScript support with autocomplete for all runtime calls
- **Educational**: Clear visualizations comparing traditional vs direct access patterns
- **Interactive**: Real-time blockchain data with beautiful UI
- **Production-Ready**: Built with modern tools (Vite, TypeScript, PAPI)

---

## 📚 What This Project Teaches

### Core Concepts

1. **Runtime APIs**
   - What they are and why they matter
   - How they differ from traditional RPC calls
   - Direct blockchain communication patterns

2. **PAPI (Polkadot API)**
   - Setting up PAPI with TypeScript
   - Generating type-safe descriptors
   - Making runtime API calls
   - Handling blockchain responses

3. **Blockchain Architecture**
   - Understanding the runtime vs storage layers
   - How data flows through blockchain systems
   - Latency and reliability considerations

4. **TypeScript Best Practices**
   - Strongly-typed blockchain interactions
   - Async/await patterns with blockchain data
   - Error handling for network calls

### Runtime APIs Demonstrated

- **Metadata API**: Chain self-description and capabilities
- **TaggedTransactionQueue**: Transaction validation logic
- **AccountNonceApi**: Account sequence management
- **Core API**: Fundamental blockchain operations

---

## ✨ Features

- ✅ **Direct Runtime Calls** - Make type-safe calls to Polkadot runtime APIs
- ✅ **Real-Time Metadata Display** - Live blockchain version and spec information
- ✅ **Interactive API Selector** - Switch between different runtime APIs
- ✅ **Architecture Visualization** - See the difference between direct vs indirect access
- ✅ **Live Console Logging** - Track all runtime communications
- ✅ **Response Time Tracking** - Measure API call performance
- ✅ **Beautiful UI** - Polkadot-themed, responsive design
- ✅ **Copy-to-Clipboard** - Easy code snippet sharing
- ✅ **Mobile Responsive** - Works on all device sizes

---

## 🔧 Prerequisites

Before you begin, ensure you have:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** >= 9.0.0 (comes with Node.js)
- Basic understanding of TypeScript and blockchain concepts
- A modern web browser (Chrome, Firefox, Safari, Edge)

### Check Your Versions

```bash
node --version  # Should be >= 18.0.0
npm --version   # Should be >= 9.0.0
```

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
# Clone with HTTPS
git clone https://github.com/yourusername/papi-day7-runtime-explorer.git

# Or clone with SSH
git clone git@github.com:yourusername/papi-day7-runtime-explorer.git

# Navigate to project directory
cd papi-day7-runtime-explorer
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- `polkadot-api` - The Polkadot API library
- `vite` - Modern build tool
- `typescript` - Type checking
- Other development dependencies

### Step 3: Generate PAPI Types

**IMPORTANT**: This step generates TypeScript types for the Polkadot runtime.

```bash
npm run setup
```

This command does two things:
1. Adds Polkadot descriptors (`npx papi add dot -n polkadot`)
2. Generates type definitions (`npx papi`)

You should see output like:
```
✔ Added chain "polkadot" with identifier "dot"
✔ Generated types for 1 chain(s)
```

The generated files will be in `.papi/descriptors/` directory.

### Step 4: Start Development Server

```bash
npm run dev
```

The application will open automatically at `http://localhost:5173`

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 💻 Usage

### Running the Application

1. **Start the dev server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Open your browser** to `http://localhost:5173`

3. **Watch the magic happen**:
   - The app automatically connects to Polkadot
   - Runtime metadata loads automatically
   - Stats populate with live blockchain data

### Interacting with Runtime APIs

#### Selecting an API
Click on any of the four API cards:
- **Metadata API** - Chain information
- **Transaction Queue** - Transaction processing
- **Account Nonce** - Sequence numbers
- **Core API** - Fundamental operations

#### Executing Calls
1. Select an API from the cards
2. Click "Execute Runtime Call" button
3. Watch the results populate in real-time
4. Check the console for detailed logs

#### Copying Code
- Click "Copy Call" to copy the runtime API code
- Use it in your own projects

### Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

The built files will be in the `dist/` directory.

---

## 📁 Project Structure

```
papi-day7-runtime-explorer/
├── src/
│   ├── main.ts           # Main application logic & RuntimeExplorer class
│   ├── style.css         # All styling (Polkadot theme)
│   └── vite-env.d.ts     # Vite type declarations (auto-generated)
├── .papi/                # Generated PAPI types (git-ignored)
│   └── descriptors/      # TypeScript descriptors for Polkadot
├── index.html            # Main HTML template
├── package.json          # Dependencies & scripts
├── tsconfig.json         # TypeScript configuration
├── tsconfig.node.json    # TypeScript config for Vite
├── vite.config.ts        # Vite build configuration
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

### Key Files Explained

- **`src/main.ts`**: Contains the `RuntimeExplorer` class with all logic for:
  - Connecting to Polkadot
  - Making runtime API calls
  - Handling UI interactions
  - Logging and error handling

- **`src/style.css`**: Complete styling with:
  - CSS variables for theming
  - Responsive design (mobile-first)
  - Polkadot brand colors
  - Smooth animations

- **`index.html`**: Full UI structure including:
  - Header with connection status
  - Stats bar for runtime info
  - API selector cards
  - Results display
  - Architecture comparison
  - Console logger

---

## 🧠 Understanding Runtime APIs

### What Are Runtime APIs?

Runtime APIs are **direct function calls** to the blockchain's runtime (the "brain" of the blockchain). They allow you to:

- Query blockchain state
- Validate transactions
- Get metadata and capabilities
- Access core blockchain operations

### Traditional Approach (Indirect)

```
Your Code → HTTP API → RPC Server → Node → Runtime
```

**Problems**:
- 4+ layers of abstraction
- Each layer can fail
- Added latency
- Cached/stale data possible
- Translation errors

### Direct Runtime APIs (PAPI)

```
Your Code → Runtime
```

**Benefits**:
- 1 layer (direct connection)
- Minimal failure points
- Lowest latency
- Always fresh data
- No translation errors

### Example Code

```typescript
import { createClient } from 'polkadot-api';
import { getWsProvider } from 'polkadot-api/ws-provider';
import { dot } from '@polkadot-api/descriptors';

// Create client
const client = createClient(getWsProvider('wss://rpc.polkadot.io'));
const dotApi = client.getTypedApi(dot);

// Direct runtime call - TypeScript knows the exact return type!
const metadata = await dotApi.apis.Metadata.metadata();
console.log(`Chain: ${metadata.specName} v${metadata.specVersion}`);
```

---

## ⚙️ How It Works

### Application Flow

1. **Initialization**
   ```typescript
   new RuntimeExplorer()
   ```
   - Sets up event listeners
   - Initializes console logger

2. **Connection**
   ```typescript
   connectToPolkadot()
   ```
   - Creates WebSocket connection to Polkadot
   - Gets typed API instance
   - Automatically loads metadata

3. **Runtime Calls**
   ```typescript
   executeRuntimeCall()
   ```
   - Calls selected runtime API
   - Measures response time
   - Displays formatted results
   - Updates UI with insights

4. **UI Updates**
   - Real-time stats (version, spec name, pallets)
   - JSON result display
   - Console logging
   - Performance metrics

### Key Classes and Methods

#### `RuntimeExplorer` Class

**Methods**:
- `initializeUI()` - Sets up event listeners
- `connectToPolkadot()` - Establishes blockchain connection
- `executeMetadataAPI()` - Calls Metadata runtime API
- `executeRuntimeCall()` - Handles all runtime API calls
- `updateRuntimeStats()` - Updates UI statistics
- `displayMetadataResults()` - Shows API results
- `log()` - Console logging with timestamps

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Setting Up for Development

1. **Fork the repository** on GitHub

2. **Clone your fork**:
   ```bash
   git clone https://github.com/Sage-senpai/PAPI-101/tree/main/papi-day7-runtime-explorer
   cd papi-day7-runtime-explorer
   ```

3. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes** and test thoroughly

5. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Add: your feature description"
   ```

6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request** on GitHub

### Contribution Guidelines

- ✅ Follow the existing code style
- ✅ Add comments for complex logic
- ✅ Test on multiple browsers
- ✅ Update README if needed
- ✅ Keep commits atomic and well-described

### Ideas for Contributions

- 🎨 **UI Improvements**: Enhanced animations, dark mode toggle
- 🔧 **New Runtime APIs**: Add more runtime API examples
- 📊 **Data Visualization**: Charts for blockchain metrics
- 🌐 **Multi-Chain Support**: Add other Polkadot parachains
- 📱 **Mobile UX**: Improve mobile experience
- 🧪 **Testing**: Add unit and integration tests
- 📖 **Documentation**: Improve inline comments and guides

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Failed to scan for dependencies" Error

**Problem**: Missing `tsconfig.node.json`

**Solution**:
```bash
# Create tsconfig.node.json with:
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

#### 2. "Cannot find module '@polkadot-api/descriptors'"

**Problem**: PAPI types not generated

**Solution**:
```bash
npm run setup
```

This generates the required type definitions.

#### 3. "Connection failed" in Browser

**Problem**: WebSocket connection blocked or Polkadot RPC down

**Solutions**:
- Check your internet connection
- Try a different RPC endpoint in `src/main.ts`:
  ```typescript
  // Try alternative endpoints
  getWsProvider('wss://polkadot-rpc.dwellir.com')
  getWsProvider('wss://rpc.polkadot.io')
  ```
- Check browser console for detailed errors

#### 4. TypeScript Errors

**Problem**: Strict type checking issues

**Solution**: The `tsconfig.json` has been configured to be less strict for educational purposes. If you want stricter checks:
```json
{
  "compilerOptions": {
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

#### 5. Port 5173 Already in Use

**Problem**: Another app using the port

**Solution**:
```bash
# Kill the process or use a different port
npm run dev -- --port 3000
```

### Getting Help

- 📖 [PAPI Documentation](https://docs.polkadot.com/develop/toolkit/api-libraries/papi/)
- 💬 [Polkadot Stack Exchange](https://substrate.stackexchange.com/)
- 🐛 [Report Issues](https://github.com/yourusername/papi-day7-runtime-explorer/issues)

---

## 📚 Resources

### Official Documentation
- [Polkadot API (PAPI) Docs](https://docs.polkadot.com/develop/toolkit/api-libraries/papi/)
- [Polkadot Wiki - Runtime](https://wiki.polkadot.network/docs/learn-runtime)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)

### Learning Resources
- [Polkadot Blockchain Academy](https://www.polkadot.network/development/academy/)
- [Substrate Documentation](https://docs.substrate.io/)
- [Web3 Foundation](https://web3.foundation/)

### Community
- [Polkadot Discord](https://discord.gg/polkadot)
- [r/Polkadot](https://reddit.com/r/polkadot)
- [Polkadot Forum](https://forum.polkadot.network/)

---

## 📄 License

This project is licensed under the **MIT License** - see below for details:

```
MIT License

Copyright (c) 2025 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- **Polkadot Team** - For creating an amazing blockchain ecosystem
- **PAPI Contributors** - For the excellent API library
- **#PAPI30Days Challenge** - For the learning opportunity
- **Community Contributors** - Everyone who helps improve this project

---

## 🎯 What's Next?

After completing this project, consider:

1. **Day 8-30**: Continue the #PAPI30Days challenge
2. **Build Your Own**: Create a dApp using these concepts
3. **Contribute**: Help improve this educational resource
4. **Share**: Teach others what you've learned

---

<div align="center">

**Built with ❤️ by sage_senpeak (https://x.com/sage_senpeak) for the Polkadot Community**

[⭐ Star this repo](https://github.com/yourusername/papi-day7-runtime-explorer) • [🐛 Report Bug](https://github.com/yourusername/papi-day7-runtime-explorer/issues) • [✨ Request Feature](https://github.com/yourusername/papi-day7-runtime-explorer/issues)

**Part of the #PAPI30Days Challenge - Day 7: Runtime APIs**

</div>