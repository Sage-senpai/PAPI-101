export interface BundleModule {
  name: string;
  size: number; // in bytes
  gzipped: number;
  brotli: number;
  dynamicImport: boolean;
  importPath: string;
}

export interface ImportStrategy {
  id: string;
  name: string;
  description: string;
  code: string;
  modules: BundleModule[];
  totalSize: number;
  totalGzipped: number;
  performanceScore: number; // 0-100
}

// Simulated bundle sizes for PAPI modules
export const PAPI_MODULES: BundleModule[] = [
  {
    name: 'papi-client',
    size: 45200,
    gzipped: 15300,
    brotli: 13200,
    dynamicImport: true,
    importPath: "import('polkadot-api/client')",
  },
  {
    name: 'sm-provider',
    size: 28700,
    gzipped: 9800,
    brotli: 8500,
    dynamicImport: true,
    importPath: "import('polkadot-api/sm-provider')",
  },
  {
    name: 'ws-provider',
    size: 18300,
    gzipped: 6200,
    brotli: 5400,
    dynamicImport: true,
    importPath: "import('polkadot-api/ws-provider')",
  },
  {
    name: 'polkadot-descriptors',
    size: 156800,
    gzipped: 42300,
    brotli: 38700,
    dynamicImport: true,
    importPath: "import('@polkadot-api/descriptors')",
  },
  {
    name: 'papi-full',
    size: 348200,
    gzipped: 98600,
    brotli: 87400,
    dynamicImport: false,
    importPath: "import('polkadot-api')",
  },
];

export const IMPORT_STRATEGIES: ImportStrategy[] = [
  {
    id: 'monolithic',
    name: 'Monolithic Import',
    description: 'Import entire PAPI at once - simple but heavy',
    code: `import { createClient } from 'polkadot-api';
import { getSmProvider } from 'polkadot-api';`,
    modules: [PAPI_MODULES[4]], // Full bundle
    totalSize: 348200,
    totalGzipped: 98600,
    performanceScore: 35,
  },
  {
    id: 'dynamic-client',
    name: 'Dynamic Client Only',
    description: 'Dynamically import only the client when needed',
    code: `const { createClient } = await import('polkadot-api/client');
// Rest imported on-demand`,
    modules: [PAPI_MODULES[0]],
    totalSize: 45200,
    totalGzipped: 15300,
    performanceScore: 75,
  },
  {
    id: 'fully-dynamic',
    name: 'Fully Dynamic',
    description: 'Import every module dynamically on-demand',
    code: `const { createClient } = await import('polkadot-api/client');
const { getSmProvider } = await import('polkadot-api/sm-provider');
const { dot } = await import('@polkadot-api/descriptors');`,
    modules: [PAPI_MODULES[0], PAPI_MODULES[1], PAPI_MODULES[3]],
    totalSize: 230700,
    totalGzipped: 67400,
    performanceScore: 90,
  },
  {
    id: 'hybrid',
    name: 'Hybrid Approach',
    description: 'Critical modules upfront, heavy ones dynamic',
    code: `import { createClient } from 'polkadot-api/client';
const { dot } = await import('@polkadot-api/descriptors');`,
    modules: [PAPI_MODULES[0], PAPI_MODULES[3]],
    totalSize: 202000,
    totalGzipped: 57600,
    performanceScore: 85,
  },
];

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function calculateSavings(strategy: ImportStrategy): {
  sizeSaved: number;
  percentSaved: number;
  loadTimeSaved: number; // in ms
} {
  const monolithic = IMPORT_STRATEGIES[0];
  const sizeSaved = monolithic.totalSize - strategy.totalSize;
  const percentSaved = (sizeSaved / monolithic.totalSize) * 100;
  const loadTimeSaved = (sizeSaved / 1024) * 3; // Rough estimate: 3ms per KB
  
  return {
    sizeSaved,
    percentSaved,
    loadTimeSaved: Math.round(loadTimeSaved),
  };
}