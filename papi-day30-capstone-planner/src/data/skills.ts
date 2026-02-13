import { Skill } from '../types/plan.types';

export const allSkills: Skill[] = [
  // Week 1
  { day: 1, title: 'PAPI Installation & Setup', category: 'setup', description: 'npm i polkadot-api, generate descriptors' },
  { day: 2, title: 'Add Chain & Generate Types', category: 'setup', description: 'npx papi add dot -n polkadot' },
  { day: 3, title: 'Provider Choice (Smoldot/WSS)', category: 'setup', description: 'Light‑client vs WebSocket' },
  { day: 4, title: 'TypedApi Instance', category: 'setup', description: 'client.getTypedApi(dot)' },
  { day: 5, title: 'Reading Constants', category: 'read', description: 'api.constants.System.Version()' },
  { day: 6, title: 'Querying Storage', category: 'read', description: 'api.query.Balances.Account.getValue()' },
  { day: 7, title: 'Runtime APIs', category: 'read', description: 'api.apis.Metadata.metadata()' },
  // Week 2
  { day: 8, title: 'Chain Info Dashboard', category: 'read', description: 'Combine constants, storage, runtime' },
  { day: 9, title: 'Build Transaction (tx)', category: 'tx', description: 'api.tx.Balances.transfer_keep_alive' },
  { day: 10, title: 'txFromCallData', category: 'tx', description: 'Decode hex call data' },
  { day: 11, title: 'Sign with Polkadot.js Extension', category: 'tx', description: 'Browser extension integration' },
  { day: 12, title: 'Private Key Signing', category: 'tx', description: 'Node.js offline signing' },
  { day: 13, title: 'Multi-Chain Setup', category: 'advanced', description: 'Add Kusama, connect multiple chains' },
  { day: 14, title: 'Observables vs Promises', category: 'read', description: 'watchValue() subscriptions' },
  // Week 3
  { day: 15, title: 'Multi-Chain Balance Fetcher', category: 'read', description: 'Query multiple chains' },
  { day: 16, title: 'Handling Events', category: 'advanced', description: 'Subscribe to Balances.Transfer' },
  { day: 17, title: 'Error Handling & Validation', category: 'advanced', description: 'try/catch, input validation' },
  { day: 18, title: 'Dynamic Imports & Performance', category: 'deploy', description: 'Code splitting, bundle optimization' },
  { day: 19, title: 'Type Generation Deep Dive', category: 'setup', description: 'Custom chains, inspect descriptors' },
  { day: 20, title: 'Compatibility Checks', category: 'deploy', description: 'Runtime upgrade compatibility' },
  // Week 4
  { day: 21, title: 'Event Monitor', category: 'advanced', description: 'Real-time event tracking' },
  { day: 22, title: 'dApp Frontend Integration', category: 'deploy', description: 'React + PAPI hooks' },
  { day: 23, title: 'Backend Service with PAPI', category: 'deploy', description: 'Node.js Express + PAPI' },
  { day: 24, title: 'Cross-Chain dApp', category: 'advanced', description: 'Use multiple TypedApi instances' },
  { day: 25, title: 'Advanced Transactions (Batch)', category: 'tx', description: 'Utility.batch calls' },
  { day: 26, title: 'Integrating with Indexers', category: 'advanced', description: 'SubQuery / Subsquid' },
  { day: 27, title: 'Testing Your dApp', category: 'deploy', description: 'Jest, React Testing Library' },
  { day: 28, title: 'Deployment & Optimization', category: 'deploy', description: 'Vercel/Netlify, bundle analysis' },
  { day: 29, title: 'Community Showcase', category: 'deploy', description: 'Share your project' },
  { day: 30, title: 'Capstone Planning', category: 'advanced', description: 'Design your own dApp' },
];

export const availableChains = [
  { id: 'dot', name: 'Polkadot', descriptor: 'dot', wsUrl: 'wss://rpc.polkadot.io', icon: '🟣' },
  { id: 'ksm', name: 'Kusama', descriptor: 'ksm', wsUrl: 'wss://kusama-rpc.polkadot.io', icon: '⚫' },
  { id: 'westend', name: 'Westend', descriptor: 'wnd', wsUrl: 'wss://westend-rpc.polkadot.io', icon: '🟡' },
  { id: 'paseo', name: 'Paseo', descriptor: 'pas', wsUrl: 'wss://paseo-rpc.dwellir.com', icon: '🔵' },
];