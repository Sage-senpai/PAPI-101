# 🛠️ Setup Guide for TypedApi Explorer

## Quick Start

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd papi-day4-typedAPI-explorer

# 2. Install dependencies
npm install

# 3. Generate TypedApi descriptors
npm run setup

# 4. Start development server
npm run dev
```

## Detailed Setup Instructions

### Step 1: Install Dependencies

```bash
npm install
```

This will install:
- `polkadot-api` - The main PAPI library
- `vite` - Development server and build tool
- `typescript` - TypeScript compiler
- Other dev dependencies

### Step 2: Generate TypedApi Descriptors

```bash
npm run setup
```

This command does two things:
1. Adds Polkadot descriptors: `npx papi add dot -n polkadot`
2. Generates types: `npx papi`

**What happens:**
- Connects to Polkadot network
- Fetches latest chain metadata
- Generates TypeScript types in `.papi/descriptors/`

**Important:** If this fails:
```bash
# Try manually
npx papi add dot -n polkadot
npx papi
```

### Step 3: Start Development Server

```bash
npm run dev
```

Server starts at: `http://localhost:5173`

## Common Issues & Fixes

### Issue 1: "Cannot find module '@polkadot-api/descriptors'"

**Cause:** Descriptors not generated

**Fix:**
```bash
npm run setup
# or manually
npx papi
```

### Issue 2: Connection Timeout / Network Error

**Cause:** Unable to reach Polkadot RPC endpoint

**Fix:**
1. Check internet connection
2. Try alternative RPC endpoint in `src/main.ts`:
```typescript
// Change from:
getWsProvider('wss://rpc.polkadot.io')

// To one of these:
getWsProvider('wss://polkadot-rpc.dwellir.com')
getWsProvider('wss://rpc.dotters.network/polkadot')
getWsProvider('wss://polkadot.api.onfinality.io/public-ws')
```

### Issue 3: Build Errors

**Fix:**
```bash
# Clean everything
npm run clean
rm -rf node_modules package-lock.json .papi

# Reinstall
npm install
npm run setup
```

### Issue 4: TypeScript Errors in IDE

**Fix:**
1. Restart TypeScript server in VS Code: `Cmd/Ctrl + Shift + P` → "TypeScript: Restart TS Server"
2. Ensure `.papi/descriptors` folder exists
3. Run `npm run setup` again

### Issue 5: Port 5173 Already in Use

**Fix:**
```bash
# Option 1: Kill process on port 5173
# On Mac/Linux:
lsof -ti:5173 | xargs kill -9

# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Option 2: Use different port
# Edit vite.config.ts:
server: {
  port: 3000, // Change to any available port
  open: true
}
```

## Project Structure Explained

```
papi-day4-typedAPI-explorer/
├── .papi/                      # Auto-generated (don't commit)
│   └── descriptors/           # TypedApi type definitions
│       ├── package.json
│       └── dist/
│           └── dot.d.ts      # Polkadot types
│
├── src/
│   ├── main.ts               # Main application logic
│   └── style.css             # Styles
│
├── index.html                # HTML entry point
├── package.json              # Dependencies & scripts
├── tsconfig.json             # TypeScript config
├── vite.config.ts            # Vite config
└── README.md                 # Documentation
```

## Understanding TypedApi Generation

### What is Generated?

When you run `npm run setup`, PAPI:

1. **Fetches Metadata**: Connects to Polkadot and downloads chain metadata
2. **Generates Types**: Creates TypeScript definitions in `.papi/descriptors/`
3. **Creates Package**: Makes it importable as `@polkadot-api/descriptors`

### Why is it in `.papi`?

- Auto-generated files shouldn't be committed
- Regenerated whenever needed
- Keeps your repo clean

### Example Generated Type

```typescript
// In .papi/descriptors/dist/dot.d.ts
export interface Constants {
  System: {
    Version: () => Promise<{
      specName: string;
      specVersion: number;
      implName: string;
      implVersion: number;
      // ... more fields
    }>;
    BlockLength: () => Promise<{
      max: {
        normal: number;
        operational: number;
        mandatory: number;
      };
    }>;
    // ... all other constants
  };
  Balances: {
    ExistentialDeposit: () => Promise<bigint>;
    // ... more
  };
  // ... all pallets
}
```

## Development Workflow

### 1. Making Code Changes

```bash
# Vite hot-reloads automatically
# Just save your files and see changes instantly
```

### 2. Adding New Features

```typescript
// src/main.ts
// Add new functionality here
// TypeScript will validate everything!
```

### 3. Styling Changes

```css
/* src/style.css */
/* CSS changes reflect immediately */
```

### 4. Testing Different Chains

Want to explore Kusama or Westend?

```bash
# Add chain descriptors
npx papi add ksm -n kusama
npx papi add wnd -n westend

# Regenerate
npx papi
```

Then in code:
```typescript
import { ksm } from '@polkadot-api/descriptors';
import { wnd } from '@polkadot-api/descriptors';

// Use like:
const kusamaApi = client.getTypedApi(ksm);
const westendApi = client.getTypedApi(wnd);
```

## Building for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

Output in `dist/` folder.

## VS Code Setup (Recommended)

### Recommended Extensions

1. **TypeScript**: Built-in, ensure enabled
2. **Prettier**: For code formatting
3. **ESLint**: For linting
4. **Vite**: For better dev experience

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.updateImportsOnFileMove.enabled": "always"
}
```

## Environment Variables (Optional)

Create `.env` for custom RPC endpoints:

```bash
# .env
VITE_RPC_ENDPOINT=wss://rpc.polkadot.io
```

Use in code:
```typescript
const endpoint = import.meta.env.VITE_RPC_ENDPOINT || 'wss://rpc.polkadot.io';
const provider = getWsProvider(endpoint);
```

## Performance Tips

### 1. Connection Pooling

For production apps, use connection pooling:

```typescript
const client = createClient(
  getWsProvider('wss://rpc.polkadot.io', {
    // Connection pooling options
  })
);
```

### 2. Caching

Cache frequently accessed constants:

```typescript
let cachedVersion: any = null;

async function getVersion() {
  if (cachedVersion) return cachedVersion;
  cachedVersion = await dotApi.constants.System.Version();
  return cachedVersion;
}
```

## Debugging

### Enable Debug Logs

```typescript
// In src/main.ts
const client = createClient(
  getWsProvider('wss://rpc.polkadot.io'),
  {
    // Add debug options
  }
);
```

### Browser DevTools

- **Console**: See all logs
- **Network**: Monitor WebSocket connections
- **Application**: Check storage (not used in this app)

## Next Steps

1. **Explore More Constants**: Add more chain constants to explore
2. **Add Queries**: Fetch blockchain state (balances, accounts, etc.)
3. **Build Transactions**: Create and sign transactions
4. **Add More Chains**: Support Kusama, Westend, custom chains
5. **Advanced Types**: Explore complex type scenarios

## Resources

- [PAPI Documentation](https://papi.how)
- [TypedApi Guide](https://papi.how/typed)
- [Polkadot Wiki](https://wiki.polkadot.network/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Getting Help

1. Check this guide
2. Read [PAPI docs](https://papi.how)
3. Open GitHub issue
4. Ask in Polkadot Discord

---

**Happy Building! 🚀**

Remember: TypedApi makes blockchain development safer, faster, and more enjoyable. Take advantage of those types!