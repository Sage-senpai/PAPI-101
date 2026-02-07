# 🧪 PAPI TypeScript Test Suite

A cutting-edge, production-ready testing suite demonstrating comprehensive testing strategies for Polkadot API (PAPI) powered decentralized applications with full TypeScript type safety and modern animations.

![PAPI Test Suite](https://img.shields.io/badge/TypeScript-5.7-blue)
![React](https://img.shields.io/badge/React-18.3-61dafb)
![Jest](https://img.shields.io/badge/Jest-29.7-C21325)
![PAPI](https://img.shields.io/badge/PAPI-1.7.8-E6007A)

## 🌟 Features

### Testing Capabilities
- ✅ **Unit Tests** - Isolated testing with Jest + TypeScript
- ✅ **Component Tests** - React Testing Library integration
- ✅ **Type-Safe Mocks** - PAPI response mocking with full type safety
- ✅ **Integration Tests** - Testing PAPI interactions
- ✅ **Coverage Reports** - Comprehensive code coverage tracking
- ✅ **ESM Support** - Modern JavaScript module system

### UI/UX Features
- 🎨 **Cutting-Edge Design** - Modern gradient animations and glassmorphism
- ⚡ **Smooth Animations** - CSS animations with cubic-bezier easing
- 📊 **Real-Time Stats** - Live test execution monitoring
- 🎯 **Interactive Dashboard** - Visual test result display
- 📱 **Responsive Layout** - Mobile-first design approach
- 🌈 **Dynamic Theming** - Animated gradient backgrounds

## 🏗️ Project Structure

```
papi-ts-test-suite/
├── src/
│   ├── components/          # React components
│   │   ├── BalanceDisplay.tsx
│   │   └── BalanceDisplay.test.tsx
│   ├── services/            # Business logic services
│   │   ├── transactionBuilder.ts
│   │   └── transactionBuilder.test.ts
│   ├── hooks/               # Custom React hooks
│   │   └── useChainData.ts
│   ├── utils/               # Utility functions
│   │   ├── validation.ts
│   │   └── validation.test.ts
│   ├── App.tsx              # Main application component
│   ├── App.css              # Application styles
│   ├── main.tsx             # Application entry point
│   ├── index.css            # Global styles
│   └── vite-env.d.ts        # Vite type definitions
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── jest.config.ts           # Jest testing configuration
├── jest.setup.ts            # Jest setup file
├── vite.config.ts           # Vite build configuration
├── .gitignore               # Git ignore rules
└── README.md                # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# Install dependencies
npm install
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci

# Type check without running tests
npm run type-check
```

### Running the UI

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📚 Codebase Explanation

### Core Services

#### `transactionBuilder.ts`
Handles blockchain transaction creation with full type safety:

```typescript
export function buildTransferTransaction({ dest, value, api }: TransferParams)
```

**Features:**
- Validates destination addresses (SS58 format, 48 characters)
- Ensures positive transfer values
- Returns type-safe PAPI transaction objects
- Integrated with Polkadot's `transfer_keep_alive` extrinsic

**Fee Calculator:**
```typescript
export function calculateFee(amount: bigint, feePercentage: number): bigint
```
- Calculates transaction fees as percentage
- Uses BigInt for precision
- Validates fee percentage bounds (0-100%)

### Utilities

#### `validation.ts`
Provides validation utilities for blockchain operations:

**Address Validation:**
- Checks SS58 format compliance
- Validates address length (47-48 characters)
- Verifies network prefix format

**Balance Formatting:**
- Converts BigInt to human-readable format
- Supports configurable decimal places
- Handles edge cases (zero values, no decimals)

**Transfer Validation:**
- Ensures positive amounts
- Checks sufficient balance (including fees)
- Returns structured validation results

### Components

#### `BalanceDisplay.tsx`
React component displaying wallet balances:

**Props:**
```typescript
interface BalanceDisplayProps {
  address: string;  // SS58 address
}
```

**States:**
- Loading: Shows spinner while fetching
- Error: Displays error messages
- Success: Formatted balance display

**Integration:**
- Uses custom `useBalance` hook
- Formats balance with `formatBalance` utility
- Fully tested with React Testing Library

### Hooks

#### `useChainData.ts`
Custom React hook for fetching blockchain data:

```typescript
export function useBalance(address: string): BalanceHookResult
```

**Returns:**
- `data`: Balance as BigInt (null if not loaded)
- `isLoading`: Loading state boolean
- `error`: Error message (null if no error)

### Testing Strategy

#### Unit Tests
**Location:** `*.test.ts` files alongside source

**Coverage:**
- Transaction building logic
- Fee calculations
- Address validation
- Balance formatting
- Transfer amount validation

**Approach:**
- Mock PAPI TypedApi responses
- Test happy paths and error cases
- Verify type safety at compile time
- Use descriptive test names

#### Component Tests
**Location:** `*.test.tsx` files

**Coverage:**
- Component rendering
- State changes
- User interactions
- Error boundaries

**Tools:**
- React Testing Library
- Jest DOM matchers
- Mock custom hooks

### Configuration Files

#### `tsconfig.json`
TypeScript configuration with strict mode:
- Target: ES2020
- Module: ESNext (modern)
- JSX: react-jsx (new transform)
- Strict type checking enabled
- Bundler module resolution

#### `jest.config.ts`
Jest testing configuration:
- Preset: ts-jest with ESM
- Environment: jsdom (browser simulation)
- Coverage thresholds: 80% all metrics
- CSS module mocking
- Setup files configuration

#### `vite.config.ts`
Vite build tool configuration:
- React plugin integration
- Development server on port 3000
- Auto-open browser
- Source map generation

## 🎨 Design System

### Color Palette
```css
--primary: #667eea     /* Indigo */
--secondary: #764ba2   /* Purple */
--success: #10b981     /* Green */
--error: #ef4444       /* Red */
--warning: #f59e0b     /* Orange */
--bg-dark: #0f172a     /* Dark slate */
--bg-light: #1e293b    /* Light slate */
```

### Animations
- **gradientShift**: Background color animation (15s)
- **slideInUp**: Component entrance (0.6s)
- **pulse**: Icon pulsing effect (2s)
- **spin**: Loading spinner (0.8s)
- **shimmer**: Hover effect animation

### Typography
- Primary font: System font stack (-apple-system, BlinkMacSystemFont, etc.)
- Monospace: 'Courier New' for code/console
- Font weights: 400, 500, 600, 700, 800

## 🧠 Testing Philosophy

### Type Safety First
PAPI's automatically generated types from on-chain metadata provide compile-time safety, reducing the need for extensive runtime testing. Our tests focus on:

1. **Business Logic Validation** - Ensuring correct calculations and transformations
2. **Error Handling** - Verifying proper error states and messages
3. **Integration Points** - Testing PAPI API interactions
4. **User Experience** - Component behavior and rendering

### Test Pyramid

```
        /\
       /  \      E2E Tests (Manual/Future)
      /    \     
     /------\    Integration Tests (PAPI + Hooks)
    /        \   
   /----------\  Component Tests (React Testing Library)
  /            \ 
 /--------------\ Unit Tests (Business Logic)
```

### Coverage Goals
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

## 🔧 Development Workflow

### Adding New Tests

1. **Create test file:** `filename.test.ts` or `filename.test.tsx`
2. **Import dependencies:**
   ```typescript
   import { describe, it, expect } from '@jest/globals';
   ```
3. **Write tests:**
   ```typescript
   describe('Feature Name', () => {
     it('should do something', () => {
       expect(result).toBe(expected);
     });
   });
   ```
4. **Run tests:** `npm test`

### Adding New Components

1. **Create component:** `src/components/ComponentName.tsx`
2. **Create test:** `src/components/ComponentName.test.tsx`
3. **Import in App:** `import ComponentName from './components/ComponentName'`
4. **Add to UI:** Use component in App.tsx

### Mock Patterns

#### Mocking PAPI API
```typescript
const createMockApi = () => ({
  tx: {
    Balances: {
      transfer_keep_alive: jest.fn((params: any) => ({
        sign: jest.fn(),
        submit: jest.fn(),
        callData: '0xmockCallData',
      })),
    },
  },
} as unknown as TypedApi<typeof dot>);
```

#### Mocking Hooks
```typescript
jest.mock('../hooks/useChainData');
jest.spyOn(useChainDataModule, 'useBalance').mockReturnValue({
  data: 25000000000n,
  isLoading: false,
  error: null,
});
```

## 📊 Test Coverage

Run coverage report:
```bash
npm run test:coverage
```

View coverage report:
```bash
open coverage/lcov-report/index.html
```

Coverage is generated in:
- `coverage/` directory
- `coverage/lcov-report/index.html` for HTML view
- `coverage/lcov.info` for CI integration

## 🚨 Common Issues & Solutions

### Issue: Jest ESM errors
**Solution:** Ensure `"type": "module"` in package.json and use `node --experimental-vm-modules`

### Issue: TypeScript compilation errors
**Solution:** Run `npm run type-check` to see detailed errors

### Issue: Tests timeout
**Solution:** Increase Jest timeout in test files:
```typescript
jest.setTimeout(10000);
```

### Issue: Mock not working
**Solution:** Clear mocks in `beforeEach`:
```typescript
beforeEach(() => {
  jest.clearAllMocks();
});
```

## 🔐 Best Practices

### 1. Type Safety
- Always use TypeScript strict mode
- Avoid `any` types
- Use PAPI's generated types
- Define explicit interfaces

### 2. Test Organization
- Group related tests with `describe`
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Keep tests isolated and independent

### 3. Mocking Strategy
- Mock external dependencies
- Don't mock the system under test
- Reset mocks between tests
- Use type-safe mocks

### 4. Code Quality
- Maintain 80%+ test coverage
- Write self-documenting code
- Use meaningful variable names
- Keep functions small and focused

### 5. Performance
- Use `beforeEach` for setup
- Avoid unnecessary re-renders
- Optimize expensive operations
- Use React.memo when needed

## 📈 Performance Metrics

- **Test Suite Execution**: ~2-3 seconds
- **Type Checking**: ~1 second
- **Build Time**: ~5 seconds
- **Dev Server Start**: ~1 second
- **Hot Module Reload**: <100ms

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- **Polkadot API (PAPI)** - For type-safe blockchain interactions
- **Jest** - For comprehensive testing framework
- **React Testing Library** - For component testing utilities
- **Vite** - For lightning-fast build tooling

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check existing issues first
- Provide minimal reproduction

## 🎯 Roadmap

- [ ] Add E2E tests with Playwright
- [ ] Implement visual regression testing
- [ ] Add performance benchmarks
- [ ] Create CI/CD pipeline
- [ ] Add more PAPI integration examples
- [ ] Implement snapshot testing
- [ ] Add mutation testing

---

**Built with ❤️ for the Polkadot ecosystem**