// ============================================================================
// FILE: papi-event-orchestrator/src/data/chainConfig.ts
// PURPOSE: Chain configuration and event type definitions
// STATUS: FIXED - All data structures properly defined for teaching/learning
// ============================================================================

export interface ChainConfig {
  id: string;
  name: string;
  wsEndpoint: string;
  color: string;
  testnet: boolean;
  supportedEvents: string[];
  status?: 'connected' | 'connecting' | 'disconnected';
}

export interface EventType {
  id: string;
  name: string;
  description: string;
  severity: 'info' | 'warning' | 'danger' | 'success';
  chains: string[];
  importance: number; // 1-10 scale
}

// Chain configurations with real WebSocket endpoints
// Day 13: Multi-Chain Setup - demonstrates connecting to multiple chains
export const CHAINS: ChainConfig[] = [
  {
    id: 'polkadot',
    name: 'Polkadot',
    wsEndpoint: 'wss://rpc.polkadot.io',
    color: '#E6007A', // Official Polkadot pink
    testnet: false,
    supportedEvents: [
      'Balances.Transfer',        // Native token transfers
      'Staking.Rewarded',         // Staking rewards to validators
      'Staking.Slashed',          // Validator slash events
      'Democracy.Proposed',       // New governance proposals
      'Treasury.Deposit',         // Treasury fund deposits
    ],
    status: 'disconnected',
  },
  {
    id: 'kusama',
    name: 'Kusama',
    wsEndpoint: 'wss://kusama-rpc.polkadot.io',
    color: '#000000', // Kusama black
    testnet: false,
    supportedEvents: [
      'Balances.Transfer',
      'Staking.Rewarded',
      'Crowdloan.Contributed',    // Parachain crowdloan contributions
      'ParachainStaking.Rewarded', // Parachain staking rewards
    ],
    status: 'disconnected',
  },
  {
    id: 'westend',
    name: 'Westend',
    wsEndpoint: 'wss://westend-rpc.polkadot.io',
    color: '#DA68A7', // Westend pink/purple
    testnet: true, // Flag as testnet
    supportedEvents: [
      'Balances.Transfer',
      'System.NewAccount',        // New account creation events
      'Utility.BatchCompleted',   // Batch transaction completion
      'Sudo.Sudid',               // Sudo execution events
    ],
    status: 'disconnected',
  },
];

// Event type registry
// Day 14: Observables & Event Handling - defines event structure for real-time streaming
export const EVENT_TYPES: EventType[] = [
  {
    id: 'balances.transfer',
    name: 'Balances.Transfer',
    description: 'Transfer of native tokens between accounts',
    severity: 'info',
    chains: ['polkadot', 'kusama', 'westend'],
    importance: 8, // High importance for general tracking
  },
  {
    id: 'staking.rewarded',
    name: 'Staking.Rewarded',
    description: 'Staking rewards distributed to validators/nominators',
    severity: 'success', // Positive event
    chains: ['polkadot', 'kusama'],
    importance: 9, // Very important for validators
  },
  {
    id: 'staking.slashed',
    name: 'Staking.Slashed',
    description: 'Validator/nominator slashed for misbehavior',
    severity: 'danger', // Critical alert
    chains: ['polkadot', 'kusama'],
    importance: 10, // Highest priority
  },
  {
    id: 'democracy.proposed',
    name: 'Democracy.Proposed',
    description: 'New democracy proposal submitted',
    severity: 'warning', // Needs attention
    chains: ['polkadot', 'kusama'],
    importance: 7,
  },
  {
    id: 'treasury.deposit',
    name: 'Treasury.Deposit',
    description: 'Funds deposited to treasury',
    severity: 'info',
    chains: ['polkadot', 'kusama'],
    importance: 6,
  },
  {
    id: 'system.newaccount',
    name: 'System.NewAccount',
    description: 'New account created on-chain',
    severity: 'info',
    chains: ['westend'],
    importance: 5,
  },
];

// Utility function for getting chain by ID
// Day 19: Type Safety - demonstrates type-safe helper functions
export const getChainById = (chainId: string): ChainConfig | undefined => {
  return CHAINS.find(chain => chain.id === chainId);
};

// Utility function for getting event type by ID
export const getEventTypeById = (eventId: string): EventType | undefined => {
  return EVENT_TYPES.find(event => event.id === eventId);
};

// Filter events by chain
// Day 16: Event Handling - demonstrates event filtering logic
export const filterEventsByChain = (
  events: EventType[],
  chainId: string
): EventType[] => {
  return events.filter(event => event.chains.includes(chainId));
};

// Get event severity color mapping
// Day 18: Performance Optimization - memoizable color mapping
export const getSeverityColor = (severity: string): string => {
  const colorMap: Record<string, string> = {
    danger: '#ef4444',    // Red
    warning: '#f59e0b',   // Amber
    success: '#10b981',   // Green
    info: '#3b82f6',      // Blue
  };
  return colorMap[severity] || '#6b7280'; // Default gray
};