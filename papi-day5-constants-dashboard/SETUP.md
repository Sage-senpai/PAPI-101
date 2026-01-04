# 🛠️ Setup Guide - Chain Constants Dashboard

## Quick Start (60 Seconds)

```bash
cd papi-day5-constants-dashboard
npm install
npm run setup
npm run dev
```

Open `http://localhost:5173` and click "Fetch All" ✨

---

## Detailed Setup

### Step 1: Prerequisites

**Required Software:**
```bash
node --version  # Should be >= 20.0.0
npm --version   # Should be >= 10.0.0
```

**Install Node.js if needed:**
- Download from [nodejs.org](https://nodejs.org/)
- Or use [nvm](https://github.com/nvm-sh/nvm):
  ```bash
  nvm install 20
  nvm use 20
  ```

### Step 2: Install Dependencies

```bash
npm install
```

**What gets installed:**
- `polkadot-api` - Main PAPI library
- `vite` - Dev server and build tool
- `typescript` - TypeScript compiler
- Dev dependencies for formatting

### Step 3: Generate TypedApi Descriptors

```bash
npm run setup
```

**This command:**
1. Adds Polkadot descriptors: `npx papi add dot -n polkadot`
2. Generates types: `npx papi`
3. Creates `.papi/descriptors/` folder

**What you'll see:**
```
✔ Added polkadot chain
✔ Generating descriptors...
✔ Done! Check .papi/descriptors/
```

### Step 4: Start Development Server

```bash
npm run dev
```

**Server info:**
- URL: `http://localhost:5173`
- Auto-opens browser
- Hot module reload enabled

---

## Common Issues & Fixes

### Issue 1: "Cannot find module '@polkadot-api/descriptors'"

**Cause:** TypedApi descriptors not generated

**Fix:**
```bash
npm run setup
```

If that fails:
```bash
npx papi add dot -n polkadot
npx papi
```

Verify `.papi/descriptors/` folder exists.

---

### Issue 2: Connection Timeout

**Cause:** Cannot reach RPC endpoint

**Fix 1: Try alternative endpoint**

Edit `src/main.ts`:
```typescript
// Change from:
getWsProvider('wss://rpc.polkadot.io')

// To one of these:
getWsProvider('wss://polkadot-rpc.dwellir.com')
getWsProvider('wss://rpc.dotters.network/polkadot')
getWsProvider('wss://polkadot.api.onfinality.io/public-ws')
```

**Fix 2: Check firewall/network**
- Ensure WebSocket connections allowed
- Try different network (mobile hotspot, etc.)
- Check VPN settings

---

### Issue 3: Port 5173 Already in Use

**Fix Option 1: Kill process**

Mac/Linux:
```bash
lsof -ti:5173 | xargs kill -9
```

Windows:
```powershell
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**Fix Option 2: Use different port**

Edit `vite.config.ts`:
```typescript
server: {
  port: 3000,  // Change to any available port
  open: true
}
```

---

### Issue 4: Build Errors

**Fix:**
```bash
# Clean everything
npm run clean
rm -rf node_modules package-lock.json .papi

# Fresh install
npm install
npm run setup
```

---

### Issue 5: Constants Not Fetching

**Symptoms:**
- "Fetch All" button doesn't work
- Constants show "—" or errors
- Console shows fetch errors

**Debugging:**

1. **Check connection:**
   ```javascript
   // Open browser console (F12)
   // Look for connection errors
   ```

2. **Verify TypedApi:**
   ```bash
   # Regenerate descriptors
   npm run setup
   ```

3. **Check constant names:**
   - Some constants may not exist in current runtime
   - Check [Polkadot.js Apps](https://polkadot.js.org/apps/#/chainstate/constants) for available constants

4. **Try one constant manually:**
   ```typescript
   // In browser console:
   const version = await dotApi.constants.System.Version();
   console.log(version);
   ```

---

## Project Structure

```
papi-day5-constants-dashboard/
│
├── .papi/                    # Auto-generated (gitignored)
│   └── descriptors/          # TypedApi type definitions
│       └── dist/
│           └── dot.d.ts      # Polkadot types
│
├── src/
│   ├── main.ts              # Main application
│   └── style.css            # Styles
│
├── index.html               # HTML entry
├── package.json             # Dependencies
├── tsconfig.json            # TS config
├── vite.config.ts           # Vite config
├── .gitignore              # Git ignore rules
└── README.md               # Documentation
```

---

## Understanding the Dashboard

### 1. Connection Flow

```
User opens app
    ↓
Connect to Polkadot WSS
    ↓
Create TypedApi instance
    ↓
Fetch runtime info
    ↓
Ready for constant fetching
```

### 2. Fetch Flow

```
User clicks "Fetch All"
    ↓
Set all constants to "pending"
    ↓
Fetch each constant sequentially
    ↓
Update UI with results
    ↓
Update comparison section
```

### 3. Auto-Refresh

```
Auto-refresh enabled (default)
    ↓
Every 30 seconds:
  - Fetch all constants
  - Update UI
  - Update stats
```

---

## Configuration

### Changing RPC Endpoint

**File:** `src/main.ts`

```typescript
getWsProvider('wss://YOUR-RPC-ENDPOINT-HERE')
```

**Popular endpoints:**
- `wss://rpc.polkadot.io` (Official)
- `wss://polkadot-rpc.dwellir.com` (Dwellir)
- `wss://rpc.dotters.network/polkadot` (Dotters)
- `wss://polkadot.api.onfinality.io/public-ws` (OnFinality)

### Changing Auto-Refresh Interval

**File:** `src/main.ts`

```typescript
// Change from 30000ms (30s) to your preferred interval
setInterval(() => {
  this.fetchAllConstants();
}, 60000); // 60s = 1 minute
```

### Adding More Constants

**File:** `src/main.ts`

```typescript
private constants: ChainConstant[] = [
  // ... existing constants
  {
    id: 'your-constant-id',
    pallet: 'YourPallet',
    constant: 'YourConstant',
    method: 'YourPallet.YourConstant',
    description: 'What this constant does',
    hardcodedValue: 'Optional old value'
  }
];
```

**Find available constants:**
- Visit [Polkadot.js Apps](https://polkadot.js.org/apps/#/chainstate/constants)
- Browse pallets and their constants
- Use same naming in your code

---

## Development Workflow

### 1. Making Changes

```bash
# Start dev server (auto-reloads on save)
npm run dev

# Edit files in src/
# Changes reflect immediately
```

### 2. Code Formatting

```bash
# Format all files
npm run format

# Format is also checked in build
```

### 3. Building for Production

```bash
# Create optimized build
npm run build

# Output in dist/ folder
```

### 4. Testing Production Build

```bash
# Preview production build locally
npm run preview
```

---

## VS Code Setup (Recommended)

### Recommended Extensions

1. **TypeScript** (built-in, ensure enabled)
2. **Prettier** - Code formatter
3. **ESLint** - Linting
4. **Vite** - Better dev experience

### Settings

Create `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

---

## Performance Tips

### 1. Batch Fetching

The dashboard fetches constants sequentially. For better performance with many constants:

```typescript
// Fetch in parallel
await Promise.all(
  constants.map(c => this.fetchConstant(c))
);
```

### 2. Caching

For constants that rarely change:

```typescript
const cache = new Map();

async fetchConstant(constant) {
  const cached = cache.get(constant.id);
  if (cached && Date.now() - cached.timestamp < 60000) {
    return cached.value;
  }
  // Fetch and cache...
}
```

### 3. Selective Refresh

Instead of refreshing all:

```typescript
// Only refresh specific constants
const criticalConstants = ['system-version', 'balances-ed'];
criticalConstants.forEach(id => {
  const constant = this.constants.find(c => c.id === id);
  if (constant) this.fetchConstant(constant);
});
```

---

## Debugging

### Enable Debug Logs

**Browser Console (F12):**
- All operations are logged
- Look for errors in red
- Network tab shows WebSocket

**Add more logging:**

```typescript
// In src/main.ts
private async fetchConstant(constant: ChainConstant) {
  console.log('Fetching:', constant.method);
  try {
    const value = await method();
    console.log('Got value:', value);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Check WebSocket Connection

**Browser Console:**
```javascript
// Check if connected
console.log('Client:', window.client);
console.log('API:', window.dotApi);
```

**Network Tab:**
- Filter by "WS" (WebSocket)
- Check connection status
- View messages sent/received

---

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Build and deploy
npm run build
vercel --prod
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod
```

### Deploy to GitHub Pages

```bash
# Build
npm run build

# Deploy dist/ folder
gh-pages -d dist
```

**Update `vite.config.ts` for GitHub Pages:**
```typescript
export default defineConfig({
  base: '/your-repo-name/',
  // ...
});
```

---

## Next Steps

After setup is complete:

1. **Explore the Dashboard**
   - Click "Fetch All"
   - Watch constants populate
   - Enable/disable auto-refresh
   - Export to JSON

2. **Modify the Code**
   - Add new constants
   - Change styling
   - Adjust refresh interval
   - Add features

3. **Learn More**
   - Read [PAPI docs](https://papi.how)
   - Check [Polkadot Wiki](https://wiki.polkadot.network/)
   - Join community discussions

4. **Build Your Own**
   - Use as template
   - Add to your dApp
   - Customize for your needs

---

## Getting Help

1. **Check this guide** - Most issues covered here
2. **Read README.md** - Comprehensive documentation
3. **Browser console** - Look for error messages
4. **PAPI docs** - [papi.how](https://papi.how)
5. **GitHub issues** - Report bugs
6. **Polkadot Discord** - Community help

---

## Resources

- [PAPI Documentation](https://papi.how)
- [TypedApi Guide](https://papi.how/typed)
- [Constants Reference](https://papi.how/constants)
- [Polkadot Wiki](https://wiki.polkadot.network/)
- [Substrate Docs](https://docs.substrate.io/)

---

**Happy Developing! 🚀**

Remember: The chain IS your configuration. Fetch live, never hardcode!